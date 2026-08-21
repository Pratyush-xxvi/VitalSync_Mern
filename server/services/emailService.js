import axios from 'axios';

export const sendEmail = async (to, subject, body) => {
    console.log(`EMAIL_SERVICE: Attempting to send email to: ${to}`);
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
        console.warn(`EMAIL_SERVICE: BREVO_API_KEY is not set. Email to ${to} was skipped.`);
        return;
    }

    try {
        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: { name: 'VitalSync', email: 'pratived2610@gmail.com' },
                to: [{ email: to }],
                subject: subject,
                textContent: body
            },
            {
                headers: {
                    'api-key': apiKey,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                timeout: 15000
            }
        );

        if (response.status >= 200 && response.status < 300) {
            console.log(`EMAIL_SERVICE: Email sent SUCCESSFULLY to: ${to} (HTTP ${response.status})`);
        } else {
            console.error(`EMAIL_SERVICE: FAILED to send email to: ${to}. Status ${response.status}`);
        }
    } catch (error) {
        console.error(`EMAIL_SERVICE: FAILED to send email to: ${to}. Error: ${error.message}`);
    }
};
