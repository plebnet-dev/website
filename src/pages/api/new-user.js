export const prerender = false;
import { createClient } from '@supabase/supabase-js';
import { getLightningInvoice } from './get_invoice';
// import fetch from 'node-fetch';

let supabaseUrl =  import.meta.env.SUPABASE_URL || "none"
let supabaseKey = import.meta.env.SUPABASE_KEY || "none"
let indivFee = import.meta.env.PUBLIC_INDIV_FEE || '100000'
let corpFee = import.meta.env.PUBLIC_CORP_FEE || '300000'

let supabase = createClient(supabaseUrl, supabaseKey);

const indiv_table = 'members-test-table'
const corp_table = 'members-corp-test'

// Default amount is now set from environment variables

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

export async function POST({request}) {
    try {
        const formData = await request.json();
        // console.log('formData: \n', formData)
        const { formType, ...otherData } = formData;

        if (formType === "individual") {
            amount = indivFee
        } else {
            amount = corpFee
        } 

        let paymentId =  generateUUID(); //invoiceData.data.id
        console.log("paymentID: \n", paymentId)

        const newData = { ...formData, payment_id: paymentId, payment_status: false};
        console.log('newData: \n', newData)

        // Insert the new data into the Supabase table
        if (formType === "individual") {
            await supabase.from(indiv_table).insert([newData]).select();
        } else { 
            await supabase.from(corp_table).insert([newData]).select();
        }

        const lightningAddress = 'soc@plebnet.dev';
        let invoice = await getLightningInvoice(lightningAddress, amount)
        console.log("invoice: \n", invoice)

        return new Response(JSON.stringify({ invoice }), {
          status: 200,
          headers: {
              "Content-Type": "application/json"
          }
        });

    } catch (error) {
        console.error('Error in POST /new-user:', error); // Log the error details on the server
        return new Response(JSON.stringify({ 'error': 'An internal server error occurred' }), {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        });
    }
}
