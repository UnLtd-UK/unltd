export async function onRequest(context) {
  // Debug log to print environment variables

    const recipient: Array<{ title: string, path: string, email: string }> = [
    {
    title: "Awards form",
    path: "/contact/awards",
    email: "digital@unltd.org.uk" // "awardapplications@unltd.org.uk"
  },
  {
    title: "Fundraising form",
    path: "/contact/fundraising",
    email: "digital@unltd.org.uk" // "fundraising@unltd.org.uk"
  },
  {
    title: "Partnering form",
    path: "/contact/partnering",
    email: "digital@unltd.org.uk" // "partnering@unltd.org.uk"
  },
  {
    title: "Volunteering form",
    path: "/contact/volunteering",
    email: "digital@unltd.org.uk" // "mentoring@unltd.org.uk"
  },
  {
    title: "Press & Media form",
    path: "/contact/press-and-media",
    email: "digital@unltd.org.uk" // "press@unltd.org.uk"
  },
  {
    title: "General form",
    path: "/contact/general",
    email: "digital@unltd.org.uk" // "comms@unltd.org.uk"
  }
  ]
  
  let recipientEmail = context.env.ADMIN_EMAIL; // Default to admin email


  // Handle CORS
  if (context.request.method === "OPTIONS") {
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
    if (!context.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    if (!context.env.ADMIN_EMAIL) {
      throw new Error('ADMIN_EMAIL environment variable is not set');
    }

    // Check the Referer header
    const referer = context.request.headers.get('Referer');
    const domain = context.env.DOMAIN;
    if (!referer || !referer.startsWith(domain)) {
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid referer"
      }), { 
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // Determine the recipient email based on the referer
    for (const entry of recipient) {
      if (referer.includes(entry.path)) {
        recipientEmail = entry.email;
        break;
      }
    }

    // Parse the form data
    const formData = await context.request.formData();
    const data: { [key: string]: string } = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value as string;
    }

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
    
    // Send confirmation email to user
    const userEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: recipientEmail,
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
        'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: context.env.ADMIN_EMAIL,
        to: recipientEmail,
        subject: `New Form Submission from ${data.email}`,
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