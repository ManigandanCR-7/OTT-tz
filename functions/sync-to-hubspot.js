const fetch = require('node-fetch');

exports.handler = async (event) => {
    try {
        const { email, firstname, lastname } = JSON.parse(event.body);

        const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                properties: { email, firstname, lastname },
            }),
        });

        const data = await res.json();

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, data }),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, error: 'Failed to sync with HubSpot' }),
        };
    }
};
