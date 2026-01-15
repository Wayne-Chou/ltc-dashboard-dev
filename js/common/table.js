// // js/common/table.js

// function initTable() {
//   window.currentPage = 1;

//   //  保險初始化
//   if (!Array.isArray(window.selected)) window.selected = [];
//   if (typeof window.checkAllAcrossPages !== "boolean")
//     window.checkAllAcrossPages = false;
//   if (!window.pageSize) window.pageSize = 10;

//   //  關鍵：要綁全選/取消全選
//   initCheckAllButtons();
// }

// // ===== 表格渲染 =====
// function renderAssessmentTable(assessments) {
//   window.lastRenderedAssessments = assessments;

//   const tbody = document.getElementById("assessmentTableBody");
//   const pagination = document.getElementById("tablePaginationContainer");

//   if (!tbody || !pagination) return;

//   tbody.innerHTML = "";
//   pagination.innerHTML = "";

//   if (!assessments || assessments.length === 0) return;

//   // 日期排序（新 → 舊）
//   const sorted = [...assessments].sort((a, b) => b.Date - a.Date);

//   const totalPages = Math.ceil(sorted.length / window.pageSize);
//   if (window.currentPage > totalPages) window.currentPage = totalPages;
//   if (window.currentPage < 1) window.currentPage = 1;

//   const start = (window.currentPage - 1) * window.pageSize;
//   const pageData = sorted.slice(start, start + window.pageSize);

//   // 初始全選（如果你想保留）
//   if (window.checkAllAcrossPages && window.selected.length === 0) {
//     window.selected = assessments.map((_, i) => i);
//   }

//   pageData.forEach((item) => {
//     const tr = document.createElement("tr");

//     const date = new Date(item.Date);
//     const dateText = `${date.getFullYear()}/${(date.getMonth() + 1)
//       .toString()
//       .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;

//     const globalIndex = assessments.indexOf(item);
//     const checked = window.selected.includes(globalIndex);

//     tr.innerHTML = `
//       <td><input type="checkbox" class="row-check" data-index="${globalIndex}" ${
//       checked ? "checked" : ""
//     }></td>
//       <td>${dateText}</td>
//       <td>${item.Count}${t("people")}</td>
//       <td>${item.ChairSecond.toFixed(1)}${t("seconds")}</td>
//       <td>${item.BalanceScore.toFixed(1)}${t("points")}</td>
//       <td>${item.GaitSpeed.toFixed(1)} cm/s</td>
//       <td>${item.RiskRate.toFixed(1)}%</td>
//     `;

//     tbody.appendChild(tr);
//   });

//   bindRowCheckbox(assessments);
//   renderPagination(totalPages, assessments);

//   syncUIBySelection(assessments);
// }

// // ===== checkbox 綁定 =====
// function bindRowCheckbox(assessments) {
//   document.querySelectorAll(".row-check").forEach((cb) => {
//     cb.addEventListener("change", () => {
//       const idx = parseInt(cb.dataset.index, 10);

//       if (cb.checked) {
//         if (!window.selected.includes(idx)) window.selected.push(idx);
//       } else {
//         window.selected = window.selected.filter((i) => i !== idx);
//       }

//       window.checkAllAcrossPages =
//         window.selected.length === assessments.length;

//       syncUIBySelection(assessments);
//     });
//   });
// }

// // ===== 分頁 =====
// function renderPagination(totalPages, assessments) {
//   if (totalPages <= 1) return;

//   const pagination = document.getElementById("tablePaginationContainer");
//   if (!pagination) return;

//   const prev = document.createElement("button");
//   prev.className = "btn btn-sm btn-outline-primary";
//   prev.textContent = t("prevPage");
//   prev.disabled = window.currentPage === 1;
//   prev.onclick = () => {
//     window.currentPage--;
//     renderAssessmentTable(assessments);
//   };

//   const next = document.createElement("button");
//   next.className = "btn btn-sm btn-outline-primary";
//   next.textContent = t("nextPage");
//   next.disabled = window.currentPage === totalPages;
//   next.onclick = () => {
//     window.currentPage++;
//     renderAssessmentTable(assessments);
//   };

//   const info = document.createElement("span");
//   info.className = "small flex-grow-1 text-center";
//   info.textContent = `${t("page")} ${window.currentPage} ${t(
//     "total"
//   )} ${totalPages}`;

//   pagination.append(prev, info, next);
// }

// // ===== 勾選後同步其他模組 =====
// function syncUIBySelection(assessments) {
//   const selectedAssessments = assessments.filter((_, i) =>
//     window.selected.includes(i)
//   );

//   updateRiskButtonsCounts(selectedAssessments);
//   renderRisk(selectedAssessments);
//   updateDegenerateAndLevels(selectedAssessments);
//   updateLatestCountDate(selectedAssessments);
//   updateTotalCountAndStartDate(selectedAssessments);

