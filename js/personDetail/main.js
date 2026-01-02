const { id, region, jsonFileName } = window.getPersonParams();
document.getElementById("personName").textContent = "載入中...";

// 讀 JSON
fetch(jsonFileName)
  .then((res) => res.json())
  .then((all) => {
    const person = all.find((p) => String(p.Profile.Number) === String(id));
    if (!person) {
      document.body.innerHTML = `
      <div class="text-center mt-5">
        <p class="text-danger fs-5">找不到編號 ${id} 的資料</p>
        <button class="btn btn-secondary" onclick="history.back()">返回</button>
      </div>`;
      return;
    }

    const profile = person.Profile;
    const datas = person.Datas;

    // 顯示姓名與基本資料
    document.getElementById("personName").textContent = profile.Name;
    document.getElementById("personInfo").innerHTML = `
      <div class="row gx-0 border">
        <div class="col-4 border-end p-2">
          <strong data-lang="name"></strong>：${profile.Name}
        </div>
        <div class="col-4 border-end p-2">
          <strong data-lang="gender"></strong>：${genderText(profile.Gender)}
        </div>
        <div class="col-4 p-2">
          <strong data-lang="age"></strong>：${profile.Age}
        </div>
      </div>`;
    applyLanguage();

    // 表格與勾選事件
    renderTable(datas);
    setupCheckboxes(datas);

    //  準備資料給曲線圖
    const assessments = datas.map((d) => ({
      Date: d.Date,
      ChairSecond: d.SPPB?.Chairtest?.Second ?? null,
      BalanceScore:
        (d.SPPB?.Balancetest?.balance1?.Score ?? 0) +
        (d.SPPB?.Balancetest?.balance2?.Score ?? 0) +
        (d.SPPB?.Balancetest?.balance3?.Score ?? 0),
      GaitSpeed: d.SPPB?.Gaitspeed?.Speed ?? null,
      RiskRate: d.Risk ?? null,
    }));

    // 存全域，charts.js 也可用
    window.filteredAssessments = assessments;

    // 呼叫 charts.js 畫圖
    if (window.drawAllCharts) {
      window.drawAllCharts(assessments);
    }
  })
  .catch((err) => {
    console.error(err);
    document.body.innerHTML = `
    <div class="text-center mt-5">
      <p class="text-danger fs-5">資料讀取失敗，請稍後再試</p>
    </div>`;
  });

// 返回按鈕
document
  .getElementById("backBtn")
  .addEventListener("click", () => history.back());
