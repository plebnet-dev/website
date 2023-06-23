export async function get() {
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.PUBLIC_SUPABASE_KEY;

  return {
    status: 200,
    body: {
      supabaseUrl,
      supabaseKey,
    },
  };
}