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

// 渲染表格
window.renderTable = function (datas) {
  if (!datas || datas.length === 0) {
    document.getElementById("personTable").innerHTML =
      '<div class="text-muted py-2">查無資料</div>';
    return;
  }

  let html = `
  <div style="max-height: 400px; overflow-y: auto;">
    <table class="table table-bordered align-middle mt-2">
      <thead class="bg-light">
        <tr>
          <th>${t("Select")}</th>
          <th>${t("Date")}</th>
          <th>${t("sitStand")}</th>
          <th>${t("balance1")}</th>
          <th>${t("balance2")}</th>
          <th>${t("balance3")}</th>
          <th>${t("gaitSpeed")}</th>
          <th>${t("fallRisk")}</th>
        </tr>
      </thead>
      <tbody>
  `;

  datas.forEach((d, index) => {
    const dateText = d.Date ? new Date(d.Date).toLocaleDateString() : "未知";
    const sitStand =
      d.SPPB?.Chairtest?.Second != null
        ? d.SPPB.Chairtest.Second === 0
          ? "0"
          : d.SPPB.Chairtest.Second.toFixed(2)
        : "-";
    const walkSpeed =
      d.SPPB?.Gaitspeed?.Speed != null
        ? d.SPPB.Gaitspeed.Speed === 0
          ? "0"
          : d.SPPB.Gaitspeed.Speed.toFixed(2)
        : "-";
    const b1 = d.SPPB?.Balancetest?.balance1?.Score ?? "-";
    const b2 = d.SPPB?.Balancetest?.balance2?.Score ?? "-";
    const b3 = d.SPPB?.Balancetest?.balance3?.Score ?? "-";
    const fallRisk = d.Risk != null ? getRiskLabel(d.Risk) : "-";

    html += `
      <tr>
        <td><input type="checkbox" class="row-check" data-index="${index}" checked></td>
        <td>${dateText}</td>
        <td>${sitStand}${t("seconds")}</td>
        <td>${b1}${t("points")}</td>
        <td>${b2}${t("points")}</td>
        <td>${b3}${t("points")}</td>
        <td>${walkSpeed}cm/s</td>
        <td>${fallRisk}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  </div>`;

  document.getElementById("personTable").innerHTML = html;
};

// 勾選 checkbox 事件、全選/取消全選
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

  // 初始繪製
  updateCharts();
};
