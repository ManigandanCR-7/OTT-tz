// /netlify/functions/updateUserInfo.js

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
    process.env.SUPABASE_URL, // Your Supabase URL (from the dashboard)
    process.env.SUPABASE_KEY // Your Supabase public API key
);



exports.handler = async (event, context) => {
  try {
    // Ensure it's a POST request
    if (event.httpMethod !== "PUT") {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method not allowed" }),
      };
    }

    // Parse the incoming JSON body
    const data = JSON.parse(event.body);

    // Validate required fields
    if (!data.username || !data.email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" }),
      };
    }

    // Simulate database insertion or processing
    // Replace this with your actual database logic
    console.log("Data received:", data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User info updated successfully" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
