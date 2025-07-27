export const prerender = false;
import fetch from 'node-fetch';

let supabaseUrl =  import.meta.env.SUPABASE_URL || "none"

export async function POST({request}) {
    try {
        const formData = await request.json();
        // console.log('formData: \n', formData)
        const { amount, description } = formData;
        let invoicelink = supabaseUrl +'/functions/v1/zbd-receive?amount=' + amount + '&description=' + description

        // Fetch the invoice data
        const invoiceResponse = await fetch(invoicelink);
        // console.log('invoiceResponse: \n', invoiceResponse)
        const invoiceData = await invoiceResponse.json();
        // console.log('invoiceData: \n', invoiceData)

        // Extract the "request" field from the invoice data
        const invoiceRequest = invoiceData.data.invoice.request;
        // console.log('invoiceRequest: \n', invoiceRequest)
        
        // Respond with the invoice request
        return new Response(JSON.stringify({ invoiceRequest }), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
        

    } catch (error) {
        console.error("An error occurred:", error); // Log the detailed error on the server
        return new Response(JSON.stringify({ 'error': "An internal server error occurred" }), {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        });
    }
}