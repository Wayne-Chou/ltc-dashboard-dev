window.getPersonParams = function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const region = params.get("region");

  if (!id) {
    document.body.innerHTML = `
    <div class="text-center mt-5">
      <p class="text-danger fs-5">未提供人員編號</p>
      <button class="btn btn-secondary" onclick="history.back()">返回</button>
    </div>`;
    throw new Error("No ID in URL");
  }

  if (!region) {
    document.body.innerHTML = `
    <div class="text-center mt-5">
      <p class="text-danger fs-5">未提供區域參數</p>
      <button class="btn btn-secondary" onclick="history.back()">返回</button>
    </div>`;
    throw new Error("No region in URL");
  }

  const regionMap = {
    香柏樹台大: "PageAPI_PersonalData-香柏樹台大.json",
    香柏樹台電: "PageAPI_PersonalData-香柏樹台電.json",
    香柏樹大坪林: "PageAPI_PersonalData-香柏樹大坪林.json",
    香柏樹樟新: "PageAPI_PersonalData-香柏樹樟新.json",
  };

  if (!regionMap[region]) {
    document.body.innerHTML = `
    <div class="text-center mt-5">
      <p class="text-danger fs-5">區域 ${region} 沒有對應資料</p>
      <button class="btn btn-secondary" onclick="history.back()">返回</button>
    </div>`;
    throw new Error("Invalid region");
  }

  return { id, region, jsonFileName: regionMap[region] };
};
