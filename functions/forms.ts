export async function onRequest(context) {
  try {
    // Unified environment variable access
    const env = context.env || context.locals?.env || {
      DEV: process.env.DEV || 'false',
      DOMAIN: process.env.DOMAIN || '',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
      RESEND_EMAIL: process.env.RESEND_EMAIL || '',
      // Add other non-secret vars here
    };
    
    if (!env) {
      throw new Error('No environment configuration found');
    }

    // Destructure environment variables with default fallbacks
    const {
      DEV = 'false',
      ADMIN_EMAIL = '',
      RESEND_EMAIL = '',
      EVENTBRITE_API_TOKEN = '',
      RESEND_API_KEY = '',
      DOMAIN = '',
      GITHUB_FINEGRAINED_PERSONAL_ACCESS_TOKENS = ''
    } = env;

    // Logging with environment-specific prefix
    const ENV = DEV === 'true' ? 'DEV' : 'PROD';
    console.log(`${ENV}-ADMIN_EMAIL: ${ADMIN_EMAIL}`);
    console.log(`${ENV}-RESEND_EMAIL: ${RESEND_EMAIL}`);
    console.log(`${ENV}-EVENTBRITE_API_TOKEN: ${EVENTBRITE_API_TOKEN}`);
    console.log(`${ENV}-RESEND_API_KEY: ${RESEND_API_KEY}`);
    console.log(`${ENV}-DOMAIN: ${DOMAIN}`);
    console.log(`${ENV}-GITHUB_FINEGRAINED_PERSONAL_ACCESS_TOKENS: ${GITHUB_FINEGRAINED_PERSONAL_ACCESS_TOKENS}`);

    // CORS handling for preflight requests
    if (context.request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    console.log("Checked CORS");

    // Came from website
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

    console.log("Checked Domain");

    // Get data from form
    const formData = await context.request.formData();
    const data: { [key: string]: string } = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value as string;
    }

    console.log("Got data from form");

    // Required fields validation
    if (!data.email) {
      return new Response(JSON.stringify({
        success: false,
        error: "Email is required"
      }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    console.log("Checked there was an Email");

    // Email sent to Admin
    try {
      await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `UnLtd <${RESEND_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `Submission from ${data.email}`,
        text: Object.entries(data).map(([key, value]) => `${key}: ${value}`).join('\n')
      })
      });
    } catch (error) {
      throw new Error(`Failed to send confirmation email: ${error.message}`);
    }

    console.log("Email sent to Admin");

    // Send email to sender
    try {
      await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `UnLtd <${RESEND_EMAIL}>`,
        to: data.email,
        subject: 'Thank you for your feedback',
        text: `Thank you ${data.email},\n\nWe have received your feedback:\n\n"${data.message}".\n\nBest regards,\nUnLtd Team`
      })
      });
    } catch (error) {
      throw new Error(`Failed to send confirmation email: ${error.message}`);
    }

    console.log("Email sent to sender");

    return new Response(JSON.stringify({
      success: true,
      message: "Email recieved and confirmation email sent"
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (error) {
    // Enhanced error logging
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });

    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}