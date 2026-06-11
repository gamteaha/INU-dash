import { COLLEGE_ORDER, mapCollegeName } from "@/lib/supabase/constants"
import { extractDays, extractStartHour, type Course } from "@/context/DashboardFilterContext"

// ── KPI Stats ──────────────────────────────────────────────────
export function processKpiStats(courses: Course[]) {
  let totalCapacity = 0
  let totalEnrolled = 0
  let englishLecturesCount = 0

  courses.forEach((course) => {
    totalCapacity += parseInt(course.정원 || "0", 10)
    totalEnrolled += parseInt(course.수강 || "0", 10)
    if (course.원어강의 === "Y") englishLecturesCount++
  })

  return {
    totalCourses: courses.length,
    totalCapacity,
    totalEnrolled,
    englishLecturesCount,
  }
}

// ── Course Type Stats ──────────────────────────────────────────
export function processCourseTypeStats(courses: Course[]) {
  const courseTypeCount: Record<string, number> = {}
  const courseTypeEnrolled: Record<string, { sum: number; count: number }> = {}

  courses.forEach((course) => {
    const enrolled = parseInt(course.수강 || "0", 10)
    const ct = (course.이수구분 || "기타").trim()

    courseTypeCount[ct] = (courseTypeCount[ct] || 0) + 1
    if (!courseTypeEnrolled[ct]) courseTypeEnrolled[ct] = { sum: 0, count: 0 }
    courseTypeEnrolled[ct].sum += enrolled
    courseTypeEnrolled[ct].count += 1
  })

  const byCourseTypeCount = Object.entries(courseTypeCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7)

  const byCourseTypeAvgEnroll = Object.entries(courseTypeEnrolled)
    .map(([name, s]) => ({ name, value: s.count > 0 ? s.sum / s.count : 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7)

  return { byCourseTypeCount, byCourseTypeAvgEnroll }
}

// ── Distribution Stats ─────────────────────────────────────────
export function processDistributionStats(courses: Course[]) {
  const teachingMethodCount: Record<string, number> = {}
  const creditCount: Record<string, number> = {}

  courses.forEach((course) => {
    const method = (course.수업방법 || "대면수업").trim()
    teachingMethodCount[method] = (teachingMethodCount[method] || 0) + 1

    const credit = course.학점 || "0"
    const creditKey = `${credit}학점`
    creditCount[creditKey] = (creditCount[creditKey] || 0) + 1
  })

  const totalMethods = Object.values(teachingMethodCount).reduce((a, b) => a + b, 0)
  const teachingMethodData = Object.entries(teachingMethodCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({
      name,
      value,
      percent: totalMethods > 0 ? (value / totalMethods) * 100 : 0,
    }))

  const totalCredits = Object.values(creditCount).reduce((a, b) => a + b, 0)
  const creditData = Object.entries(creditCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({
      name,
      value,
      percent: totalCredits > 0 ? (value / totalCredits) * 100 : 0,
    }))

  return { teachingMethodData, creditData }
}

// ── Time Stats ─────────────────────────────────────────────────
export function processTimeStats(courses: Course[]) {
  const dayCount: Record<string, number> = { 월: 0, 화: 0, 수: 0, 목: 0, 금: 0, 토: 0 }
  const timeSlotCount: Record<string, number> = {
    "오전 9-12시": 0,
    "12-15시": 0,
    "15-18시": 0,
    "18시 이후": 0,
  }

  courses.forEach((course) => {
    const days = extractDays(course["시간표(교시)"] || "")
    days.forEach((day) => { if (day in dayCount) dayCount[day] += 1 })

    const startHour = extractStartHour(course["시간표(시간)"] || "")
    if (startHour !== null) {
      if (startHour >= 9 && startHour < 12) timeSlotCount["오전 9-12시"] += 1
      else if (startHour >= 12 && startHour < 15) timeSlotCount["12-15시"] += 1
      else if (startHour >= 15 && startHour < 18) timeSlotCount["15-18시"] += 1
      else if (startHour >= 18) timeSlotCount["18시 이후"] += 1
    }
  })

  const DAY_ORDER = ["월", "화", "수", "목", "금", "토"]
  const dayData = DAY_ORDER.map((day) => ({ name: day, value: dayCount[day] || 0 }))
  const timeSlotData = Object.entries(timeSlotCount).map(([name, value]) => ({ name, value }))

  return { dayData, timeSlotData }
}

// ── College Summary ────────────────────────────────────────────
export function processCollegeSummary(courses: Course[]) {
  const collegeStats: Record<string, { courses: number; enrolled: number; capacity: number }> = {}

  COLLEGE_ORDER.forEach(col => {
    collegeStats[col] = { courses: 0, enrolled: 0, capacity: 0 }
  })

  courses.forEach((course) => {
    const mappedCollege = mapCollegeName(course["대학(원)"])
    if (!collegeStats[mappedCollege]) return

    const enrolled = parseInt(course.수강 || "0", 10)
    const capacity = parseInt(course.정원 || "0", 10)
    
    collegeStats[mappedCollege].courses += 1
    collegeStats[mappedCollege].enrolled += enrolled
    collegeStats[mappedCollege].capacity += capacity
  })

  return COLLEGE_ORDER.map((collegeName) => {
    const s = collegeStats[collegeName]
    return {
      name: collegeName,
      courseCount: s.courses,
      totalEnrolled: s.enrolled,
      avgEnrollRate: s.capacity > 0 ? (s.enrolled / s.capacity) * 100 : 0,
    }
  })
    .filter((r) => r.courseCount > 0)
    .sort((a, b) => b.courseCount - a.courseCount)
    .map((r, idx) => ({ ...r, rank: idx + 1 }))
}

// ── Department Summary ─────────────────────────────────────────
export function processDepartmentSummary(courses: Course[]) {
  const deptStats: Record<string, { courses: number; enrolled: number; capacity: number }> = {}

  courses.forEach((course) => {
    const deptName = course["학과(부)"]?.trim() || "기타"
    if (!deptStats[deptName]) {
      deptStats[deptName] = { courses: 0, enrolled: 0, capacity: 0 }
    }

    const enrolled = parseInt(course.수강 || "0", 10)
    const capacity = parseInt(course.정원 || "0", 10)
    
    deptStats[deptName].courses += 1
    deptStats[deptName].enrolled += enrolled
    deptStats[deptName].capacity += capacity
  })

  return Object.entries(deptStats)
    .map(([name, s]) => ({
      name,
      courseCount: s.courses,
      totalEnrolled: s.enrolled,
      avgEnrollRate: s.capacity > 0 ? (s.enrolled / s.capacity) * 100 : 0,
    }))
    .sort((a, b) => b.courseCount - a.courseCount)
    .map((r, idx) => ({ ...r, rank: idx + 1 }))
}

// ── Grade Summary ──────────────────────────────────────────────
export function processGradeSummary(courses: Course[]) {
  const gradeStats: Record<string, { courses: number; enrolled: number; capacity: number }> = {}
  const GRADE_ORDER = ["1", "2", "3", "4", "전학년"]

  GRADE_ORDER.forEach(g => {
    gradeStats[g] = { courses: 0, enrolled: 0, capacity: 0 }
  })

  courses.forEach((course) => {
    let grade = course.학년?.trim()
    // 학년 값이 없거나 다른 값이면 기타 등등 처리. 일반적으론 1,2,3,4,전학년
    if (!grade || !GRADE_ORDER.includes(grade)) grade = "전학년"
    
    const enrolled = parseInt(course.수강 || "0", 10)
    const capacity = parseInt(course.정원 || "0", 10)
    
    gradeStats[grade].courses += 1
    gradeStats[grade].enrolled += enrolled
    gradeStats[grade].capacity += capacity
  })

  return GRADE_ORDER.map((grade) => {
    const s = gradeStats[grade]
    return {
      name: grade === "전학년" ? "전학년" : `${grade}학년`,
      courseCount: s.courses,
      totalEnrolled: s.enrolled,
      avgEnrollRate: s.capacity > 0 ? (s.enrolled / s.capacity) * 100 : 0,
    }
  })
    .filter((r) => r.courseCount > 0)
    .sort((a, b) => b.courseCount - a.courseCount)
    .map((r, idx) => ({ ...r, rank: idx + 1 }))
}