//   const mergedV = mergeAllVIVIFRAIL(selectedAssessments);
//   renderCards(flattenData(mergedV));

//   if (selectedAssessments.length === 0) {
//     drawNoDataChart();
//   } else {
//     drawSitStandChartChartJS(selectedAssessments);
//     drawBalanceChartChartJS(selectedAssessments);
//     drawGaitChartChartJS(selectedAssessments);
//     drawRiskChartChartJS(selectedAssessments);
//     removeNoDataOverlay();
//   }
// }

// // ===== 全選 / 取消全選 =====
// function initCheckAllButtons() {
//   const checkAllBtn = document.getElementById("checkAllBtn");
//   const uncheckAllBtn = document.getElementById("uncheckAllBtn");

//   // 如果按鈕不存在，直接跳過
//   if (!checkAllBtn || !uncheckAllBtn) return;

//   checkAllBtn.addEventListener("click", () => {
//     const list = window.lastRenderedAssessments || [];
//     window.checkAllAcrossPages = true;
//     window.selected = list.map((_, i) => i);

//     renderAssessmentTable(list);
//   });

//   uncheckAllBtn.addEventListener("click", () => {
//     const list = window.lastRenderedAssessments || [];
//     window.checkAllAcrossPages = false;
//     window.selected = [];

//     renderAssessmentTable(list);
//   });
// }

// js/common/table.js

/// 初始化表格參數
function initTable(assessments) {
  window.currentPage = 1;
  window.pageSize = 9;

  // 確保 selected 是陣列
  if (!Array.isArray(window.selected)) window.selected = [];

  // 強制預設全選：只要有資料就填滿索引
  if (assessments && assessments.length > 0) {
    window.selected = assessments.map((_, i) => i);
    window.checkAllAcrossPages = true;
  }

  initCheckAllButtons();
}

// ===== 核心渲染函數 (卡片式) =====
function renderAssessmentTable(assessments) {
  window.lastRenderedAssessments = assessments;

  // 1. 強制初始化全選 (解決進入頁面未勾選問題)
  if (
    assessments &&
    assessments.length > 0 &&
    window.selected.length === 0 &&
    !window.hasInitSelected
  ) {
    window.selected = assessments.map((_, i) => i);
    window.checkAllAcrossPages = true;
    window.hasInitSelected = true;
  }

  const container = document.getElementById("assessmentCardsContainer");
  const pagination = document.getElementById("tablePaginationContainer");

  if (!container || !pagination) return;

  container.innerHTML = "";
  pagination.innerHTML = "";

  if (!assessments || assessments.length === 0) {
    container.innerHTML = `<div class="col-12 text-center py-5 text-muted">目前無檢測資料</div>`;
    return;
  }

  // 排序：新 → 舊
  const sorted = [...assessments].sort((a, b) => b.Date - a.Date);
  const totalPages = Math.ceil(sorted.length / window.pageSize);

  if (window.currentPage > totalPages) window.currentPage = totalPages;
  if (window.currentPage < 1) window.currentPage = 1;

  const start = (window.currentPage - 1) * window.pageSize;
  const pageData = sorted.slice(start, start + window.pageSize);

  pageData.forEach((item) => {
    const globalIndex = assessments.indexOf(item);
    const isSelected = window.selected.includes(globalIndex);

    const date = new Date(item.Date);
    const dateText = `${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;

    const cardCol = document.createElement("div");
    cardCol.className = "col-12 col-md-6 col-lg-4 mb-3";

    // 使用您的原始名稱與單位
    cardCol.innerHTML = `
      <div class="card h-100 selectable-card ${
        isSelected ? "border-primary shadow bg-light" : "border-light shadow-sm"
      }" 
           data-index="${globalIndex}" 
           style="cursor: pointer; border-width: 2px; transition: all 0.2s ease;">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="d-flex align-items-center">
              <div class="status-indicator me-2 ${
                isSelected ? "bg-primary" : "bg-secondary opacity-25"
              }" 
                   style="width: 12px; height: 12px; border-radius: 50%;"></div>
              <span class="fw-bold text-dark">${dateText}</span>
            </div>
            <span class="badge bg-white text-primary border border-primary-subtle">參與人數 ${
              item.Count
            } 人</span>
          </div>

          <div class="row g-2 text-center mb-3">
            <div class="col-4">
              <div class="p-2 rounded bg-white border">
                <small class="text-muted d-block small" style="font-size: 0.75rem;">平均坐站秒數</small>
                <span class="fw-bold text-dark">${item.ChairSecond.toFixed(
                  1
                )}秒</span>
              </div>
            </div>
            <div class="col-4">
              <div class="p-2 rounded bg-white border">
                <small class="text-muted d-block small" style="font-size: 0.75rem;">平均平衡得分</small>
                <span class="fw-bold text-dark">${item.BalanceScore.toFixed(
                  1
                )}分</span>
              </div>
            </div>
            <div class="col-4">
              <div class="p-2 rounded bg-white border">
                <small class="text-muted d-block small" style="font-size: 0.75rem;">平均步行速度</small>
                <span class="fw-bold text-dark text-nowrap">${item.GaitSpeed.toFixed(
                  0
                )} cm/s</span>
              </div>
            </div>
          </div>

          <div class="mt-2">
            <div class="d-flex justify-content-between mb-1 small">
              <span class="text-muted fw-bold">平均跌倒風險</span>
              <span class="fw-bold ${
                item.RiskRate > 20 ? "text-danger" : "text-success"
              }">${item.RiskRate.toFixed(1)}%</span>
            </div>
            <div class="progress" style="height: 8px; background-color: #e9ecef;">
              <div class="progress-bar ${
                item.RiskRate > 20 ? "bg-danger" : "bg-primary"
              }" 
                   style="width: ${item.RiskRate}%"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    cardCol
      .querySelector(".selectable-card")
      .addEventListener("click", () =>
        toggleSelection(globalIndex, assessments)
      );
    container.appendChild(cardCol);
  });

  renderPagination(totalPages, assessments);
  syncUIBySelection(assessments);
}

