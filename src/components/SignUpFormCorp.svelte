<script>
  import { createClient } from '@supabase/supabase-js';
  import { onMount, onDestroy } from 'svelte';
  import { ClipboardListSolid } from 'svelte-awesome-icons';
//  import { fade } from 'svelte/transition';
// import { createEventDispatcher } from 'svelte';
//  const dispatch = createEventDispatcher();
//  export let showFormModal = false;
  import PaymentModal from './PaymentModal.svelte';
  // import { API_KEY } from './env';


  // let showPaymentModal = false;
  // let key = import.meta.env.VITE_API_KEY;
  let paymentLink = '';
  let invoice = '';
  let formData = {};
  let supabase;

  async function getPaymentLink() {
      try {
        const response = await fetch('https://testnet.plebnet.dev/satspay/api/v1/charge', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Api-Key': key,
            },
            body: JSON.stringify({
              "lnbitswallet": lnbitswallet,
              "amount": 10,
              "time": 10,
              "description": "Lightning Invoice",
            })
        });

        if (response.ok) {
            invoice = await response.json(); // Parse the response data if it's in JSON
            console.log('GET request successful:', invoice);
            paymentLink = "https://testnet.plebnet.dev/satspay/" + invoice.id;
        } else {
            console.error('GET request failed:', response.status, response.statusText);
        } 
      } catch (error) {
        console.error('An error occurred:', error);
        paymentLink = "https://testnet.plebnet.dev/"; // Replace with the actual payment link
      }
    }

  // async function getQRCode() {
  //   const response = await fetch(`${baseLNbitsURL}/api/v1/qrcode/${paylinkLNURL}`);
  //   let data = await response.text();
  //   data = data.replace(/stroke="#000"/g, 'stroke="#FF9500"');
  //   data = data.replace(/scale\(3\)/g, 'scale(4.5)'); // Increase the scale value to increase the size
  //   data = data.replace(/<svg/g, '<svg viewBox="0 0 200 200"'); // Add or replace the viewbox attribute
  //   data = data.replace(/width="[^"]*"/g, 'width="200"');
  //   data = data.replace(/height="[^"]*"/g, 'height="200"');
  //   qrCode = data;
  // }

  // async function getPaylink() {
  //   const response = await fetch(`${baseLNbitsURL}/lnurlp/api/v1/links/${paylinkID}`, {
  //     method: 'GET',
  //     headers: {
  //       accept: 'application/json',
  //       'X-API-KEY': LNbitsApiKey,
  //     },
  //   });

  //   const data = await response.json();
  //   if (data.served_pr > 0) {
  //     hasPaid = true;
  //     clearInterval(intervalId); // Stop checking
  //     updatePaylink();
  //   }
  // }
 
  // async function updatePaylink() {
  //   const response = await fetch(`${baseLNbitsURL}/lnurlp/api/v1/links/${paylinkID}`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       accept: 'application/json',
  //       'X-API-KEY': LNbitsXAPIKey,
  //     },
  //     body: JSON.stringify({
  //       description: `${orgName} has paid (Corp Membership)`,
  //       min: fee,
  //       max: fee,
  //       amount: fee,
  //       comment_chars: 50,
  //       success_text: 'Thanks for joining the PlebDev Community!',
  //     }),
  //   });
  //   const test = await response.json();
  //   console.log(test);
  // }

  onMount(async () => {
      const response = await fetch('/api/get-env');
      const responseBody = await response.text();
      const { baseURL, supabaseUrl, supabaseKey, LNbitsAPI, LNbitsXAPI, corpMembershipFee, API_KEY, lnbitsxwallet } = JSON.parse(responseBody);
      LNbitsXAPIKey = LNbitsXAPI;
      fee = corpMembershipFee;
      LNbitsApiKey = LNbitsAPI;
      baseLNbitsURL = baseURL;
      key = API_KEY;
      lnbitswallet = lnbitsxwallet;

      // supabase = createClient(supabaseUrl, supabaseKey);
      await getPaymentLink();
    });
  // onMount(async () => {
  //   const response = await fetch('/api/get-env');
  //   const responseBody = await response.text();
  //   const { baseURL, supabaseUrl, supabaseKey, LNbitsAPI, LNbitsXAPI, corpMembershipFee } = JSON.parse(responseBody);
  //   LNbitsXAPIKey = LNbitsXAPI;
  //   fee = corpMembershipFee;
  //   LNbitsApiKey = LNbitsAPI;
  //   baseLNbitsURL = baseURL;
  //   // supabase = createClient(supabaseUrl, supabaseKey);

  //   const paylinkResponse = await fetch('/api/get-paylink', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ corporate: true }),
  //   });

  //   const paylinkData = await paylinkResponse.json();
  //   paylinkLNURL = paylinkData.lnurl;
  //   paylinkID = paylinkData.id;
  //   lnurl = paylinkData.lnurl;
  //   intervalId = setInterval(getPaylink, 3000);
  //   await getQRCode();
  // });

  onDestroy(() => {
    // Clear the interval when the component is destroyed
    clearInterval(intervalId);
  });

  let orgName = '';
  let contactPerson = '';
  let email = '';
  let website = '';
  let twitter = '';
  let goal = '';
  let industry = '';
  let responseMessage = '';
  let showModal = false;
  let qrCode = '';
  let paylinkLNURL = '';
  let paylinkID = '';
  let hasPaid = false;
  let intervalId;
  let LNbitsApiKey = '';
  let lnurl = '';
  let baseLNbitsURL = '';
  let LNbitsXAPIKey = '';
