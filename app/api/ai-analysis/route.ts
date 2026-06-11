import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("AI API called with body:", body)
    console.log("API Key exists?", !!process.env.GEMINI_API_KEY)
    
    const { target, stats } = body
    const today = new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const prompt = `당신은 대학교 교육과정 분석 전문가입니다.
아래 데이터를 바탕으로 분석 보고서를 작성하세요.
반드시 아래 형식을 따르세요.

=== AI 강의 데이터 분석 보고서 ===
분석 대상: ${target}
일자: ${today}
작성 모델: Gemini 3.1 Flash-Lite

# [분석 보고서] 2026학년도 1학기 ${target} 강좌 운영 분석

## 1. 데이터 요약
## 2. 주요 특징 및 트렌드 분석
## 3. 문제점 및 개선 아이디어 제언

각 항목을 구체적인 수치와 함께 작성하세요.

[데이터]:
${JSON.stringify(stats, null, 2)}`

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    })

    // Use generateText instead of streamText
    const { text } = await generateText({
      model: google("gemini-3.1-flash-lite"),
      prompt,
    })

    return NextResponse.json({ text })
  } catch (error: any) {
    console.error("AI Analysis Error:", error)
    return NextResponse.json(
      { error: error.message || "AI 분석 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
