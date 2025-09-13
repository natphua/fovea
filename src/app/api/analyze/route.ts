import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { focusResults } = await req.json();

  // Call Claude API
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.CLAUDE_API_KEY!,
      "content-type": "application/json",
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-opus-20240229", 
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Analyze these focus test results: ${JSON.stringify(focusResults)}`
        }
      ]
    })
  });

  const data = await response.json();
  return NextResponse.json({ analysis: data });
}