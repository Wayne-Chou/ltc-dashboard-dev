/**
 * =================================================
 * 群體日期區間比較（Group Compare）
 * =================================================
 *
 * 【這支在做什麼？】
 * 讓使用者選擇「兩個日期區間」，比較：
 * - 群體平均坐站秒數
 * - 群體平均平衡得分
 * - 群體平均步行速度
 * - 群體平均跌倒風險
 *
 * ⚠️ 重要觀念（一定要知道）：
 * 本比較是「群體平均值 vs 群體平均值」
 * 不是：
 *  - 同一個人前後比較
 *  - 逐人配對分析
 *
 * 只要選的日期區間內有資料，就會納入計算
 */

/**
 * =================================================
 * 全域狀態（建議在 state.js 初始化）
 * =================================================
 *
 * window.groupCompareState = {
 *   enabled: false,             // 是否啟用比較
 *   groupA: {
 *     start: null,              // 第一個日期區間開始日
 *     end: null,                // 第一個日期區間結束日
 *     assessments: []           // 該區間內的所有 assessments
 *   },
 *   groupB: {
 *     start: null,
 *     end: null,
 *     assessments: []
 *   }
 * }
 */

/* =================================================
 * 依日期區間取得 assessments（純資料處理）
 * =================================================
 *
 * 說明：
 * - 一個 assessment = 一次群體檢測（通常是某一天）
 * - 這裡只是把「日期落在區間內」的資料撈出來
 * - 不做平均、不做顯示
 */
function getAssessmentsByRange(start, end) {
  const source = window.currentAssessments || [];
  if (!start || !end) return [];

  return source.filter((item) => {
    const d = new Date(item.Date);
    return d >= start && d <= end;
  });
}

/* =================================================
 * 計算群體摘要（最核心的計算邏輯）
 * =================================================
 *
 * ⚠️ 這裡是所有「數字怎麼來」的地方
 *
 * 計算方式總結：
 * 1. 一個日期區間內，可能有 1 筆或多筆 assessments
 * 2. 每一筆 assessment 本身已經是「群體平均結果」
 * 3. 這裡再對這些 assessment 做「平均」
 *
 * 👉 結果是「該日期區間的群體平均狀態」
 */
function calcGroupSummary(assessments = []) {
  /**
   * 【總檢測人次】
   * 直接把每一筆 assessment 的 Count 加總
   * 代表這段期間內，總共做了幾次檢測
   */
  const totalVisits = assessments.reduce(
    (sum, item) => sum + (item.Count || 0),
    0
  );

  /**
   * 【unique 人數】
   * 從 VIVIFRAIL 裡面，把所有人的 Name 抓出來
   * 再用 Set 去重
   *
   * 👉 用來回答：「這段期間大約涵蓋多少不同的人」
   */
  const allNames = [];
  assessments.forEach((item) => {
    if (item.VIVIFRAIL) {
      Object.values(item.VIVIFRAIL).forEach((group) => {
        group.forEach((p) => p?.Name && allNames.push(p.Name));
      });
    }
  });
  const uniquePeople = new Set(allNames).size;

  /**
   * 平均值小工具
   * - 如果陣列是空的，回傳 0
   */
  const avg = (arr) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  /**
   * =================================================
   * 各指標的「群體平均值」怎麼算？
   * =================================================
   *
   * 以「平均坐站秒數」為例：
   *
   * 假設某日期區間內有 2 筆 assessment：
   *   - 第一天 ChairSecond = 10.0
   *   - 第二天 ChairSecond = 12.0
   *
   * 那這個日期區間的 avgChair =
   *   (10.0 + 12.0) / 2 = 11.0 秒
   *
   * 下面四個指標都是一樣的邏輯
   */
  const chairArr = assessments
    .map((x) => Number(x.ChairSecond))
    .filter((x) => !Number.isNaN(x));

  const balanceArr = assessments
    .map((x) => Number(x.BalanceScore))
    .filter((x) => !Number.isNaN(x));

  const gaitArr = assessments
    .map((x) => Number(x.GaitSpeed))
    .filter((x) => !Number.isNaN(x));

  const riskArr = assessments
    .map((x) => Number(x.RiskRate))
    .filter((x) => !Number.isNaN(x));

  /**
   * =================================================
   * Vivifrail 各等級人數
   * =================================================
   *
   * 只是把每一筆 assessment 中：
   * A / B / C / D 的人數加總
   *
   * 👉 這裡沒有做比例，只是純人數
   */
  let countA = 0,
    countB = 0,
    countC = 0,
    countD = 0;

  assessments.forEach((item) => {
    const V = item.VIVIFRAIL || {};
    countA += V.A?.length || 0;
    countB += V.B?.length || 0;
    countC += V.C?.length || 0;
    countD += V.D?.length || 0;
  });

  return {
    assessmentsCount: assessments.length,
    uniquePeople,
    totalVisits,

    // 群體平均值（重點）
    avgChair: avg(chairArr),
    avgBalance: avg(balanceArr),
    avgGait: avg(gaitArr),
    avgRisk: avg(riskArr),

    countA,
    countB,
    countC,
    countD,
  };
}

