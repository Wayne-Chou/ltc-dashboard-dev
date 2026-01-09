// js/common/table.js

function initTable() {
  window.currentPage = 1;

  //  保險初始化
  if (!Array.isArray(window.selected)) window.selected = [];
  if (typeof window.checkAllAcrossPages !== "boolean")
    window.checkAllAcrossPages = false;
  if (!window.pageSize) window.pageSize = 10;

  //  關鍵：要綁全選/取消全選
  initCheckAllButtons();
}

// ===== 表格渲染 =====
function renderAssessmentTable(assessments) {
  window.lastRenderedAssessments = assessments;

  const tbody = document.getElementById("assessmentTableBody");
  const pagination = document.getElementById("tablePaginationContainer");

  if (!tbody || !pagination) return;

  tbody.innerHTML = "";
  pagination.innerHTML = "";

  if (!assessments || assessments.length === 0) return;

  // 日期排序（新 → 舊）
  const sorted = [...assessments].sort((a, b) => b.Date - a.Date);

  const totalPages = Math.ceil(sorted.length / window.pageSize);
  if (window.currentPage > totalPages) window.currentPage = totalPages;
  if (window.currentPage < 1) window.currentPage = 1;

  const start = (window.currentPage - 1) * window.pageSize;
  const pageData = sorted.slice(start, start + window.pageSize);

  // 初始全選（如果你想保留）
  if (window.checkAllAcrossPages && window.selected.length === 0) {
    window.selected = assessments.map((_, i) => i);
  }

  pageData.forEach((item) => {
    const tr = document.createElement("tr");

    const date = new Date(item.Date);
    const dateText = `${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;

    const globalIndex = assessments.indexOf(item);
    const checked = window.selected.includes(globalIndex);

    tr.innerHTML = `
      <td><input type="checkbox" class="row-check" data-index="${globalIndex}" ${
      checked ? "checked" : ""
    }></td>
      <td>${dateText}</td>
      <td>${item.Count}${t("people")}</td>
      <td>${item.ChairSecond.toFixed(1)}${t("seconds")}</td>
      <td>${item.BalanceScore.toFixed(1)}${t("points")}</td>
      <td>${item.GaitSpeed.toFixed(1)} cm/s</td>
      <td>${item.RiskRate.toFixed(1)}%</td>
    `;

    tbody.appendChild(tr);
  });

  bindRowCheckbox(assessments);
  renderPagination(totalPages, assessments);

  syncUIBySelection(assessments);
}

// ===== checkbox 綁定 =====
function bindRowCheckbox(assessments) {
  document.querySelectorAll(".row-check").forEach((cb) => {
    cb.addEventListener("change", () => {
      const idx = parseInt(cb.dataset.index, 10);

      if (cb.checked) {
        if (!window.selected.includes(idx)) window.selected.push(idx);
      } else {
        window.selected = window.selected.filter((i) => i !== idx);
      }

      window.checkAllAcrossPages =
        window.selected.length === assessments.length;

      syncUIBySelection(assessments);
    });
  });
}

// ===== 分頁 =====
function renderPagination(totalPages, assessments) {
  if (totalPages <= 1) return;

  const pagination = document.getElementById("tablePaginationContainer");
  if (!pagination) return;

  const prev = document.createElement("button");
  prev.className = "btn btn-sm btn-outline-primary";
  prev.textContent = t("prevPage");
  prev.disabled = window.currentPage === 1;
  prev.onclick = () => {
    window.currentPage--;
    renderAssessmentTable(assessments);
  };

  const next = document.createElement("button");
  next.className = "btn btn-sm btn-outline-primary";
  next.textContent = t("nextPage");
  next.disabled = window.currentPage === totalPages;
  next.onclick = () => {
    window.currentPage++;
    renderAssessmentTable(assessments);
  };

  const info = document.createElement("span");
  info.className = "small flex-grow-1 text-center";
  info.textContent = `${t("page")} ${window.currentPage} ${t(
    "total"
  )} ${totalPages}`;

  pagination.append(prev, info, next);
}

// ===== 勾選後同步其他模組 =====
function syncUIBySelection(assessments) {
  const selectedAssessments = assessments.filter((_, i) =>
    window.selected.includes(i)
  );

  updateRiskButtonsCounts(selectedAssessments);
  renderRisk(selectedAssessments);
  updateDegenerateAndLevels(selectedAssessments);
  updateLatestCountDate(selectedAssessments);
  updateTotalCountAndStartDate(selectedAssessments);

  const mergedV = mergeAllVIVIFRAIL(selectedAssessments);
  renderCards(flattenData(mergedV));

  if (selectedAssessments.length === 0) {
    drawNoDataChart();
  } else {
    drawSitStandChartChartJS(selectedAssessments);
    drawBalanceChartChartJS(selectedAssessments);
    drawGaitChartChartJS(selectedAssessments);
    drawRiskChartChartJS(selectedAssessments);
    removeNoDataOverlay();
  }
}

// ===== 全選 / 取消全選 =====
function initCheckAllButtons() {
  const checkAllBtn = document.getElementById("checkAllBtn");
  const uncheckAllBtn = document.getElementById("uncheckAllBtn");

  // 如果按鈕不存在，直接跳過
  if (!checkAllBtn || !uncheckAllBtn) return;

  checkAllBtn.addEventListener("click", () => {
    const list = window.lastRenderedAssessments || [];
    window.checkAllAcrossPages = true;
    window.selected = list.map((_, i) => i);

    renderAssessmentTable(list);
  });

  uncheckAllBtn.addEventListener("click", () => {
    const list = window.lastRenderedAssessments || [];
    window.checkAllAcrossPages = false;
    window.selected = [];

    renderAssessmentTable(list);
  });
}
