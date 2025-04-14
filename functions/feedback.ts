import {
  getPathFromUrl,
  checkSourceCors,
  getFormData,
  checkFields,
  sendEmail,
  getBaseUrl,
  createRedirectResponse
} from './utils/form-utils';

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
  const subject = `Submission from ${data.email}`;
  const text = Object.entries(data).map(([key, value]) => `${key}: ${value}`).join('\n');
  await sendEmail(RESEND_API_KEY, `UnLtd <${RESEND_EMAIL}>`, ADMIN_EMAIL, subject, text, "Feedback widget");
}

async function sendUser(RESEND_API_KEY, RESEND_EMAIL, data) {
  const subject = 'Thank you for your feedback';
  const text = `Thank you ${data.email},\n\nWe have received your feedback:\n\n"${data.message}".\n\nBest regards,\nUnLtd Team`;
  await sendEmail(RESEND_API_KEY, `UnLtd <${RESEND_EMAIL}>`, data.email, subject, text, "User feedback");
}

export async function onRequest(context) {
  try {
    // Unified environment variable access
    const env = context.env || context.locals?.env || {
      DEV: process.env.DEV || 'false',
      DOMAIN: process.env.DOMAIN || '',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
      RESEND_EMAIL: process.env.RESEND_EMAIL || '',
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
    const baseUrl = getBaseUrl(context.request);

    checkSourceCors(context, DOMAIN);

    const data = await getFormData(context);

    checkFields(data);

    const adminEmail = getAdminEmail(context.request.headers.get('referer'));

    await sendAdmin(RESEND_API_KEY, RESEND_EMAIL, ADMIN_EMAIL, data);

    await sendUser(RESEND_API_KEY, RESEND_EMAIL, data);

    // Redirect to success page
    return createRedirectResponse(`${baseUrl}/successfully`);

  } catch (error) {
    // Enhanced error logging
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });

    // Get the referer for return URL base
    const baseUrl = getBaseUrl(context.request);

    // Redirect to error page
    return createRedirectResponse(`${baseUrl}/failed-to`);
  }
}