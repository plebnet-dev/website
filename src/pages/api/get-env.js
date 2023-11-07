export const prerender = false;

// import { Response } from 'astro/runtime';

export async function GET() {

  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.PUBLIC_SUPABASE_KEY;
  const LNbitsAPI = process.env.PUBLIC_LNBITS_API_KEY;
  const LNbitsXAPI = process.env.PUBLIC_LNBITS_X_API_KEY;
  const indivMembershipFee = process.env.PUBLIC_LNBITS_INDIV_FEE
  const corpMembershipFee = process.env.PUBLIC_LNBITS_CORP_FEE
  const baseURL = process.env.PUBLIC_LNBITS_URL;
  const API_KEY = process.env.PUBLIC_API_KEY;
  const lnbitsxwallet = process.env.PUBLIC_lnbitswallet;

  const responseBody = JSON.stringify({
    supabaseUrl,
    supabaseKey,
    LNbitsAPI,
    LNbitsXAPI,
    baseURL,
    indivMembershipFee,
    corpMembershipFee,
    API_KEY,
    lnbitsxwallet,
  });

  return new Response(responseBody, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}