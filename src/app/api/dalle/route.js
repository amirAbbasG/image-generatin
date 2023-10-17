import { NextResponse } from "next/server";
import OpenAI from "openai";

import { connectToDB } from "@/lib/mongodb";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  await connectToDB();
  const { prompt } = await request.json();
  if (!prompt) {
    return NextResponse.json(
      { message: "prompt is required" },
      { status: 400 }
    );
  }

  try {
    const aiResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });
    return NextResponse.json(
      { image: aiResponse.data[0].b64_json },
      { status: 200 }
    );
  } catch (e) {
    console.log({ e });
    throw e;
  }
}