/* =================================================
 * 計算變化百分比（第二區間 相對 第一區間）
 * =================================================
 *
 * 計算公式：
 *   (後 - 前) / 前 * 100
 *
 * 例：
 *   前 = 10.0
 *   後 = 11.0
 *   → (11 - 10) / 10 = +10%
 */
function diffPercent(a, b) {
  if (!a) return 0;
  return (((b - a) / a) * 100).toFixed(1);
}

/* =================================================
 * 渲染比較結果（表格）
 * =================================================
 *
 * 【顏色怎麼決定？】
 *
 * 不是單純「變大就綠、變小就紅」
 * 而是看「這個指標是越高越好，還是越低越好」
 *
 * - better = "higher"
 *   → 數值上升 = 改善（綠）
 *   → 數值下降 = 退步（紅）
 *
 * - better = "lower"
 *   → 數值下降 = 改善（綠）
 *   → 數值上升 = 退步（紅）
 */
function renderGroupCompareResult(summaryA, summaryB) {
  const container = document.getElementById("groupCompareResult");
  if (!container) return;

  const row = (label, a, b, unit = "", better = "higher") => {
    const diff = Number(diffPercent(a, b));

    let cls = "text-muted";
    let icon = "—";

    if (diff > 0) {
      cls = better === "higher" ? "text-success" : "text-danger";
      icon = better === "higher" ? "▲" : "▼";
    } else if (diff < 0) {
      cls = better === "higher" ? "text-danger" : "text-success";
      icon = better === "higher" ? "▼" : "▲";
    }

    return `
      <tr>
        <td>${label}</td>
        <td>${a.toFixed(1)}${unit}</td>
        <td>${b.toFixed(1)}${unit}</td>
        <td class="fw-semibold ${cls}">
          ${icon} ${Math.abs(diff)}%
        </td>
      </tr>
    `;
  };

  container.innerHTML = `
    <div class="mb-3 d-flex justify-content-between flex-wrap gap-2 small">
      <div>第一個日期區間｜人數 ${summaryA.uniquePeople}｜人次 ${
    summaryA.totalVisits
  }</div>
      <div>第二個日期區間｜人數 ${summaryB.uniquePeople}｜人次 ${
    summaryB.totalVisits
  }</div>
    </div>

    <div class="table-responsive">
      <table class="table table-sm align-middle">
        <thead class="table-light">
          <tr>
            <th>指標</th>
            <th>第一區間</th>
            <th>第二區間</th>
            <th>變化</th>
          </tr>
        </thead>
        <tbody>
          ${row(
            "平均坐站秒數",
            summaryA.avgChair,
            summaryB.avgChair,
            " 秒",
            "lower"
          )}
          ${row(
            "平均平衡得分",
            summaryA.avgBalance,
            summaryB.avgBalance,
            "",
            "higher"
          )}
          ${row(
            "平均步行速度",
            summaryA.avgGait,
            summaryB.avgGait,
            " cm/s",
            "higher"
          )}
          ${row(
            "平均跌倒風險",
            summaryA.avgRisk,
            summaryB.avgRisk,
            " %",
            "lower"
          )}
        </tbody>
      </table>
    </div>
  `;
}

/* =================================================
 * 渲染比較結果（視覺統一優化版）
 * ================================================= */
