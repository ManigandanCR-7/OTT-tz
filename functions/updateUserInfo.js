// Assuming you're using the Supabase client

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient('https://your-supabase-url', 'your-anon-key');

exports.handler = async (event) => {
    const { name, email, picture, credits } = JSON.parse(event.body);

    // Check if the user already exists
    const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();  // Fetch only one user by email

    if (fetchError) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error fetching user", error: fetchError.message }),
        };
    }

    // If the user exists, return their data
    if (existingUser) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                userExists: true,
                name: existingUser.name,
                email: existingUser.email,
                picture: existingUser.picture,
                credits: existingUser.credits
            }),
        };
    }

    // If the user doesn't exist, create a new user
    const { data: newUser, error: insertError } = await supabase
        .from('users')
        .upsert({ name, email, picture, credits });

    if (insertError) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error inserting new user", error: insertError.message }),
        };
    }

    // Return the new user data
    return {
        statusCode: 200,
        body: JSON.stringify({
            userExists: false,
            name: newUser[0].name,
            email: newUser[0].email,
            picture: newUser[0].picture,
            credits: newUser[0].credits
        }),
    };
};
