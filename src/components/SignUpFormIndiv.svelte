<script>
  import { createClient } from '@supabase/supabase-js';
  import { onMount, onDestroy } from 'svelte';
  import { ClipboardListSolid } from 'svelte-awesome-icons';

  import PaymentModal from './PaymentModal.svelte';

  // import { createEventDispatcher } from 'svelte';
  // import { fade } from 'svelte/transition';

  //  const dispatch = createEventDispatcher();
  //  export let showFormModal = true;

  let supabase;
  let showPaymentModal = false;
  let formData = {};

  async function getQRCode() {
    const response = await fetch(`${baseLNbitsURL}/api/v1/qrcode/${paylinkLNURL}`);
    let data = await response.text();
    data = data.replace(/stroke="#000"/g, 'stroke="#FF9500"');
    data = data.replace(/scale\(3\)/g, 'scale(4.5)'); // Increase the scale value to increase the size
    data = data.replace(/<svg/g, '<svg viewBox="0 0 200 200"'); // Add or replace the viewbox attribute
    data = data.replace(/width="[^"]*"/g, 'width="200"');
    data = data.replace(/height="[^"]*"/g, 'height="200"');
    qrCode = data;
  }

  async function getPaylink() {
    const response = await fetch(`${baseLNbitsURL}/lnurlp/api/v1/links/${paylinkID}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-API-KEY': LNbitsApiKey,
      },
    });

    const data = await response.json();
    if (data.served_pr > 0) {
      hasPaid = true;
      clearInterval(intervalId); // Stop checking
      updatePaylink();
    }
  }

  async function updatePaylink() {
    const response = await fetch(`${baseLNbitsURL}/lnurlp/api/v1/links/${paylinkID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'X-API-KEY': LNbitsXAPIKey,
      },
      body: JSON.stringify({
        description: `${name} has paid (Individual Membership)`,
        min: fee,
        max: fee,
        amount: fee,
        comment_chars: 50,
        success_text: 'Thanks for joining the Plebnet.Dev Community!',
      }),
    });
    const test = await response.json();
    console.log("inside update paylink")
    console.log(test);
  }

  onMount(async () => {
    const response = await fetch('/api/get-env');
    const responseBody = await response.text();
    const { baseURL, supabaseUrl, supabaseKey, LNbitsAPI, LNbitsXAPI, indivMembershipFee } = JSON.parse(responseBody);
    LNbitsApiKey = LNbitsAPI;
    LNbitsXAPIKey = LNbitsXAPI;
    baseLNbitsURL = baseURL;
    fee = indivMembershipFee;
    supabase = createClient(supabaseUrl, supabaseKey);

    const paylinkResponse = await fetch('/api/get-paylink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ corporate: false }),
    });
    const paylinkData = await paylinkResponse.json();
    paylinkLNURL = paylinkData.lnurl;
    paylinkID = paylinkData.id;
    lnurl = paylinkData.lnurl;
    await getQRCode();
    intervalId = setInterval(getPaylink, 10000);
  });

  onDestroy(() => {
    // Clear the interval when the component is destroyed
    clearInterval(intervalId);
  });

  let name = '';
  let email = '';
  let twitter = '';
  let github = '';
  let experience = '';
  let goal = '';
  let mentor = false;
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

  async function handleSubmit() {
    formData = {
      formType: 'individual',
      name,
      discord_username: discordHandle,
      email,
      twitter,
      github,
      experience,
      goal,
      mentor: mentor ? 'yes' : 'no',
    };
    responseMessage = 'Form submitted successfully';
        showPaymentModal = true; // Show the modal
        await showPaymentModal();

    setTimeout(() => {
      showPaymentModal = false;
    }, 1);

    // console.log(formData)
    // if (showPaymentModal) {
    //     responseMessage = 'Form submitted successfully';
    //     showPaymentModal = true; // Show the modal
    //     await showPaymentModal();
    //     window.location.href = '/thankyou';
    //   } else {
    //     responseMessage = `Error sending email: ${response.statusText}`;
    //   }
    // const { data, error } = await supabase.from('members-individual').insert([formData]);

    // if (error) {
    //   responseMessage = `Error submitting form: ${error.message}`;
    // } else {
    //   console.log("sending email message to admins")
    //   // Call the API component to send an email
    //   const response = await fetch('/api/send-email', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData),
    //   });

    //   if (response.ok) {
    //     responseMessage = 'Form submitted successfully';
    //     await showThankYouModal();
    //     window.location.href = '/thankyou';
    //   } else {
    //     responseMessage = `Error sending email: ${response.statusText}`;
    //   }
    // }
  }

  function formatNumberWithCommas(number) {
    return Number(number).toLocaleString();
  }

  async function showThankYouModal() {
    showModal = true;
    await new Promise((resolve) => setTimeout(resolve, 3000));
    showModal = false;
  }

  function copyToClipboard() {
    navigator.clipboard
      .writeText(lnurl)
      .then(() => {
        console.log('copied');
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  }

  function openModal() {
    showPaymentModal = true;
  }

  function closeModal() {
    showPaymentModal = false;
  }
</script>

<div>
  <div>
      <h1>Individual Membership</h1>
      <form on:submit|preventDefault={handleSubmit}>
        <div class="input-wrapper">
          <label for="name">Name*</label>
          <input type="text" id="name" bind:value={name} required />
        </div>

        <div class="input-wrapper">
          <label for="discordHandle">Discord Handle*</label>
          <input type="text" id="discordHandle" bind:value={discordHandle}  />
        </div>

        <div class="input-wrapper">
          <label for="email">Email*</label>
          <input type="email" id="email" bind:value={email}  />
        </div>
        <div class="input-wrapper">
          <label for="twitter">Twitter or Nostr npub</label>
          <input type="text" id="twitter" bind:value={twitter} />
        </div>

        <div class="input-wrapper">
          <label for="github">GitHub or GitLab*</label>
          <input type="text" id="github" bind:value={github}  />
        </div>

        <div class="input-wrapper">
          <label for="experience">Experience*</label>
          <textarea type="text" id="experience" bind:value={experience}  />
        </div>

        <div class="input-wrapper">
          <label for="goal">What do you want to get out of plebnet.dev?*</label>
          <textarea type="text" id="goal" bind:value={goal}  />
        </div>

        <div class="input-wrapper">
          <label for="mentor" style="margin-top:2.5rem;">Do you want to mentor?</label>
          <input type="checkbox" id="mentor" bind:checked={mentor} />
        </div>
        <div class="input-wrapper">
          <label style="font-size:1.5rem; margin-top: 2rem;" class="text-center" for="qrCode">Membership Dues</label>
          <p style="color: #FF9500" class="text-center">{`${formatNumberWithCommas(fee)} sats`}</p>
          <div
            class="no-outline text-center"
            style="margin:auto; padding-right: 10px; cursor: pointer;"
            id="qrCode"
            bind:innerHTML={qrCode}
            contenteditable
            on:keypress={copyToClipboard}
            on:click={copyToClipboard}
          />
        </div>
        {#if !qrCode}
          <h4>We're experiencing a problem with our Lightning Server. Please try to register later.</h4>
        {/if}
        {#if qrCode}
          <button type="button" on:click={copyToClipboard} class="lnurl">
            <div style="display: flex; justify-content: center;">Copy LNURL<ClipboardListSolid size={14} /></div>
          </button>
        {/if}
        {#if !hasPaid}
          <h6 style="font-size: 0.75rem;">
            <i>Please complete payment first, then submit will be enabled. Include your email in the comment field.</i>
          </h6>
        {/if}
        
        <button type="submit">Submit</button>

       {#if showPaymentModal}
        <div>
          <PaymentModal {showPaymentModal} {formData}/>
          <!-- <h2>Thank you for signing up!</h2> -->
        </div>
        {/if}
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

  input[type='checkbox'] {
    appearance: none;
    background-color: transparent;
    width: 20px;
    height: 20px;
    border: 1px solid #ccc;
    border-radius: 2px;
    cursor: pointer;
    margin-right: 0rem;
    margin-left: auto;
    vertical-align: middle;
    position: relative;
    top: -18px;
  }

  input[type='checkbox']:checked {
    background-color: #ff9500;
    border-color: #ff9500;
  }

  input[type='checkbox']:checked::before {
    content: '';
    display: block;
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg) translateY(-50%);
    position: absolute;
    bottom: 2px;
    left: 2px;
  }

  .input-wrapper {
    /* position: relative;*/
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

  h6 {
    color: #ff9500;
  }

  #qrCode {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .no-outline:focus {
    outline: none;
  }

  .lnurl {
    background-color: #ff9500;
    color: #10182b;
    width: 8rem;
    padding-left: 0;
    padding-right: 0;
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
