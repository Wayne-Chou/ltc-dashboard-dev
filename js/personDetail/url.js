window.getPersonParams = function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const regionId = Number(params.get("region"));

  if (!id) {
    document.body.innerHTML = `
      <div class="text-center mt-5">
        <p class="text-danger fs-5">未提供人員編號</p>
        <button class="btn btn-secondary" onclick="history.back()">返回</button>
      </div>`;
    throw new Error("No ID in URL");
  }

  if (!Number.isInteger(regionId)) {
    document.body.innerHTML = `
      <div class="text-center mt-5">
        <p class="text-danger fs-5">未提供區域參數</p>
        <button class="btn btn-secondary" onclick="history.back()">返回</button>
      </div>`;
    throw new Error("No region in URL");
  }

  const regionMap = {
    1: {
      name: "香柏樹台大",
      file: "PageAPI_PersonalData-香柏樹台大.json",
    },
    2: {
      name: "香柏樹台電",
      file: "PageAPI_PersonalData-香柏樹台電.json",
    },
    3: {
      name: "香柏樹大坪林",
      file: "PageAPI_PersonalData-香柏樹大坪林.json",
    },
    4: {
      name: "香柏樹樟新",
      file: "PageAPI_PersonalData-香柏樹樟新.json",
    },
  };

  const regionConfig = regionMap[regionId];

  if (!regionConfig) {
    document.body.innerHTML = `
      <div class="text-center mt-5">
        <p class="text-danger fs-5">區域代碼 ${regionId} 無效</p>
        <button class="btn btn-secondary" onclick="history.back()">返回</button>
      </div>`;
    throw new Error("Invalid regionId");
  }

  return {
    id,
    regionId,
    regionName: regionConfig.name,
    file: regionConfig.file,
  };
};
