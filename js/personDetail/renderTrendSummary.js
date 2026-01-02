// 將趨勢百分比渲染到 #trendSummary
function renderTrendSummary(trend, selectedDates = null) {
  const container = document.getElementById("trendSummary");
  if (!trend) {
    container.innerHTML = `<div class="text-muted small text-center">至少需要兩筆資料才能顯示指標變化</div>`;
    return;
  }

  const renderArrow = (val, isRisk = false) => {
    if (val == null) return { text: "-", color: "secondary" };
    if (isRisk) {
      if (val > 0) return { text: `↑ ${val.toFixed(1)}%`, color: "danger" };
      if (val < 0)
        return { text: `↓ ${Math.abs(val).toFixed(1)}%`, color: "success" };
      return { text: "→ 0%", color: "warning" };
    }
    if (val > 0) return { text: `↑ ${val.toFixed(1)}%`, color: "success" };
    if (val < 0)
      return { text: `↓ ${Math.abs(val).toFixed(1)}%`, color: "danger" };
    return { text: "→ 0%", color: "warning" };
  };

  const items = [
    { name: "坐站秒數", value: trend.sitStand },
    { name: "平衡得分", value: trend.balance },
    { name: "步行速度", value: trend.gait },
    { name: "AI跌倒風險", value: trend.risk, isRisk: true },
  ];

  // 選擇的日期
  let firstDateStr, secondDateStr;
  if (selectedDates && selectedDates.length === 2) {
    firstDateStr = new Date(selectedDates[0]).toLocaleDateString("zh-TW");
    secondDateStr = new Date(selectedDates[1]).toLocaleDateString("zh-TW");
  } else {
    firstDateStr = new Date(trend.prevDate).toLocaleDateString("zh-TW");
    secondDateStr = new Date(trend.lastDate).toLocaleDateString("zh-TW");
  }

  container.innerHTML = `
    <!-- 區塊標題 -->
    <div class="mb-3 text-center">
      <h4 class="fw-bold mb-1" style="color: #3b82f6; letter-spacing: 0.5px;">指標變化趨勢</h4>
      <div style="width:60px; height:4px; background:#3b82f6; margin:0 auto; border-radius:2px;"></div>
      <p class="text-muted small mt-1">
        <span style="font-weight:700; color:#ff5722;">${firstDateStr}</span> 與 <span style="font-weight:700; color:#ff5722;">${secondDateStr}</span>的比較，顯示每項指標變化情況
      </p>
    </div>

    <!-- 指標卡片 -->
    <div class="row g-3">
      ${items
        .map((item) => {
          const arrow = renderArrow(item.value, item.isRisk);
          return `
            <div class="col-12 col-md-3">
              <div class="card h-100 border-0" 
                   style="
                     border-radius: 0.25rem; 
                     background-color: #f0f4f8; 
                     box-shadow: 0 2px 6px rgba(0,0,0,0.05);
                   ">
                
                <!-- 指標名稱 -->
                <div class="card-body d-flex flex-column justify-content-center align-items-center py-4">
                  <h6 class="text-gray-600 fw-bold mb-2" style="letter-spacing:0.5px; font-size:0.85rem;">
                    ${item.name}
                  </h6>
                  <span class="fw-bold fs-5 text-${arrow.color}">${arrow.text}</span>
                </div>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}
