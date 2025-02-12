export function onRequest(context) {
  return fetchHandler(context.request, context.env);
}

async function fetchHandler(request, env) {
  // Handle CORS
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    // Validate environment variables
    if (!env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    if (!env.ADMIN_EMAIL) {
      throw new Error('ADMIN_EMAIL environment variable is not set');
    }

    // Parse the form data
    const formData = await request.formData();
    const data: { [key: string]: string } = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value as string;
    }

    // Required fields validation
    if (!data.email || !data.name) {
      return new Response(JSON.stringify({
        success: false,
        error: "Email and name are required"
      }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    const SENDER_EMAIL = 'forms@unltd.org.uk';  // Your verified domain email
    
    // Send confirmation email to user
    const userEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        to: data.email,
        subject: 'Thank you for your submission',
        text: `Dear ${data.name},\n\nThank you for your submission. We have received your information and will get back to you soon.\n\nBest regards,\nUnLtd Team`
      })
    });

    if (!userEmailResponse.ok) {
      const errorText = await userEmailResponse.text();
      throw new Error(`Failed to send confirmation email: ${errorText}`);
    }

    // Send notification to admin
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        to: env.ADMIN_EMAIL,
        subject: `New Form Submission from ${data.name}`,
        text: Object.entries(data)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')
      })
    });

    if (!adminEmailResponse.ok) {
      const errorText = await adminEmailResponse.text();
      throw new Error(`Failed to send admin notification: ${errorText}`);
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Form submission received and confirmation sent'
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
    });

    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
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