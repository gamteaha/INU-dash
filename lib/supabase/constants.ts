export interface CollegeHierarchy {
  college: string
  dbColleges: string[]
  departments: string[]
}

// ── 사이드바 고정 표시 순서 ─────────────────────────────────────
export const COLLEGE_ORDER = [
  "기초교육원",
  "인문대학",
  "자연과학대학",
  "사회과학대학",
  "글로벌정경대학",
  "공과대학",
  "정보기술대학",
  "경영대학",
  "예술체육대학",
  "사범대학",
  "도시과학대학",
  "생명과학기술대학",
  "융합자유전공대학",
  "동북아국제통상물류학부",
  "법학부",
  "기타",
] as const

// ── DB 원시값 → 표시명 매핑 ────────────────────────────────────
// 아래에 없는 값은 그대로 사용
export const COLLEGE_DB_MAP: Record<string, string> = {
  "교양":            "기초교육원",
  "단과대구분없음":   "동북아국제통상물류학부",
  "단과대구분없음(법학)": "법학부",
  "교직":            "기타",
  "일선":            "기타",
  "군사학":          "기타",
  "기타":            "기타",
}

// mapCollege 헬퍼: DB 원시값 → 표시명
export function mapCollegeName(raw: string): string {
  return COLLEGE_DB_MAP[raw] ?? raw
}

export const COLLEGE_HIERARCHY: CollegeHierarchy[] = [
  {
    college: "기초교육원",
    dbColleges: ["교양"],
    departments: ["교양"]
  },
  {
    college: "인문대학",
    dbColleges: ["인문대학"],
    departments: [
      "국어국문학과",
      "독어독문학과",
      "불어불문학과",
      "영어영문학과",
      "일본지역문화학과",
      "중어중국학과"
    ]
  },
  {
    college: "자연과학대학",
    dbColleges: ["자연과학대학"],
    departments: [
      "물리학과",
      "수학과",
      "패션산업학과",
      "해양학과",
      "화학과"
    ]
  },
  {
    college: "사회과학대학",
    dbColleges: ["사회과학대학"],
    departments: [
      "문헌정보학과",
      "미디어커뮤니케이션학과",
      "사회복지학과",
      "창의인재개발학과"
    ]
  },
  {
    college: "글로벌정경대학",
    dbColleges: ["글로벌정경대학"],
    departments: [
      "Global Trade & Service학부",
      "경제학과",
      "경제학과(야)",
      "무역학부(야)",
      "소비자학과",
      "정치외교학과",
      "행정학과"
    ]
  },
  {
    college: "공과대학",
    dbColleges: ["공과대학"],
    departments: [
      "기계공학과",
      "바이오-로봇시스템공학과",
      "반도체융합전공",
      "산업경영공학과",
      "신소재공학과",
      "안전공학과",
      "에너지화학공학과",
      "전기공학과",
      "전자공학과",
      "전자공학부",
      "전자공학전공"
    ]
  },
  {
    college: "정보기술대학",
    dbColleges: ["정보기술대학"],
    departments: [
      "임베디드시스템공학과",
      "정보통신공학과",
      "컴퓨터공학부"
    ]
  },
  {
    college: "경영대학",
    dbColleges: ["경영대학"],
    departments: [
      "경영학부",
      "데이터과학과",
      "세무회계학과"
    ]
  },
  {
    college: "예술체육대학",
    dbColleges: ["예술체육대학"],
    departments: [
      "공연예술학과",
      "디자인학부",
      "서양화전공",
      "스포츠과학부",
      "운동건강학부",
      "조형예술학부",
      "한국화전공"
    ]
  },
  {
    college: "사범대학",
    dbColleges: ["사범대학"],
    departments: [
      "국어교육과",
      "수학교육과",
      "역사교육과",
      "영어교육과",
      "유아교육과",
      "윤리교육과",
      "일어교육과",
      "체육교육과"
    ]
  },
  {
    college: "도시과학대학",
    dbColleges: ["도시과학대학"],
    departments: [
      "건설환경공학전공",
      "건축공학전공",
      "도시건축학부",
      "도시건축학전공",
      "도시공학과",
      "도시행정학과",
      "도시환경공학부",
      "환경공학전공"
    ]
  },
  {
    college: "생명과학기술대학",
    dbColleges: ["생명과학기술대학"],
    departments: [
      "나노바이오공학전공",
      "분자의생명전공",
      "생명공학부",
      "생명공학전공",
      "생명과학부",
      "생명과학전공"
    ]
  },
  {
    college: "융합자유전공대학",
    dbColleges: ["융합자유전공대학"],
    departments: [
      "자유전공학부"
    ]
  },
  {
    college: "동북아국제통상물류학부",
    dbColleges: ["단과대구분없음"],
    departments: [
      "IBE전공",
      "동북아국제통상전공",
      "스마트물류공학전공"
    ]
  },
  {
    college: "법학부",
    dbColleges: ["단과대구분없음(법학)"],
    departments: [
      "법학부"
    ]
  }
]