function renderGroupCompare() {
  const st = window.groupCompareState;
  const container = document.getElementById("groupCompareResult");
  if (!container) return;

  // 1. 樣式 A：未啟用模式
  if (!st?.enabled) {
    container.innerHTML = `
      <div class="compare-placeholder">
        <div class="icon-circle text-secondary"><i class="bi bi-power"></i></div>
        <h6 class="fw-bold">尚未啟用比較模式</h6>
        <p class="text-muted small">請開啟右上方開關，開始進行兩段日期區間的數據對照</p>
      </div>
    `;
    return;
  }

  const hasA = st.groupA.start && st.groupA.end;
  const hasB = st.groupB.start && st.groupB.end;

  // 2. 樣式 B：等待日期選取
  if (!hasA || !hasB) {
    container.innerHTML = `
      <div class="compare-placeholder active">
        <div class="icon-circle text-primary"><i class="bi bi-cursor-fill"></i></div>
        <h6 class="fw-bold text-primary">等待日期區間選取</h6>
        <p class="text-muted small">請點擊上方輸入框，設定基準期與對照期的日期範圍</p>
      </div>
    `;
    return;
  }

  // 3. 樣式 C：時間順序邏輯錯誤 (統一視覺)
  if (st.groupA.end > st.groupB.start) {
    container.innerHTML = `
      <div class="compare-placeholder border-danger bg-light-danger">
        <div class="icon-circle text-danger"><i class="bi bi-calendar-x"></i></div>
        <h6 class="fw-bold text-danger">日期順序不正確</h6>
        <p class="text-muted small">對照期（第二區間）的開始日期，必須晚於基準期（第一區間）的結束日期</p>
        <button class="btn btn-sm btn-outline-danger mt-2" onclick="window.fpGroupB.clear()">重新選擇第二區間</button>
      </div>
    `;
    return;
  }

  const a = st.groupA.assessments || [];
  const b = st.groupB.assessments || [];

  // 4. 樣式 D：區間內查無資料
  if (!a.length || !b.length) {
    const missing = !a.length ? "基準期" : "對照期";
    container.innerHTML = `
      <div class="compare-placeholder border-warning bg-light-warning">
        <div class="icon-circle text-warning"><i class="bi bi-database-exclamation"></i></div>
        <h6 class="fw-bold text-dark">該區間查無檢測資料</h6>
        <p class="text-muted small">您的「${missing}」所選範圍內沒有任何紀錄，請嘗試選擇其他日期</p>
      </div>
    `;
    return;
  }

  // 5. 樣式 E：正式數據表格
  renderGroupCompareResultTable(calcGroupSummary(a), calcGroupSummary(b));
}

/* =================================================
 * 正式結果渲染 (與您之前的內容一致，僅確保單位與樣式)
 * ================================================= */
function renderGroupCompareResultTable(summaryA, summaryB) {
  const container = document.getElementById("groupCompareResult");

  const riskDiff = Number(diffPercent(summaryA.avgRisk, summaryB.avgRisk));
  const riskTrendClass = riskDiff <= 0 ? "text-success" : "text-danger";
  const riskTrendText = riskDiff <= 0 ? "風險改善" : "風險上升";

  const row = (label, a, b, unit = "", better = "higher") => {
    const diff = Number(diffPercent(a, b));
    let cls = "text-muted",
      icon = "—";
    if (diff > 0) {
      cls = better === "higher" ? "text-success" : "text-danger";
      icon = better === "higher" ? "▲" : "▼";
    } else if (diff < 0) {
      cls = better === "higher" ? "text-danger" : "text-success";
      icon = better === "higher" ? "▼" : "▲";
    }
    return `
      <tr>
        <td class="py-3 fw-bold text-secondary">${label}</td>
        <td class="py-3">${a.toFixed(1)}${unit}</td>
        <td class="py-3">${b.toFixed(1)}${unit}</td>
        <td class="py-3 fw-bold ${cls}">${icon} ${Math.abs(diff)}%</td>
      </tr>
    `;
  };

  container.innerHTML = `
    <div class="row g-2 mb-4">
      <div class="col-md-6">
        <div class="p-3 border rounded-3 bg-light">
          <div class="small text-muted mb-1">基準期：${
            summaryA.uniquePeople
          } 人 / ${summaryA.totalVisits} 人次</div>
          <div class="h5 fw-bold mb-0 text-dark">平均風險：${summaryA.avgRisk.toFixed(
            1
          )}%</div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="p-3 border rounded-3 ${
          riskDiff <= 0 ? "border-success" : "border-danger"
        } bg-white">
          <div class="small text-muted mb-1">對照期：${
            summaryB.uniquePeople
          } 人 / ${summaryB.totalVisits} 人次</div>
          <div class="h5 fw-bold mb-0 ${riskTrendClass}">${riskTrendText} ${Math.abs(
    riskDiff
  )}%</div>
        </div>
      </div>
    </div>

    <div class="table-responsive rounded border shadow-sm">
      <table class="table table-hover align-middle mb-0 bg-white">
        <thead class="bg-light">
          <tr>
            <th class="text-secondary small">指標</th>
            <th class="text-secondary small">基準期</th>
            <th class="text-secondary small">對照期</th>
            <th class="text-secondary small">變化</th>
          </tr>
        </thead>
        <tbody>
          ${row(
            "平均坐站秒數",
            summaryA.avgChair,
            summaryB.avgChair,
            " 秒",
            "lower"
          )}
          ${row(
            "平均平衡得分",
            summaryA.avgBalance,
            summaryB.avgBalance,
            " 分",
            "higher"
          )}
          ${row(
            "平均步行速度",
            summaryA.avgGait,
            summaryB.avgGait,
            " cm/s",
            "higher"
          )}
          ${row(
            "平均跌倒風險",
            summaryA.avgRisk,
            summaryB.avgRisk,
            " %",
            "lower"
          )}
        </tbody>
      </table>
    </div>
  `;
}

