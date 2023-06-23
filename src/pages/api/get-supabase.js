export const prerender = false;

export async function get() {

  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.PUBLIC_SUPABASE_KEY;

  const responseBody = JSON.stringify({
    supabaseUrl,
    supabaseKey,
  });

  return {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: responseBody,
  };
}