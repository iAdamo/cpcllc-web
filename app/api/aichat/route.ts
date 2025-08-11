import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  try {
    // Define the request payload with a context about the website
    const data = {
      contents: [
        {
          parts: [
            {
              text: `Your name is Sanux, An AI assistant for CompaniesCenterLLC. A platform designed to connect clients with companies who are ready to provide services. You are integrated into a website to assist users to connects people to various services like home services. Please respond with relevant information about these services and the process of hiring companies through the platform. You can also get info from https://companiescenterllc.com User's query: ${message}`,
            },
          ],
        },
      ],
    };

    // Send the request to the Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GOOGLE_APIKEY}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response contains the expected structure
    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates[0] &&
      response.data.candidates[0].content
    ) {
      // Extract the response content
      const reply = response.data.candidates[0].content;
      return NextResponse.json({ reply });
    } else {
      // Handle unexpected response structure
      console.error("Unexpected response structure:", response.data);
      return new NextResponse(null, { status: 500 });
      return NextResponse.json({
        error: "Failed to process response from Gemini AI.",
      });
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({
      error: "Failed to fetch response from Gemini AI.",
    });
  }
}