// ── 학과별 공식 웹사이트 URL ────────────────────────────────────
export const DEPARTMENT_LINKS: Record<string, string> = {
  // 인문대학
  "국어국문학과": "https://korean.inu.ac.kr/",
  "영어영문학과": "https://english.inu.ac.kr/",
  "독어독문학과": "https://german.inu.ac.kr/",
  "불어불문학과": "https://inufrance.inu.ac.kr/",
  "일본지역문화학과": "https://unjapan.inu.ac.kr/",
  "중어중국학과": "https://inuchina.inu.ac.kr/",

  // 자연과학대학
  "수학과": "https://math.inu.ac.kr/",
  "물리학과": "https://physics.inu.ac.kr/",
  "화학과": "https://chem.inu.ac.kr/",
  "패션산업학과": "https://uifashion.inu.ac.kr/",
  "해양학과": "https://marine.inu.ac.kr/",

  // 사회과학대학
  "사회복지학과": "https://uipa.inu.ac.kr/",
  "미디어커뮤니케이션학과": "https://newdays.inu.ac.kr/",
  "문헌정보학과": "https://lis.inu.ac.kr/",
  "창의인재개발학과": "https://hrd.inu.ac.kr/",

  // 글로벌정경대학
  "행정학과": "https://uipa.inu.ac.kr/",
  "정치외교학과": "https://politics.inu.ac.kr/",
  "경제학과": "https://econ.inu.ac.kr/",
  "경제학과(야)": "https://econ.inu.ac.kr/",
  "무역학부": "https://trade.inu.ac.kr/",
  "무역학부(야)": "https://trade.inu.ac.kr/",
  "소비자학과": "https://ccs.inu.ac.kr/",
  "Global Trade & Service학부": "https://trade.inu.ac.kr/",

  // 공과대학
  "기계공학과": "https://me.inu.ac.kr/",
  "전기공학과": "https://elec.inu.ac.kr/",
  "전자공학부": "https://ee.inu.ac.kr/",
  "전자공학과": "https://ee.inu.ac.kr/",
  "전자공학전공": "https://ee.inu.ac.kr/",
  "산업경영공학과": "https://safety.inu.ac.kr/",
  "신소재공학과": "https://mse.inu.ac.kr/",
  "안전공학과": "https://safety.inu.ac.kr/",
  "에너지화학공학과": "https://energy.inu.ac.kr/",
  "바이오-로봇시스템공학과": "http://bio-robot.inu.ac.kr/",
  "반도체융합전공": "https://ee.inu.ac.kr/",

  // 정보기술대학
  "컴퓨터공학부": "https://cse.inu.ac.kr/",
  "정보통신공학과": "https://ite.inu.ac.kr/",
  "임베디드시스템공학과": "https://ese.inu.ac.kr/",

  // 경영대학
  "경영학부": "https://www.inu.ac.kr/sites/biz/index.do",
  "데이터과학과": "https://datascience.inu.ac.kr/",
  "세무회계학과": "https://tax.inu.ac.kr/",

  // 예술체육대학
  "한국화전공": "https://finearts.inu.ac.kr/",
  "서양화전공": "https://finearts.inu.ac.kr/",
  "조형예술학부": "https://finearts.inu.ac.kr/",
  "디자인학부": "https://design.inu.ac.kr/",
  "공연예술학과": "https://uipa10.inu.ac.kr/",
  "스포츠과학부": "https://sports.inu.ac.kr/",
  "운동건강학부": "https://uiex.inu.ac.kr/",

  // 사범대학
  "국어교육과": "https://edukorean.inu.ac.kr/",
  "영어교육과": "https://eduenglish.inu.ac.kr/",
  "일어교육과": "https://edujapanese.inu.ac.kr/",
  "수학교육과": "https://ece.inu.ac.kr/",
  "체육교육과": "https://eduphysical.inu.ac.kr/",
  "유아교육과": "https://eduethics.inu.ac.kr/",
  "역사교육과": "https://eduhistory.inu.ac.kr/",
  "윤리교육과": "https://eduethics.inu.ac.kr/",

  // 도시과학대학
  "도시행정학과": "https://urban.inu.ac.kr/",
  "건설환경공학전공": "https://civil.inu.ac.kr/",
  "도시환경공학부": "https://civil.inu.ac.kr/",
  "환경공학전공": "https://et.inu.ac.kr/",
  "도시공학과": "https://scity.inu.ac.kr/",
  "도시건축학부": "https://archi.inu.ac.kr/",
  "도시건축학전공": "https://archi.inu.ac.kr/",
  "건축공학전공": "https://archi.inu.ac.kr/",

  // 생명과학기술대학
  "생명과학전공": "https://life.inu.ac.kr/",
  "생명과학부": "https://life.inu.ac.kr/",
  "분자의생명전공": "https://molbio.inu.ac.kr/",
  "생명공학전공": "https://bioeng.inu.ac.kr/",
  "생명공학부": "https://bioeng.inu.ac.kr/",
  "나노바이오공학전공": "https://nanobio.inu.ac.kr/",

  // 동북아국제통상물류학부
  "동북아국제통상전공": "https://sonas.inu.ac.kr/",
  "IBE전공": "https://sonas.inu.ac.kr/",
  "스마트물류공학전공": "https://www.inu.ac.kr/slog/index.do",

  // 법학부
  "법학부": "https://law.inu.ac.kr/",
}

