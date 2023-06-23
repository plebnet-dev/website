export async function get() {
  console.log('Environment Variables:', process.env);

  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.PUBLIC_SUPABASE_KEY;

  const responseBody = JSON.stringify({
    supabaseUrl,
    supabaseKey,
  });

  console.log('Response Body:', responseBody);

  return {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: responseBody,
  };
}