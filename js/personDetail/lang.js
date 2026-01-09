const ref = document.referrer;
if (ref.includes("index_en.html")) {
  window.currentLang = "en";
} else if (ref.includes("index_ja.html")) {
  window.currentLang = "ja";
} else if (ref.includes("index_ko.html")) {
  window.currentLang = "ko";
} else {
  window.currentLang = "zh";
}

const LANG = {
  zh: {
    alertNoData: "查無資料",
    Select: "選取",
    Date: "檢測日期",
    sitStand: "坐站秒數",
    balance: "平衡",
    balance1: "平衡得分-雙腳並排站立",
    balance2: "平衡得分-雙腳半並排站立",
    balance3: "平衡得分-雙腳直線站立",
    gaitSpeed: "步行速度",
    fallRisk: "跌倒風險",
    seconds: "秒",
    points: "分",
    sitStandTrend: "坐站秒數趨勢",
    balanceTrend: "平衡測驗得分",
    gaitTrend: "步行速度趨勢",
    aiFallRisk: "AI跌倒風險機率",
    suggestSit: "建議小於12秒",
    suggestBalance: "建議大於3.5分",
    suggestGait: "建議大於等於100cm/s",
    downloadImage: "下載圖檔",
    personalTrend: "個人變化趨勢",
    name: "姓名",
    gender: "性別",
    age: "年齡",
    selectAll: "全選",
    unselectAll: "取消全選",
    back: "← 返回上一頁",
    male: "男",
    female: "女",
    riskLabel: {
      high: "危險",
      slightlyHigh: "高",
      medium: "中",
      slightlyLow: "稍低",
      low: "低",
      unknown: "未知",
    },
    dates: "日期",
    trendSummary: {
      noData: "至少需要兩筆資料才能顯示指標變化",
      title: "指標變化趨勢",
      compareText: "與",
      compareSuffix: "的比較，顯示每項指標變化情況",
      items: {
        sitStand: "坐站秒數",
        balance: "平衡得分",
        gait: "步行速度",
        risk: "AI跌倒風險",
      },
    },
    dateRangePlaceholder: "請選擇日期範圍",
    clear: "清除",
  },
  en: {
    alertNoData: "No data",
    Select: "Select",
    Date: "Date",
    sitStand: "Sit-Stand (s)",
    balance: "balance",
    balance1: "Balance Score - Feet Together",
    balance2: "Balance Score - Semi-Tandem",
    balance3: "Balance Score - Tandem",
    gaitSpeed: "Gait Speed",
    fallRisk: "Fall Risk",
    seconds: "s",
    points: "pts",
    sitStandTrend: "Sit-Stand Trend",
    balanceTrend: "Balance Test Score",
    gaitTrend: "Gait Speed Trend",
    aiFallRisk: "AI Fall Risk Probability",
    suggestSit: "Recommended: < 12 seconds",
    suggestBalance: "Recommended: > 3.5 points",
    suggestGait: "Recommended: ≥ 100 cm/s",
    downloadImage: "Download Image",
    personalTrend: "Personal Progress Trend",
    name: "Name",
    gender: "Gender",
    age: "Age",
    selectAll: "Select All",
    unselectAll: "Unselect All",
    back: "← Back",
    male: "Male",
    female: "Female",
    riskLabel: {
      high: "Danger",
      slightlyHigh: "high",
      medium: "middle",
      slightlyLow: "Slightly lower",
      low: "Low",
      unknown: "Unknown",
      dates: "Date",
    },
    trendSummary: {
      noData: "At least two records are required to show trend changes.",
      title: "Trend Changes Summary",
      compareText: "compared with",
      compareSuffix: ", showing changes for each indicator.",
      items: {
        sitStand: "Sit-to-Stand Time",
        balance: "Balance Score",
        gait: "Gait Speed",
        risk: "AI Fall Risk",
      },
    },
    dateRangePlaceholder: "Select date range",
    clear: "Clear",
  },
  ja: {
    alertNoData: "データなし",
    Select: "選択",
    Date: "検査日",
    sitStand: "座立秒数",
    balance: "バランス",
    balance1: "バランススコア - 並立",
    balance2: "バランススコア - 半並立",
    balance3: "バランススコア - 直線立位",
    gaitSpeed: "歩行速度",
    fallRisk: "転倒リスク",
    seconds: "秒",
    points: "点",
    sitStandTrend: "座立秒数の推移",
    balanceTrend: "バランステスト得点",
    gaitTrend: "歩行速度の推移",
    aiFallRisk: "AI転倒リスク確率",
    suggestSit: "推奨：12秒未満",
    suggestBalance: "推奨：3.5点以上",
    suggestGait: "推奨：100cm/s 以上",
    downloadImage: "画像をダウンロード",
    personalTrend: "個人の変化傾向",
    name: "氏名",
    gender: "性別",
    age: "年齢",
    selectAll: "全選択",
    unselectAll: "全選択解除",
    back: "← 戻る",
    male: "男性",
    female: "女性",
    riskLabel: {
      high: "危険",
      slightlyHigh: "高い",
      medium: "真ん中",
      slightlyLow: "わずかに低い",
      low: "低い",
      unknown: "不明",
    },
    dates: "日付",
    trendSummary: {
      noData: "指標の変化を表示するには、少なくとも2件のデータが必要です。",
      title: "指標変化の推移",
      compareText: "と",
      compareSuffix: "を比較し、各指標の変化を表示します。",
      items: {
        sitStand: "座立秒数",
        balance: "バランス得点",
        gait: "歩行速度",
        risk: "AI転倒リスク",
      },
    },
    dateRangePlaceholder: "日付範囲を選択",
    clear: "クリア",
  },
  ko: {
    alertNoData: "데이터 없음",
    Select: "선택",
    Date: "검사 날짜",
    sitStand: "좌/서 시간",
    balance: "균형",
    balance1: "균형 점수 - 양발 나란히",
    balance2: "균형 점수 - 반 텐덤",
    balance3: "균형 점수 - 직선 스탠드",
    gaitSpeed: "보행 속도",
    fallRisk: "낙상 위험",
    seconds: "초",
    points: "점",
    sitStandTrend: "좌/서 시간 추세",
    balanceTrend: "균형 검사 점수",
    gaitTrend: "보행 속도 추세",
    aiFallRisk: "AI 낙상 위험 확률",
    suggestSit: "권장: 12초 미만",
    suggestBalance: "권장: 3.5점 이상",
    suggestGait: "권장: 100cm/s 이상",
    downloadImage: "이미지 다운로드",
    personalTrend: "개인 변화 추세",
    name: "이름",
    gender: "성별",
    age: "나이",
    selectAll: "전체 선택",
    unselectAll: "전체 선택 해제",
    back: "← 뒤로가기",
    male: "남성",
    female: "여성",
    riskLabel: {
      high: "위험",
      slightlyHigh: "높은",
      medium: "가운데",
      slightlyLow: "약간 낮음",
      low: "낮은",
      unknown: "알 수 없음",
    },
    dates: "날짜",
    trendSummary: {
      noData: "지표 변화를 표시하려면 최소 두 개의 데이터가 필요합니다.",
      title: "지표 변화 추세",
      compareText: "와",
      compareSuffix: "의 비교를 통해 각 지표의 변화를 보여줍니다.",
      items: {
        sitStand: "좌/서 시간",
        balance: "균형 점수",
        gait: "보행 속도",
        risk: "AI 낙상 위험",
      },
    },
    dateRangePlaceholder: "날짜 범위를 선택하세요",
    clear: "초기화",
  },
};
function t(key) {
  return LANG[window.currentLang][key] || key;
}

window.applyLanguage = function () {
  document.querySelectorAll("[data-lang]").forEach((el) => {
    const key = el.getAttribute("data-lang");

    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      el.placeholder = t(key);
    } else {
      el.textContent = t(key);
    }
  });
};

// 性別文字對應
window.genderText = function (g) {
  if (g === 0) return t("female");
  if (g === 1) return t("male");
  return "Unknown";
};

// 風險中文對應
window.getRiskLabel = function (risk) {
  const label = t("riskLabel");
  if (risk > 50) return label.high;
  if (risk > 30) return label.slightlyHigh;
  if (risk > 17.5) return label.medium;
  if (risk > 5) return label.slightlyLow;
  return label.low;
};
