import {
  getPathFromUrl,
  checkSourceCors,
  getFormData,
  checkFields,
  sendEmail,
  getBaseUrl,
  createRedirectResponse
} from './utils/form-utils';

async function sendContact(RESEND_API_KEY, RESEND_FROM_EMAIL, FEEDBACK_EMAIL, data) {
  const subject = `Submission from ${data.email}`;
  // const preview = `<p>HTML preview text</p>`;
  const text = Object.entries(data).map(([key, value]) => `${key}: ${value}`).join('\n');
  await sendEmail(RESEND_API_KEY, `UnLtd <${RESEND_FROM_EMAIL}>`, FEEDBACK_EMAIL, subject, text);
}

async function sendUser(RESEND_API_KEY, RESEND_FROM_EMAIL, data) {
  const subject = 'Thank you for your feedback';
  // const preview = `<p>HTML preview text</p>`;
  const text = `Thank you ${data.email},\n\nWe have received your feedback:\n\n"${data.message}".\n\nBest regards,\nUnLtd Team`;
  await sendEmail(RESEND_API_KEY, `UnLtd <${RESEND_FROM_EMAIL}>`, data.email, subject, text);
}

export async function onRequest(context) {
  try {
    // Unified environment variable access
    const env = context.env || context.locals?.env || {
      DEV: process.env.DEV || 'false',
      DOMAIN: process.env.DOMAIN || '',
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || '',
      RESEND_API_KEY: process.env.RESEND_API_KEY || '',
      FEEDBACK_EMAIL: process.env.FEEDBACK_EMAIL || '',
    };

    if (!env) {
      throw new Error('No environment configuration found');
    }

    // Destructure environment variables with default fallbacks
    const {
      DEV = 'false',
      DOMAIN = '',
      RESEND_FROM_EMAIL = '',
      RESEND_API_KEY = '',
      FEEDBACK_EMAIL = '',
    } = env;

    // Logging with environment-specific prefix
    const ENV = DEV === 'true' ? 'DEV' : 'PROD';

    console.log(`${ENV}-DEV: ${DEV}`);
    console.log(`${ENV}-DOMAIN: ${DOMAIN}`);
    console.log(`${ENV}-RESEND_FROM_EMAIL: ${RESEND_FROM_EMAIL}`);
    console.log(`${ENV}-RESEND_API_KEY: ${RESEND_API_KEY}`);
    console.log(`${ENV}-FEEDBACK_EMAIL: ${FEEDBACK_EMAIL}`);

    // Get the referer for return URL base
    const baseUrl = getBaseUrl(context.request);

    checkSourceCors(context, DOMAIN);

    const data: { [key: string]: string } = await getFormData(context);

    data.path = getPathFromUrl(context.request.headers.get('referer') || '');

    checkFields(data);

    await sendContact(RESEND_API_KEY, RESEND_FROM_EMAIL, FEEDBACK_EMAIL, data);

    await sendUser(RESEND_API_KEY, RESEND_FROM_EMAIL, data);

    // Redirect to success page
    return createRedirectResponse(`${baseUrl}/sent`);

  } catch (error) {
    // Enhanced error logging
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });

    // Get the referer for return URL base
    const baseUrl = getBaseUrl(context.request);

    // Redirect to error page
    return createRedirectResponse(`${baseUrl}/failed`);
  }
}