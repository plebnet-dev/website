export const prerender = false;
import { createClient } from '@supabase/supabase-js';

/* Sample JSON data pushed to this webhook
//////////////////// LNBits 0.9.x ///////////////////

{'id': 'hc6TRomtZrSBmUBB99kqoC', 'description': 'Meeting', 'onchainaddress': None, 
'payment_request': 'lnbc23190n1pj6ynf2pp5rzdlz5xn5n3vat7esfca7xu93f98svjwwqf8ue7lfcftc58lszhsdqvf4jk2arfdenscqzzsxqrrsssp59ule4mndfynnjg2e380vcfeh3f7t9m4f080g0qj8c7yrt4f6k7rq9qyyssqv2lrpef5fenrzagzurgd7wtr4t0snkedda7lzvpfqeuv6tdcfkz3qskt708nqx8x7uhr7lp8q8lja3yfpwm0dgj3jnz7tvfaptaemysqqsnctg',
'payment_hash': '189bf150d3a4e2ceafd98271df1b858a4a78324e70127e67df4e12bc50ff80af', 
'time': 1440, 'amount': 2319, 'balance': 2319, 'paid': True, 'timestamp': 1705135403,
'time_elapsed': False, 'time_left': 1439.5795083324115, 'custom_css': '', 
'completelink': 'https://satspaylink.vercel.app/thanks', 'completelinktext': 'Back to Site'}

/////////////////////////////////////////////////////
*/

let supabaseUrl =  import.meta.env.SUPABASE_URL || "none"
let supabaseKey = import.meta.env.SUPABASE_KEY || "none"
let indivFee = import.meta.env.PUBLIC_INDIV_FEE || 111
let corpFee =  import.meta.env.PUBLIC_CORP_FEE || 333

let supabase = createClient(supabaseUrl, supabaseKey);

// console.log('supabaseUrl: \n', supabaseUrl)
// console.log('supabaseKey: \n', supabaseKey)
// console.log('indivFee: \n', indivFee)
// console.log('corpFee: \n', corpFee)

const indiv_table = 'members-test-table'
const corp_table = 'members-corp-test'

// receiving webhook from LNBits paylink 
export async function POST({request}) {
    try {
        const hookdata = await request.json();
        // console.log('webhook data: \n', hookdata)
        const payment_id = hookdata.id
        const uniqueid = hookdata.description
        const amt = hookdata.amount
        console.log('payment_id: ', payment_id)
        console.log('uniqueid: ', uniqueid)
        console.log('amt: ', amt)

        // update payment_id based on description (name)
        // selected database table based off offee amount (indiv or corp)

        let tabletype = ''
        // perform loose equality of fees to determin what type of table to use
        if (amt == indivFee) {
            // console.log("handle individual webhook data")
            tabletype = indiv_table
        } else if (amt == corpFee) {
            // console.log("handle corporate webhook data")
            tabletype = corp_table
        }

        // upsert transaction id
        console.log("tabletype: \n", tabletype)
        if (tabletype == '') { throw  new Error("no tabletype, check amount matching");}

        // update payment status
        const { payupdate, errpay } = await supabase
        .from(tabletype)
        .update({ payment_status: true })
        .eq('payment_id', payment_id)
        .select()

        // get row entry data 
        const { data, err } = await supabase
        .from(tabletype)
        .select()
        .eq('payment_id', payment_id)

        console.log('data: ', data)
        console.log('err: ', err)
        console.log('pay status: ', payupdate)
        console.log('errpay: ', errpay)

        if (data) {
            // reformat selected data and 
            // push data to email api endpoint 
            let formData = ''    
            if (tabletype === indiv_table) {
                formData = {
                    formType: 'individual',
                    name: data[0].name,
                    discord_username: data[0].discord_username,
                    email: data[0].email,
                    twitter: data[0].twitter,
                    github: data[0].github,
                    experience: data[0].experience,
                    goal: data[0].goal,
                    mentor: data[0].mentor,
                  };
            } else if (tabletype === corp_table) {
                formData = {
                    formType: 'corporate',
                    org_name: data[0].org_name,
                    contact_person: data[0].contact_person,
                    discord_username: data[0].discord_username,
                    email: data[0].email,
                    website: data[0].website,
                    twitter: data[0].twitter,
                    goal: data[0].goal,
                    industry: data[0].industry,
                };
            }

            // console.log('formData: \n', formData)
            // push form data to email api endpoint

            // const response = await fetch('/api/send-email', {
            //     method: 'POST',
            //     headers: {
            //       'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(formData),
            //   });

            // if (response.ok) {
            //     console.log("response is ok")
            //     let response_link = {'status': "ok"}
            //     return new Response(JSON.stringify(response_link), {
            //         status: 200,
            //         headers: {
            //             "Content-Type": "application/json"
            //         }
            //     });
            // } 

        } else if (err) { 
            console.log("Error getting table data is null" , err)
        }

        // temp response for testing
        let resp= {'ok': 'ok'}
        return new Response(JSON.stringify(resp), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
        // temp response for testing

    } catch (error) {
        console.log('webhook error: \n', error)
        return new Response(JSON.stringify({ 'error': error }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}