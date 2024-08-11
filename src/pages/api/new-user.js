export const prerender = false;
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

let supabaseUrl =  import.meta.env.SUPABASE_URL || "none"
let supabaseKey = import.meta.env.SUPABASE_KEY || "none"
let indivFee = import.meta.env.PUBLIC_INDIV_FEE 
let corpFee = import.meta.env.PUBLIC_CORP_FEE 

let supabase = createClient(supabaseUrl, supabaseKey);

const indiv_table = 'members-test-table'
const corp_table = 'members-corp-test'

let amount = '100'
let description = 'plebnet_membership'
let invoicelink = supabaseUrl

export async function POST({request}) {
    try {
        const formData = await request.json();
        // console.log('formData: \n', formData)
        const { formType, ...otherData } = formData;

        // create paylink with customized url
        let forwardlink = ''
        if (formType === "individual") {
            amount = indivFee
            description = 'plebnet_individual'
            invoicelink = supabaseUrl +'/functions/v1/zbd-receive?amount=' + amount + '&description=' + description
        } else if (formType === "corporate") { 
            amount = corpFee
            description = 'plebnet_corporate'
            invoicelink = supabaseUrl +'/functions/v1/zbd-receive?amount=' + amount + '&description=' + description
        }
        console.log("invoicelink: \n", invoicelink)

        // Fetch the invoice data
        const invoiceResponse = await fetch(invoicelink);
        console.log('invoiceResponse: \n', invoiceResponse)
        const invoiceData = await invoiceResponse.json();
        console.log('invoiceData: \n', invoiceData)

        // Extract the "request" field from the invoice data
        const invoiceRequest = invoiceData.data.invoice.request;
        console.log('invoiceRequest: \n', invoiceRequest)

        let paymentId = invoiceData.data.id
        console.log("paymentID: \n", paymentId)

        const newData = { ...formData, payment_id: paymentId, payment_status: false};
        console.log('newData: \n', newData)

        // Insert the new data into the Supabase table
        if (formType === "individual") {
            await supabase.from(indiv_table).insert([newData]).select();
        } else { 
            await supabase.from(corp_table).insert([newData]).select();
        }

        // Respond with the invoice request
        return new Response(JSON.stringify({ invoiceRequest }), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({ 'error': error }), {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        });
    }
}
