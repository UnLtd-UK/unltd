import {
  getPathFromUrl,
  checkSourceCors,
  getFormData,
  checkFields,
  sendEmail,
  getBaseUrl,
  createRedirectResponse
} from './utils/form-utils';

function getEnquiriesContact(referer) {
  try {
    let enquiriesContact = { email: '', name: '' };

    const path = getPathFromUrl(referer);
    console.log('Path:', path);

    switch (path) {
      case '/contact/general':
        enquiriesContact.email = 'generalenquiries@unltd.org.uk';
        enquiriesContact.name = 'General Enquiries';
        break;
      case '/contact/award':
        enquiriesContact.email = 'awardapplications@unltd.org.uk';
        enquiriesContact.name = 'Award Application Enquiries';
        break;
      case '/contact/fundraising':
        enquiriesContact.email = 'fundraising@unltd.org.uk';
        enquiriesContact.name = 'Fundraising Enquiries';
        break;
      case '/contact/partnerships':
        enquiriesContact.email = 'partnerships@unltd.org.uk';
        enquiriesContact.name = 'Partnerships Enquiries';
        break;
      case '/contact/volunteering':
        enquiriesContact.email = 'mentoring@unltd.org.uk';
        enquiriesContact.name = 'Volunteering Enquiries';
        break;
      case '/contact/press-and-media':
        enquiriesContact.email = 'press@unltd.org.uk';
        enquiriesContact.name = 'Press and Media Enquiries';
        break;
    }

    console.log('Admin name:', enquiriesContact.name);
    console.log('Admin email:', enquiriesContact.email);
    return enquiriesContact;
  } catch (error) {
    console.error('Error getting admin email:', error);
    throw new Error('Failed to get admin email');
  }
}

async function sendContact(RESEND_API_KEY, RESEND_FROM_EMAIL, enquiriesContact, data) {
  const subject = `Submission from ${data.email}`;
  // const preview = `<p>HTML preview text</p>`;
  const text = Object.entries(data).map(([key, value]) => `${key}: ${value}`).join('\n');
  await sendEmail(RESEND_API_KEY, `UnLtd ${enquiriesContact.name} <${RESEND_FROM_EMAIL}>`, enquiriesContact.email, subject, text);
}

async function sendUser(RESEND_API_KEY, RESEND_FROM_EMAIL, enquiriesContact, data) {
  const subject = 'Thank you for your feedback';
  // const preview = `<p>HTML preview text</p>`;
  const text = `Thank you ${data.email},\n\nWe have received your feedback:\n\n"${data.message}".\n\nBest regards,\nUnLtd Team`;
  await sendEmail(RESEND_API_KEY, `UnLtd ${enquiriesContact.name} <${enquiriesContact.email}>`, data.email, subject, text);
}

export async function onRequest(context) {
  try {
    // Unified environment variable access
    const env = context.env || context.locals?.env || {
      DEV: process.env.DEV || 'false',
      DOMAIN: process.env.DOMAIN || '',
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || '',
      RESEND_API_KEY: process.env.RESEND_API_KEY || ''
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
    } = env;

    // Logging with environment-specific prefix
    const ENV = DEV === 'true' ? 'DEV' : 'PROD';

    console.log(`${ENV}-DEV: ${DEV}`);
    console.log(`${ENV}-DOMAIN: ${DOMAIN}`);
    console.log(`${ENV}-RESEND_FROM_EMAIL: ${RESEND_FROM_EMAIL}`);
    console.log(`${ENV}-RESEND_API_KEY: ${RESEND_API_KEY}`);

    // Get the referer for return URL base
    const baseUrl = getBaseUrl(context.request);

    checkSourceCors(context, DOMAIN);

    const data = await getFormData(context);

    checkFields(data);

    const enquiriesContact = getEnquiriesContact(context.request.headers.get('referer'));

    await sendContact(RESEND_API_KEY, RESEND_FROM_EMAIL, enquiriesContact, data);

    await sendUser(RESEND_API_KEY, RESEND_FROM_EMAIL, enquiriesContact, data);

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