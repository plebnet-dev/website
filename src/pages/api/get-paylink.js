// export const prerender = false;

// export async function POST({request}) {

//   function getHumanReadableDate() {
//     const currentDate = new Date(Date.now());
//     return currentDate.toLocaleString();
//   }
//   const membershipType = await request.json();
//   console.log('membershipType in get-paylink: \n', membershipType)
//   let fee;
//   let description;

//   if (!membershipType.corporate) {
//     fee = process.env.PUBLIC_LNBITS_INDIV_FEE;
//     description = `PLEBNET.DEV Individual Membership ${getHumanReadableDate()}`;
//   } else {
//     fee = process.env.PUBLIC_LNBITS_CORP_FEE
//     description = `PLEBNET.DEV Corporate Membership ${getHumanReadableDate()}`;
//   }

//   const paylinkResponse = await fetch(`${process.env.PUBLIC_LNBITS_URL}/lnurlp/api/v1/links`, {
//     method: 'POST',
//     headers: {
//       accept: 'application/json',
//       'X-API-KEY': process.env.PUBLIC_LNBITS_X_API_KEY,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       description: description,
//       min: fee,
//       max: fee,
//       amount: fee,
//       comment_chars: 50,
//       success_text: 'Thanks for joining the Plebnet.dev Community!',
//     }),
//   });

//   const data = await paylinkResponse.json()
//   // console.log(data)
//   const responseBody = JSON.stringify(data);


//   return new Response(responseBody, {
//     status: 200,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
// }

