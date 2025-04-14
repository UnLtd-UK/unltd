export function getPathFromUrl(url) {
    const urlObj = new URL(url);
    let path = urlObj.pathname;

    // Remove trailing slash if present
    if (path.endsWith('/') && path.length > 1) {
        path = path.slice(0, -1);
    }

    return path;
}

export function checkSourceCors(context, DOMAIN) {
    try {
        if (context.request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            });
        }

        const host = context.request.headers.get('host')

        if (!host || !host.startsWith(DOMAIN)) {
            return new Response(JSON.stringify({
                success: false,
                error: "Invalid referer",
                message: "The request did not originate from a valid domain."
            }), {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            });
        }
        console.log('Source and CORS check passed');
    } catch (error) {
        console.error('Error checking source CORS:', error);
        throw new Error('CORS check failed');
    }
}

export async function getFormData(context) {
    try {
        const formData = await context.request.formData();
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        delete data["cf-turnstile-response"];
        console.log('Form data retrieved successfully');
        return data;
    } catch (error) {
        console.error('Error parsing form data:', error);
        throw new Error('Failed to parse form data');
    }
}

export function checkFields(data, requiredFields = ['email', 'message']) {
    try {
        const missing = requiredFields.filter(field => !data[field]);
        if (missing.length > 0) {
            return new Response(JSON.stringify({
                success: false,
                error: `Required fields missing: ${missing.join(', ')}`
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            });
        }
        console.log('Validated required fields');
        return true;
    } catch (error) {
        console.error('Error validating fields:', error);
        throw new Error('Field validation failed');
    }
}

export async function sendEmail(RESEND_API_KEY, from, to, subject, text) {
    try {
        await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ from, to, subject, text })
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
}

export function getBaseUrl(request) {
    const referer = request.headers.get('referer');
    const refererUrl = new URL(referer || '');
    return `${refererUrl.protocol}//${refererUrl.host}`;
}

export function createRedirectResponse(url, status = 302) {
    return new Response(null, {
        status,
        headers: {
            'Location': url,
            'Access-Control-Allow-Origin': '*',
        }
    });
}