// ===== 處理選取切換 =====
function toggleSelection(idx, assessments) {
  if (window.selected.includes(idx)) {
    window.selected = window.selected.filter((i) => i !== idx);
  } else {
    window.selected.push(idx);
  }
  window.checkAllAcrossPages = window.selected.length === assessments.length;
  renderAssessmentTable(assessments);
}

// ===== 分頁 =====
function renderPagination(totalPages, assessments) {
  const pagination = document.getElementById("tablePaginationContainer");
  if (!pagination || totalPages <= 1) return;

  const prev = document.createElement("button");
  prev.className = "btn btn-sm btn-outline-primary px-3";
  prev.textContent = "上一頁";
  prev.disabled = window.currentPage === 1;
  prev.onclick = (e) => {
    e.stopPropagation();
    window.currentPage--;
    renderAssessmentTable(assessments);
  };

  const info = document.createElement("span");
  info.className = "small text-muted fw-bold";
  info.textContent = `第 ${window.currentPage} / ${totalPages} 頁`;

  const next = document.createElement("button");
  next.className = "btn btn-sm btn-outline-primary px-3";
  next.textContent = "下一頁";
  next.disabled = window.currentPage === totalPages;
  next.onclick = (e) => {
    e.stopPropagation();
    window.currentPage++;
    renderAssessmentTable(assessments);
  };

  pagination.append(prev, info, next);
}

// ===== 全選 / 取消全選按鈕 =====
function initCheckAllButtons() {
  const btnAll = document.getElementById("checkAllBtn");
  const btnNone = document.getElementById("uncheckAllBtn");
  if (btnAll)
    btnAll.onclick = () => {
      const list = window.lastRenderedAssessments || [];
      window.selected = list.map((_, i) => i);
      renderAssessmentTable(list);
    };
  if (btnNone)
    btnNone.onclick = () => {
      const list = window.lastRenderedAssessments || [];
      window.selected = [];
      window.hasInitSelected = true; // 防止自動全選機制再次觸發
      renderAssessmentTable(list);
    };
}

// ===== 同步圖表與數據 =====
function syncUIBySelection(assessments) {
  const selectedAssessments = assessments.filter((_, i) =>
    window.selected.includes(i)
  );

  // 執行其他模組更新
  if (typeof updateRiskButtonsCounts === "function")
    updateRiskButtonsCounts(selectedAssessments);
  if (typeof renderRisk === "function") renderRisk(selectedAssessments);
  if (typeof updateDegenerateAndLevels === "function")
    updateDegenerateAndLevels(selectedAssessments);
  if (typeof updateLatestCountDate === "function")
    updateLatestCountDate(selectedAssessments);
  if (typeof updateTotalCountAndStartDate === "function")
    updateTotalCountAndStartDate(selectedAssessments);

  if (
    typeof mergeAllVIVIFRAIL === "function" &&
    typeof renderCards === "function"
  ) {
    const mergedV = mergeAllVIVIFRAIL(selectedAssessments);
    renderCards(flattenData(mergedV));
  }

  if (selectedAssessments.length === 0) {
    if (typeof drawNoDataChart === "function") drawNoDataChart();
  } else {
    if (typeof drawSitStandChartChartJS === "function") {
      drawSitStandChartChartJS(selectedAssessments);
      drawBalanceChartChartJS(selectedAssessments);
      drawGaitChartChartJS(selectedAssessments);
      drawRiskChartChartJS(selectedAssessments);
      if (typeof removeNoDataOverlay === "function") removeNoDataOverlay();
    }
  }
}
