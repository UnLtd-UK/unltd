function getPathFromUrl(url) {
  const urlObj = new URL(url);
  let path = urlObj.pathname;

  // Remove trailing slash if present
  if (path.endsWith('/') && path.length > 1) {
    path = path.slice(0, -1);
  }

  return path;
}

async function sendAdmin(RESEND_API_KEY, RESEND_EMAIL, ADMIN_EMAIL, data) {
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

}

async function sendUser(RESEND_API_KEY, RESEND_EMAIL, data) {
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
}

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
      RESEND_EMAIL = '',
      RESEND_API_KEY = '',
      DOMAIN = ''
    } = env;

    // Logging with environment-specific prefix
    const ENV = DEV === 'true' ? 'DEV' : 'PROD';
    console.log(`${ENV}-RESEND_EMAIL: ${RESEND_EMAIL}`);
    console.log(`${ENV}-RESEND_API_KEY: ${RESEND_API_KEY}`);
    console.log(`${ENV}-DOMAIN: ${DOMAIN}`);

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

    let ADMIN_EMAIL = context.env || context.locals?.env || { ADMIN_EMAIL: process.env.ADMIN_EMAIL || '' }

    const path = getPathFromUrl(context.request.headers.referer);

    console.log(path);
    switch (path) {
      case '/contact/general':
        ADMIN_EMAIL = 'general@unltd.org.uk';
        break;
      case '/contact/award':
        ADMIN_EMAIL = 'awardapplications@unltd.org.uk';
        break;
      case '/contact/fundraising':
        ADMIN_EMAIL = 'fundraising@unltd.org.uk';
        break;
      case '/contact/partnerships':
        ADMIN_EMAIL = 'partnerships@unltd.org.uk';
        break;
      case '/contact/volunteering':
        ADMIN_EMAIL = 'mentoring@unltd.org.uk';
        break;
      case '/contact/press-and-media':
        ADMIN_EMAIL = 'press@unltd.org.uk';
        break;
    }

    console.log(`${ENV}-ADMIN_EMAIL: ${ADMIN_EMAIL}`);

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

    await sendAdmin(RESEND_API_KEY, RESEND_EMAIL, ADMIN_EMAIL, data);

    await sendUser(RESEND_API_KEY, RESEND_EMAIL, data);

    return new Response(JSON.stringify({
      success: true,
      message: "Email recieved and confirmation email sent"
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })

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