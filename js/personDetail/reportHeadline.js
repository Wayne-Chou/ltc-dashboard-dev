// js/personDetail/reportHeadline.js
(function () {
  const $ = (id) => document.getElementById(id);

  function fmtDate(ts) {
    try {
      return new Date(ts).toLocaleDateString();
    } catch {
      return "--";
    }
  }

  function pctChange(prev, curr, higherIsBetter) {
    if (prev == null || curr == null) return null;
    if (prev === 0) return null;
    const delta = ((curr - prev) / Math.abs(prev)) * 100;
    // 若 higherIsBetter=false，代表越小越好（例如坐站秒數）
    // 退化與改善的語意在 render 部分處理
    return delta;
  }

  function pickLatestTwo(arr) {
    const valid = (arr || []).filter((x) => x && x.Date != null);
    valid.sort((a, b) => Number(a.Date) - Number(b.Date));
    if (valid.length < 2) return null;
    return [valid[valid.length - 2], valid[valid.length - 1]];
  }

  function renderHeadline({ tone, statusText, rangeText, title, desc }) {
    const root = $("reportHeadline");
    if (!root) return;

    const badge = root.querySelector(".headline-badge");
    const t = root.querySelector(".headline-title");
    const d = root.querySelector(".headline-desc");

    if (badge) {
      badge.setAttribute("data-tone", tone);
      badge.innerHTML = `
        <i class="fa-solid ${
          tone === "ok"
            ? "fa-circle-check"
            : tone === "warn"
            ? "fa-triangle-exclamation"
            : tone === "bad"
            ? "fa-circle-xmark"
            : "fa-circle-info"
        }"></i>
        <span>${statusText}</span>
      `;
    }

    if (t) t.textContent = title;
    if (d) d.textContent = desc;

    const range = $("reportRange");
    const status = $("reportStatus");
    if (range) range.textContent = rangeText;
    if (status) status.textContent = statusText;
  }

  function buildFromTwo(prev, curr) {
    // 指標：坐站（越低越好）、平衡（越高越好）、步速（越高越好）、風險（越低越好）
    const sit = pctChange(prev.ChairSecond, curr.ChairSecond, false);
    const bal = pctChange(prev.BalanceScore, curr.BalanceScore, true);
    const gait = pctChange(prev.GaitSpeed, curr.GaitSpeed, true);
    const risk = pctChange(prev.RiskRate, curr.RiskRate, false);

    const issues = [];

    // 坐站：上升 = 退化
    if (sit != null)
      issues.push({
        k: "坐站秒數",
        bad: sit > 8,
        sev: Math.abs(sit),
        msg: sit > 0 ? "變慢" : "變快",
      });

    // 平衡：下降 = 退化
    if (bal != null)
      issues.push({
        k: "平衡能力",
        bad: bal < -8,
        sev: Math.abs(bal),
        msg: bal < 0 ? "下降" : "上升",
      });

    // 步速：下降 = 退化
    if (gait != null)
      issues.push({
        k: "步行速度",
        bad: gait < -8,
        sev: Math.abs(gait),
        msg: gait < 0 ? "下降" : "上升",
      });

    // 風險：上升 = 退化（更危險）
    if (risk != null)
      issues.push({
        k: "跌倒風險",
        bad: risk > 15,
        sev: Math.abs(risk),
        msg: risk > 0 ? "上升" : "下降",
      });

    // 找出最需要注意的項目（以「bad=true」優先，再看幅度）
    issues.sort((a, b) => {
      if (a.bad !== b.bad) return a.bad ? -1 : 1;
      return b.sev - a.sev;
    });

    const top = issues[0];
    const rangeText = `${fmtDate(prev.Date)} → ${fmtDate(curr.Date)}`;

    // 如果資料不足
    if (!top) {
      return {
        tone: "neutral",
        statusText: "資料不足",
        rangeText,
        title: "需要至少兩筆評估資料",
        desc: "請先在表格勾選或確認資料是否完整。",
      };
    }

    // 判讀規則（可再調）
    const hasBad = issues.some((x) => x.bad);
    const riskUp = risk != null && risk > 15;

    let tone = "ok";
    let statusText = "整體穩定";
    if (hasBad) {
      tone = riskUp ? "bad" : "warn";
      statusText = riskUp ? "需優先關注" : "建議追蹤";
    }

    const title = `${top.k}${top.msg}（變化約 ${top.sev.toFixed(1)}%）`;
    const desc =
      tone === "bad"
        ? "整體呈現退化趨勢，尤其風險變化較大。建議優先檢視最近一次評估與介入方案。"
        : tone === "warn"
        ? "部分指標出現明顯變化，建議持續追蹤並確認是否需要調整訓練/照護計畫。"
        : "多數指標變化不大，建議維持現行訓練並定期複測。";

    return { tone, statusText, rangeText, title, desc };
  }

  function tryRender() {
    const data = window.filteredAssessments;
    const pair = pickLatestTwo(data);

    if (!pair) return false;
    const [prev, curr] = pair;

    const result = buildFromTwo(prev, curr);
    renderHeadline(result);
    return true;
  }

  // 等待 main.js fetch 完畢後才會有 window.filteredAssessments
  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    if (tryRender() || tries > 40) clearInterval(timer);
  }, 150);

  // 如果你之後有「勾選兩筆資料」更新摘要，也可以在你現有邏輯裡 dispatch 一個事件：
  // window.dispatchEvent(new Event("trend:updated"));
  window.addEventListener("trend:updated", () => {
    tryRender();
  });
})();
