export const prerender = false;
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

let supabaseUrl =  import.meta.env.SUPABASE_URL || "none"
let supabaseKey = import.meta.env.SUPABASE_KEY || "none"
let paylinkurl = import.meta.env.PAYLINK_URL || "none"
let indivFee = import.meta.env.PUBLIC_INDIV_FEE 
let corpFee = import.meta.env.PUBLIC_CORP_FEE 

let supabase = createClient(supabaseUrl, supabaseKey);

// console.log('supabaseUrl: \n', supabaseUrl)
// console.log('supabaseKey: \n', supabaseKey)
// console.log('paylinkurl: \n', paylinkurl)

const indiv_table = 'members-test-table'
const corp_table = 'members-corp-test'


export async function POST({request}) {
    try {
        const formData = await request.json();
        // console.log('formData: \n', formData)
        const { formType, ...otherData } = formData;

        // Generate a unique identifier
        const uniqueId = uuidv4();
        // console.log("unique id",  uniqueId);

        // create paylink with customized url
        let forwardlink = ''
        if (formType === "individual") {
            forwardlink = paylinkurl + '/fee/' + indivFee  + '?desc=' + uniqueId
        } else if (formType === "corporate") { 
            forwardlink = paylinkurl + '/fee/' + corpFee  + '?desc=' + uniqueId
        }
        // console.log("forwardlink: \n", forwardlink)

        const newData = { ...formData, payment_id: uniqueId, payment_status: false};
        // console.log('newData: \n', newData)

        // // push formData to supabase database
        if (formType === "individual") {
            const { data, error } = await supabase.from(indiv_table).insert([newData]).select();
            // console.log('individual member - supabase data: \n', data)
            // console.log('supabase error: \n', error)
        } else { 
            const { data, error } = await supabase.from(corp_table).insert([newData]).select();
            // console.log('corporate member - supabase data: \n', data)
            // console.log('supabase error: \n', error)
        }

        // create paylink json and respond to client request
        let response_json = {'url': forwardlink}
       // console.log('response_json: \n', response_json)

        return new Response(JSON.stringify(response_json), {
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
