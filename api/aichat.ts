import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { message } = req.body;
    try {
      // Define the request payload with a context about the website
      const data = {
        contents: [
          {
            parts: [
              {
                text: `You are assisting users with a website that connects people to various services like plumbing, house cleaning, electrical work, and industrial painting. Please respond with relevant information about these services and the process of hiring companies through the platform. User's query: ${message}`,
              },
            ],
          },
        ],
      };

      // Send the request to the Gemini API
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyA-Y8mh3kuFhpW3I8Ml7-s1sparJhMb7Jw",
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
        res.status(200).json({ reply });
      } else {
        // Handle unexpected response structure
        console.error("Unexpected response structure:", response.data);
        res
          .status(500)
          .json({ error: "Unexpected response structure from Gemini AI." });
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch response from Gemini AI." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
