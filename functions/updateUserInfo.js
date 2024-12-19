// /netlify/functions/updateUserInfo.js

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
    process.env.SUPABASE_URL, // Your Supabase URL (from the dashboard)
    process.env.SUPABASE_KEY // Your Supabase public API key
);

exports.handler = async (event, context) => {
    if (event.httpMethod === "POST") {
        try {
            // Parse incoming data
            const { name, email, picture } = JSON.parse(event.body);

            // Store user information in Supabase
            const { data, error } = await supabase
               .from('"OTT\'Tz"')
                .upsert({ name, email, picture, credits: 100 }) // Set initial credits to 100
                .eq('email', email);

            if (error) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Error inserting data', error: error.message }),
                };
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'User data stored successfully!', data }),
            };

        } catch (err) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Server error', error: err.message }),
            };
        }
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method not allowed' }),
        };
    }
};