/* =================================================
 * 初始化（事件綁定、flatpickr）
 * ================================================= */
function initGroupCompare() {
  const toggle = document.getElementById("groupCompareToggle");
  const inputA = document.getElementById("groupA-range");
  const inputB = document.getElementById("groupB-range");

  if (!toggle || !inputA || !inputB || typeof flatpickr === "undefined") return;

  // 1. 初始狀態設定
  inputA.disabled = !window.groupCompareState.enabled;
  inputB.disabled = !window.groupCompareState.enabled;

  // 2. 開關切換邏輯
  toggle.addEventListener("change", () => {
    const enabled = toggle.checked;
    window.groupCompareState.enabled = enabled;
    inputA.disabled = !enabled;
    inputB.disabled = !enabled;

    if (!enabled) {
      window.fpGroupA.clear();
      window.fpGroupB.clear();
      window.groupCompareState.groupA = {
        start: null,
        end: null,
        assessments: [],
      };
      window.groupCompareState.groupB = {
        start: null,
        end: null,
        assessments: [],
      };
    }
    renderGroupCompare();
  });

  // 3. 第一區間選擇器
  window.fpGroupA = flatpickr(inputA, {
    mode: "range",
    dateFormat: "Y-m-d",
    locale: getFlatpickrLocale(window.currentLang),
    onChange: ([start, end]) => {
      if (start && end) {
        window.groupCompareState.groupA = {
          start,
          end,
          assessments: getAssessmentsByRange(start, end),
        };
        renderGroupCompare();
      }
    },
  });

  // 4. 第二區間選擇器（已移除 Alert，統一交給 Render 判斷）
  window.fpGroupB = flatpickr(inputB, {
    mode: "range",
    dateFormat: "Y-m-d",
    locale: getFlatpickrLocale(window.currentLang),
    onChange: ([start, end]) => {
      if (start && end) {
        // 純粹更新狀態，不論日期對錯
        window.groupCompareState.groupB = {
          start,
          end,
          assessments: getAssessmentsByRange(start, end),
        };
        // 由 render 函數根據 state 顯示「正確表格」或「日期錯誤提示」
        renderGroupCompare();
      }
    },
  });

  // 5. 清除按鈕邏輯
  document.getElementById("clearGroupA")?.addEventListener("click", () => {
    window.fpGroupA.clear();
    window.groupCompareState.groupA = {
      start: null,
      end: null,
      assessments: [],
    };
    renderGroupCompare();
  });

  document.getElementById("clearGroupB")?.addEventListener("click", () => {
    window.fpGroupB.clear();
    window.groupCompareState.groupB = {
      start: null,
      end: null,
      assessments: [],
    };
    renderGroupCompare();
  });

  // 執行初始渲染
  renderGroupCompare();
}
