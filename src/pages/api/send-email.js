export const prerender = false;

import sgMail from '@sendgrid/mail';

const sendgridApiKey = process.env.PUBLIC_SENDGRID_API_KEY;
const corporateTemplate = process.env.PUBLIC_SENDGRID_TEMPLATE_ID_CORP
const individualTemplate = process.env.PUBLIC_SENDGRID_TEMPLATE_ID_INDIV
sgMail.setApiKey(sendgridApiKey);

export async function post({request}) {

  const formData = await request.json();
  const { formType, ...otherData } = formData;

  const msg = {
    to: otherData.email,
    cc: 'info@plebnet.dev',
    from: 'join@plebnet.dev',
    templateId:
    formType === 'corporate'
      ? corporateTemplate //corp
      : individualTemplate, //indiv
  };

  if (formType === 'corporate') {
    msg.dynamic_template_data = {
      orgName: otherData.org_name,
      contact: otherData.contact_person,
      email: otherData.email,
      website: otherData.website,
      twitter: otherData.twitter,
      goal: otherData.goal,
      industry: otherData.industry,
    };
  } else {
    msg.dynamic_template_data = {
      name: otherData.name,
      email: otherData.email,
      twitter: otherData.twitter,
      github: otherData.github,
      experience: otherData.experience,
      goal: otherData.goal,
      mentor: otherData.mentor,
    };
  }

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