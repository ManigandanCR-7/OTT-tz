const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
    try {
        // Ensure this is a POST request
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                body: JSON.stringify({ message: 'Method not allowed' }),
            };
        }

        // Parse the request body
        const { name, email, picture, credits } = JSON.parse(event.body || '{}');

        // Validate required fields
        if (!name || !email || !picture || typeof credits !== 'number') {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Missing required fields: name, email, picture, and credits are mandatory',
                }),
            };
        }

        // Insert or update user information
        const { data, error } = await supabase
            .from('OTT"Tz') // Update this with your actual table name
            .upsert({
                name,
                email,
                picture,
                credits,
            });

        // Check for Supabase errors
        if (error) {
            console.error('Supabase Error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Database error', details: error.message }),
            };
        }

        // Success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User information updated successfully', data }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error', details: error.message }),
        };
    }
};
