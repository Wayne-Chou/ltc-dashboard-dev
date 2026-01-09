function convertToAssessments(datas) {
  return datas.map((d) => ({
    Date: d.Date,
    ChairSecond: d.SPPB?.Chairtest?.Second ?? null,
    BalanceScore:
      (d.SPPB?.Balancetest?.balance1?.Score ?? 0) +
      (d.SPPB?.Balancetest?.balance2?.Score ?? 0) +
      (d.SPPB?.Balancetest?.balance3?.Score ?? 0),
    GaitSpeed: d.SPPB?.Gaitspeed?.Speed ?? null,
    RiskRate: d.Risk ?? null,
  }));
}

// ===== 渲染表格 =====
window.renderTable = function (datas) {
  const container = document.getElementById("personTable");

  if (!datas || datas.length === 0) {
    container.innerHTML =
      '<div class="text-muted py-3 text-center">查無資料</div>';
    return;
  }

  let html = `<div class="record-list">`;

  datas.forEach((d, index) => {
    const dateText = d.Date
      ? new Date(d.Date).toLocaleDateString()
      : t("unknown");

    const sitStand =
      d.SPPB?.Chairtest?.Second != null
        ? d.SPPB.Chairtest.Second.toFixed(2) + " " + t("seconds")
        : "-";

    const gait =
      d.SPPB?.Gaitspeed?.Speed != null
        ? d.SPPB.Gaitspeed.Speed.toFixed(2) + " cm/s"
        : "-";

    const b1 = d.SPPB?.Balancetest?.balance1?.Score ?? "-";
    const b2 = d.SPPB?.Balancetest?.balance2?.Score ?? "-";
    const b3 = d.SPPB?.Balancetest?.balance3?.Score ?? "-";

    const risk = d.Risk != null ? getRiskLabel(d.Risk) : "-";

    html += `
      <label class="record-item">
        <input
          type="checkbox"
          class="row-check"
          data-index="${index}"
          checked
        />
        <div class="record-content">
          <div class="record-date">${dateText}</div>

          <div class="record-metrics">
            <span>${t("sitStand")} <b>${sitStand}</b></span>
            <span>${t("gaitSpeed")} <b>${gait}</b></span>
            <span class="risk">${t("fallRisk")} <b>${risk}</b></span>
          </div>

          <div class="record-balance">
            <div class="balance-title">${t("balance")}</div>
            <ul class="balance-list">
              <li>${t("balance1")}：<b>${b1}</b></li>
              <li>${t("balance2")}：<b>${b2}</b></li>
              <li>${t("balance3")}：<b>${b3}</b></li>
            </ul>
          </div>
        </div>
      </label>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
};

// ===== checkbox / 全選 / 取消全選（原樣）=====
window.setupCheckboxes = function (datas) {
  const rowChecks = document.querySelectorAll(".row-check");
  const checkAllBtn = document.getElementById("checkAllBtn");
  const uncheckAllBtn = document.getElementById("uncheckAllBtn");

  function updateCharts() {
    const selectedIndexes = Array.from(rowChecks)
      .filter((c) => c.checked)
      .map((c) => parseInt(c.dataset.index));

    const filteredDatas = selectedIndexes.map((i) => datas[i]);
    const assessments = convertToAssessments(filteredDatas);

    if (assessments.length < 2) {
      renderTrendSummary(null);
    } else {
      renderTrendSummary(calculateTrend(assessments));
    }

    window.drawAllCharts(assessments);
  }

  rowChecks.forEach((c) => c.addEventListener("change", updateCharts));

  checkAllBtn.addEventListener("click", () => {
    rowChecks.forEach((c) => (c.checked = true));
    updateCharts();
  });

  uncheckAllBtn.addEventListener("click", () => {
    rowChecks.forEach((c) => (c.checked = false));
    updateCharts();
  });

  // 初始
  updateCharts();
};
