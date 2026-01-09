// 將趨勢百分比渲染到 #trendSummary
function renderTrendSummary(trend, selectedDates = null) {
  const container = document.getElementById("trendSummary");
  const langPack = LANG[currentLang]?.trendSummary;

  if (!trend) {
    container.innerHTML = `
      <div class="text-muted small text-center">
        ${langPack.noData}
      </div>`;
    return;
  }

  const renderArrow = (val, isRisk = false) => {
    if (val == null) return { text: "-", tone: "neutral" };

    if (isRisk) {
      if (val > 0) return { text: `↑ ${val.toFixed(1)}%`, tone: "critical" };
      if (val < 0)
        return { text: `↓ ${Math.abs(val).toFixed(1)}%`, tone: "good" };
      return { text: "→ 0%", tone: "watch" };
    }

    if (val > 0) return { text: `↑ ${val.toFixed(1)}%`, tone: "good" };
    if (val < 0)
      return { text: `↓ ${Math.abs(val).toFixed(1)}%`, tone: "critical" };
    return { text: "→ 0%", tone: "watch" };
  };

  const items = [
    { key: "sitStand", value: trend.sitStand },
    { key: "balance", value: trend.balance },
    { key: "gait", value: trend.gait },
    { key: "risk", value: trend.risk, isRisk: true },
  ];

  let firstDateStr, secondDateStr;
  if (selectedDates && selectedDates.length === 2) {
    firstDateStr = new Date(selectedDates[0]).toLocaleDateString();
    secondDateStr = new Date(selectedDates[1]).toLocaleDateString();
  } else {
    firstDateStr = new Date(trend.prevDate).toLocaleDateString();
    secondDateStr = new Date(trend.lastDate).toLocaleDateString();
  }

  container.innerHTML = `
    <div class="trend-header text-center mb-3">
      <h4 class="trend-header-title">${langPack.title}</h4>
      <div class="trend-header-bar"></div>
      <p class="trend-header-desc">
        <span class="date">${firstDateStr}</span>
        ${langPack.compareText}
        <span class="date">${secondDateStr}</span>
        ${langPack.compareSuffix}
      </p>
    </div>

    <div class="row g-3">
      ${items
        .map((item) => {
          const arrow = renderArrow(item.value, item.isRisk);
          return `
          <div class="col-12 col-md-3">
            <div class="trend-card tone-${arrow.tone}">
              <div class="trend-card-title">${langPack.items[item.key]}</div>
              <div class="trend-card-value">${arrow.text}</div>
            </div>
          </div>
        `;
        })
        .join("")}
    </div>
  `;
}