//  let tooltip = { x: 0, y: 0, show: false };
  let fee = 0;
  let discordHandle = '';
  let key = '';
  let lnbitswallet = '';

  async function handleSubmit() {
    const formData = {
      formType: 'corporate',
      org_name: orgName,
      contact_person: contactPerson,
      discord_username: discordHandle,
      email,
      website,
      twitter,
      goal,
      industry,
    };
    showPaymentModal = true;
    const { data, error } = await supabase.from('members-corporate').insert([formData]);

    if (error) {
      responseMessage = `Error submitting form: ${error.message}`;
    } else {
      // Call the API component to send an email
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        responseMessage = 'Form submitted successfully';
        await showThankYouModal();
        window.location.href = '/projects';
      } else {
        responseMessage = `Error sending email: ${response.statusText}`;
      }
    }
  }

  // function formatNumberWithCommas(number) {
  //   return Number(number).toLocaleString();
  // }

  async function showThankYouModal() {
    showModal = true;
    await new Promise((resolve) => setTimeout(resolve, 3000));
    showModal = false;
  }

  function redirectToInvoice() {
    window.location.href = paymentLink;
  }
</script>

<div>
  <div>
      <h1>Corporate Membership</h1>
      <form on:submit|preventDefault={handleSubmit}>
        <div class="input-wrapper">
          <label for="orgName">Organization Name*</label>
          <input type="text" id="orgName" bind:value={orgName} required />
        </div>

        <div class="input-wrapper">
          <label for="contactPerson">Contact Person*</label>
          <input type="text" id="contactPerson" bind:value={contactPerson} required />
        </div>

        <div class="input-wrapper">
          <label for="discordHandle">Discord Handle*</label>
          <input type="text" id="discordHandle" bind:value={discordHandle} required />
        </div>

        <div class="input-wrapper">
          <label for="email">Email*</label>
          <input type="email" id="email" bind:value={email} />
        </div>

        <div class="input-wrapper">
          <label for="website">Website*</label>
          <input type="text" id="website" bind:value={website} required />
        </div>

        <div class="input-wrapper">
          <label for="twitter">Twitter/LinkedIn</label>
          <input type="text" id="twitter" bind:value={twitter} />
        </div>

        <div class="input-wrapper">
          <label for="industry">Industry*</label>
          <input type="text" id="industry" bind:value={industry} required />
        </div>

        <div class="input-wrapper">
          <label id="why-join" for="goal">Any comments for us?*</label>
          <textarea type="text" id="goal" bind:value={goal} required />
        </div>
      
        <!-- <div>
          <iframe class="iframe" src={paymentLink} allow="clipboard-read; clipboard-write;" title="Lightning Invoice" frameborder="0" style="width: 100%; height: 500px;"></iframe>
        </div> -->

        <button type="submit" on:click={redirectToInvoice}>Submit</button>
        <!-- <div>
            <PaymentModal showPaymentModal={showPaymentModal} formData={formData}/>
        </div> -->
      </form>
    </div>
  </div>

<style>
  form {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    margin: 0 auto;
    padding: 1rem;
  }

  label {
    font-weight: bold;
    margin-top: 1rem;
    margin-bottom: 0.2rem;
  }

  input {
    border-radius: 8px;
    padding: 0.5rem;
    border: 1px solid #555;
    font-size: 1rem;
    background-color: transparent;
  }

  input:focus {
    outline: none;
    border-color: #fff;
  }

  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #1F40AE;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s;
    align-items: center;
    justify-content: center;
  }

  button:hover {
    background-color: #fff;
    color: #1F40AE;
  }

  p {
    margin-top: 1rem;
    font-weight: bold;
  }

  textarea {
    border-radius: 8px;
    padding: 0.5rem;
    border: none;
    border: 1px solid #555;
    font-size: 1rem;
    background-color: transparent;
    resize: vertical;
    min-height: 150px;
    resize: none;
  }

  textarea:focus {
    outline: none;
    border-color: #fff;
    resize: none;
  }

  .input-wrapper {
    /* position: relative; */
    display: flex;
    flex-direction: column;
  }

  .input-wrapper:focus-within label {
    color: #fff;
  }

  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-top: 0;
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    .close-button {
      top: -15px;
      right: 5px;
    }
  }

  @media (min-width: 535px) {
    #why-join {
      white-space: nowrap;
    }
  }

  h6 {
    color: #ff9500;
  }

  .qr-code-container {
    display: flex;
    justify-content: center;
  }

  .no-outline:focus {
    outline: none;
  }

  .lnurl {
    background-color: #ff9500;
    color: #10182b;
    /* width: 25%; */
    padding-left: 0.5;
    padding-right: 0.5;
    font-size: 0.75rem;
    justify-content: center;
    margin: auto;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .lnurl:hover {
    color: #10182b;
    background-color: #fff;
  }
</style>
