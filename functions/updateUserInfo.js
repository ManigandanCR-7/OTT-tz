const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient('https://your-supabase-url', 'your-anon-key');

exports.handler = async (event) => {
    try {
        const { name, email, picture, credits } = JSON.parse(event.body);

        // Check if the user already exists by email
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();  // Fetch only one user by email

        // Handle errors in fetching user
        if (fetchError && fetchError.code !== 'PGRST100') { // Exclude specific "no rows found" error
            console.error("Error fetching user:", fetchError);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Error fetching user", error: fetchError.message }),
            };
        }

        // If user exists, return their details
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

        // If user doesn't exist, create a new user
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .upsert({ name, email, picture, credits }, { onConflict: ['email'] });

        // Handle errors in inserting new user
        if (insertError) {
            console.error("Error inserting new user:", insertError);
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
    } catch (error) {
        // Catch any unexpected errors
        console.error("Unexpected error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Unexpected error", error: error.message }),
        };
    }
};
