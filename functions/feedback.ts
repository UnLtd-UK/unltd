function getPathFromUrl(url) {
  const urlObj = new URL(url);
  let path = urlObj.pathname;

  // Remove trailing slash if present
  if (path.endsWith('/') && path.length > 1) {
    path = path.slice(0, -1);
  }

  return path;
}

function checkSourceCors(context, DOMAIN) {
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

async function getFormData(context) {
  try {
    const formData = await context.request.formData();
    const data: { [key: string]: string } = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value as string;
    }
    console.log('Form data retrieved successfully');
    return data;
  } catch (error) {
    console.error('Error parsing form data:', error);
    throw new Error('Failed to parse form data');

  }
}

function checkFields(data) {
  try {
    if (!data.email || !data.message) {
      return new Response(JSON.stringify({
        success: false,
        error: "Email and message are required"
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

function getAdminEmail(referer) {
  try {
    let adminEmail = '';

    const path = getPathFromUrl(referer);
    console.log('Path:', path);

    switch (path) {
      case '/contact/general':
        adminEmail = 'generalenquiries@unltd.org.uk';
        break;
      case '/contact/award':
        adminEmail = 'awardapplications@unltd.org.uk';
        break;
      case '/contact/fundraising':
        adminEmail = 'fundraising@unltd.org.uk';
        break;
      case '/contact/partnerships':
        adminEmail = 'partnerships@unltd.org.uk';
        break;
      case '/contact/volunteering':
        adminEmail = 'mentoring@unltd.org.uk';
        break;
      case '/contact/press-and-media':
        adminEmail = 'press@unltd.org.uk';
        break;
    }

    console.log('Admin email:', adminEmail);
    return adminEmail;
  } catch (error) {
    console.error('Error getting admin email:', error);
    throw new Error('Failed to get admin email');
  }
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
      ADMIN_EMAIL = '',
      DOMAIN = ''
    } = env;

    // Logging with environment-specific prefix
    const ENV = DEV === 'true' ? 'DEV' : 'PROD';

    console.log(`${ENV}-RESEND_EMAIL: ${RESEND_EMAIL}`);
    console.log(`${ENV}-RESEND_API_KEY: ${RESEND_API_KEY}`);
    console.log(`${ENV}-DOMAIN: ${DOMAIN}`);
    console.log(`${ENV}-ADMIN_EMAIL: ${ADMIN_EMAIL}`);

    // Get the referer for return URL base
    const referer = context.request.headers.get('referer');
    const refererUrl = new URL(referer || '');
    const baseUrl = `${refererUrl.protocol}//${refererUrl.host}`;

    checkSourceCors(context, DOMAIN);

    const data = await getFormData(context);

    checkFields(data);

    const adminEmail = getAdminEmail(context.request.headers.get('referer'));

    await sendAdmin(RESEND_API_KEY, RESEND_EMAIL, ADMIN_EMAIL, data);

    await sendUser(RESEND_API_KEY, RESEND_EMAIL, data);

    // Redirect to success page
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `${baseUrl}/successfully`,
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (error) {
    // Enhanced error logging
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });

    // Get the referer for return URL base
    const referer = context.request.headers.get('referer');
    const refererUrl = new URL(referer || '');
    const baseUrl = `${refererUrl.protocol}//${refererUrl.host}`;

    // Redirect to error page
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `${baseUrl}/failed-to`,
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}