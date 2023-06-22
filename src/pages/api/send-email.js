import sgMail from '@sendgrid/mail';

const sendgridApiKey = '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';
sgMail.setApiKey(sendgridApiKey);

export async function post({request}) {

  const formData = await request.json()
  const { email, name, twitter, github, experience, goal, prLink, mentor } = formData;

  const msg = {
    to: email,
    cc: 'eriknewland93@gmail.com', // CC is required, not sure who it should be
    from: 'join@plebnet.dev',
    templateId: 'd-8fa74dff03b14b2ea3f061fd61a33ab5',
    dynamic_template_data: {
      name,
      email,
      twitter,
      github,
      experience,
      goal,
      prLink,
      mentor,
    },
  };

  try {
    await sgMail.send(msg);
    return new Response(JSON.stringify(request.body), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error('SendGrid error:', error.response.body);
    return new Response(JSON.stringify({ error: 'Error sending email' }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}