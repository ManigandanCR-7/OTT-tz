const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.handler = async (event) => {
    try {
        const { token } = JSON.parse(event.body);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const user = ticket.getPayload();

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, user }),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, error: 'Invalid token' }),
        };
    }
};