// ── 학과별 횃불이 이미지 경로 ───────────────────────────────────
export const DEPARTMENT_IMAGES: Record<string, string> = {
  // 인문대학
  "국어국문학과": "/01_인문대학_국어국문학과.png",
  "영어영문학과": "/02_인문대학_영어영문학과.png",
  "독어독문학과": "/03_인문대학_독어독문학과.png",
  "불어불문학과": "/04_인문대학_불어불문학과.png",
  "일본지역문화학과": "/05_인문대학_일본지역문화학과.png",
  "중어중국학과": "/06_인문대학_중어중국학과.png",

  // 자연과학대학
  "수학과": "/07_자연과학대학_수학과.png",
  "물리학과": "/08_자연과학대학_물리학과.png",
  "화학과": "/09_자연과학대학_화학과.png",
  "패션산업학과": "/10_자연과학대학_패션산업학과.png",
  "해양학과": "/11_자연과학대학_해양학과.png",

  // 사회과학대학
  "사회복지학과": "/12_사회과학대학_사회복지학과.png",
  "미디어커뮤니케이션학과": "/13_사회과학대학_미디어커뮤니케이션학과.png",
  "문헌정보학과": "/14_사회과학대학_문헌정보학과.png",
  "창의인재개발학과": "/15_사회과학대학_창의인재개발학과.png",

  // 글로벌정경대학
  "행정학과": "/16_글로벌정경대학_행정학과.png",
  "정치외교학과": "/17_글로벌정경대학_정치외교학과.png",
  "경제학과": "/18_글로벌정경대학_경제학과.png",
  "경제학과(야)": "/18_글로벌정경대학_경제학과.png",
  "무역학부": "/19_글로벌정경대학_무역학부.png",
  "무역학부(야)": "/19_글로벌정경대학_무역학부.png",
  "소비자학과": "/20_글로벌정경대학_소비자학과.png",
  "Global Trade & Service학부": "/19_글로벌정경대학_무역학부.png",

  // 공과대학
  "기계공학과": "/21_공과대학_기계공학과.png",
  "전기공학과": "/22_공과대학_전기공학과.png",
  "전자공학과": "/23_공과대학_전자공학과.png",
  "전자공학부": "/23_공과대학_전자공학과.png",
  "전자공학전공": "/23_공과대학_전자공학과.png",
  "산업경영공학과": "/24_공과대학_산업경영공학과.png",
  "신소재공학과": "/25_공과대학_신소재공학과.png",
  "안전공학과": "/26_공과대학_안전공학과.png",
  "에너지화학공학과": "/27_공과대학_에너지화학공학과.png",
  "바이오-로봇시스템공학과": "/28_공과대학_메카트로닉스공학과.png",
  "반도체융합전공": "/23_공과대학_전자공학과.png",

  // 정보기술대학
  "컴퓨터공학부": "/29_정보기술대학_컴퓨터공학부.png",
  "정보통신공학과": "/30_정보기술대학_정보통신공학과.png",
  "임베디드시스템공학과": "/31_정보기술대학_임베디드시스템공학과.png",

  // 경영대학
  "경영학부": "/32_경영대학_경영학부.png",
  "세무회계학과": "/33_경영대학_세무회계학과.png",
  "데이터과학과": "/32_경영대학_경영학부.png",

  // 예술체육대학
  "한국화전공": "/34_예술체육대학_한국화전공.png",
  "조형예술학부": "/34_예술체육대학_한국화전공.png",
  "서양화전공": "/35_예술체육대학_서양화전공.png",
  "디자인학부": "/36_예술체육대학_디자인학부.png",
  "공연예술학과": "/37_예술체육대학_공연예술학과.png",
  "스포츠과학부": "/38_예술체육대학_체육학부.png",
  "운동건강학부": "/39_예술체육대학_운동건강학부.png",

  // 사범대학
  "국어교육과": "/40_사범대학_국어교육과.png",
  "영어교육과": "/41_사범대학_영어교육과.png",
  "일어교육과": "/42_사범대학_일어교육과.png",
  "수학교육과": "/43_사범대학_수학교육과.png",
  "체육교육과": "/44_사범대학_체육교육과.png",
  "유아교육과": "/45_사범대학_유아교육과.png",
  "역사교육과": "/46_사범대학_역사교육과.png",
  "윤리교육과": "/47_사범대학_윤리교육과.png",

  // 도시과학대학
  "도시행정학과": "/48_도시과학대학_도시행정학과.png",
  "건설환경공학전공": "/49_도시과학대학_건설환경공학전공.png",
  "도시환경공학부": "/49_도시과학대학_건설환경공학전공.png",
  "환경공학전공": "/50_도시과학대학_환경공학전공.png",
  "도시공학과": "/51_도시과학대학_도시공학과.png",
  "도시건축학전공": "/52_도시과학대학_도시건축학전공.png",
  "도시건축학부": "/52_도시과학대학_도시건축학전공.png",
  "건축공학전공": "/53_도시과학대학_건축공학전공.png",

  // 생명과학기술대학
  "생명과학전공": "/54_생명과학기술대학_생명과학전공.png",
  "생명과학부": "/54_생명과학기술대학_생명과학전공.png",
  "분자의생명전공": "/55_생명과학기술대학_분자의생명전공.png",
  "생명공학전공": "/56_생명과학기술대학_생명공학전공.png",
  "생명공학부": "/56_생명과학기술대학_생명공학전공.png",
  "나노바이오공학전공": "/57_생명과학기술대학_나노바이오전공.png",

  // 동북아국제통상물류학부
  "동북아국제통상전공": "/58_동북아국제통상학부_동북아통상전공.png",
  "IBE전공": "/58_동북아국제통상학부_동북아통상전공.png",
  "스마트물류공학전공": "/59_동북아국제통상학부_한국통상전공.png",

  // 법학부
  "법학부": "/60_법학부.png",
}
