export const prerender = false;

// import { Response } from 'astro/runtime';

export async function get() {

  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.PUBLIC_SUPABASE_KEY;
  const LNbitsAPI = process.env.PUBLIC_LNBITS_API_KEY;

  const responseBody = JSON.stringify({
    supabaseUrl,
    supabaseKey,
    LNbitsAPI,
  });

  return new Response(responseBody, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}