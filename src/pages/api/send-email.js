import sgMail from '@sendgrid/mail';

const sendgridApiKey = '';
sgMail.setApiKey(sendgridApiKey);

export async function post({request}) {

  const formData = await request.json()
  const { email, name, twitter, github, experience, goal, prLink, mentor } = formData;

  const msg = {
    to: email,
    cc: 'eriknewland93@gmail.com', // CC is required, not sure who it should be
    from: 'join@plebnet.dev',
    templateId: '',
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