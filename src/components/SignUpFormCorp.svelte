<script>
  import { createClient } from '@supabase/supabase-js';
  import { fade } from 'svelte/transition';
  import { onMount, onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { ClipboardListSolid } from 'svelte-awesome-icons';

  const dispatch = createEventDispatcher();

  async function getQRCode() {
    const response = await fetch(`https://sats.lnaddy.com/api/v1/qrcode/${paylinkLNURL}`);
    let data = await response.text();
    data = data.replace(/stroke="#000"/g, 'stroke="#FF9500"');
    data = data.replace(/scale\(3\)/g, 'scale(4.5)'); // Increase the scale value to increase the size
    data = data.replace(/<svg/g, '<svg viewBox="0 0 200 200"'); // Add or replace the viewbox attribute
    data = data.replace(/width="[^"]*"/g, 'width="200"');
    data = data.replace(/height="[^"]*"/g, 'height="200"');
    qrCode = data;
  }

  async function getPaylink() {
    const response = await fetch(`https://sats.lnaddy.com/lnurlp/api/v1/links/${paylinkID}`, {
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
    }
  }

  let supabase;

  export let showFormModal = false;

  onMount(async () => {
    const response = await fetch('/api/get-supabase');
    const responseBody = await response.text();
    const { supabaseUrl, supabaseKey, LNbitsAPI, corpMembershipFee } = JSON.parse(responseBody);
    LNbitsApiKey = LNbitsAPI;
    supabase = createClient(supabaseUrl, supabaseKey);

    // Create LNbits paylink
    const paylinkResponse = await fetch('https://sats.lnaddy.com/lnurlp/api/v1/links', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'X-API-KEY': LNbitsApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: 'Pleb Devs Corporate Membership',
        min: corpMembershipFee,
        max: corpMembershipFee,
        amount: corpMembershipFee,
        username: orgName,
        comment_chars: 50,
        success_text: 'Thanks for joining the PlebDev Community!',
      }),
    });

    const paylinkData = await paylinkResponse.json();
    paylinkLNURL = paylinkData.lnurl;
    paylinkID = paylinkData.id;
    lnurl = paylinkData.lnurl;
    intervalId = setInterval(getPaylink, 3000);
    await getQRCode();
  });

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
  let sponsor = false;
  let responseMessage = '';
  let showModal = false;
  let qrCode = '';
  let paylinkLNURL = '';
  let paylinkID = '';
  let hasPaid = false;
  let intervalId;
  let LNbitsApiKey = '';
  let lnurl = '';
  let tooltip = { x: 0, y: 0, show: false };

  async function handleSubmit() {
    const formData = {
      formType: 'corporate',
      org_name: orgName,
      contact_person: contactPerson,
      email,
      website,
      twitter,
      goal,
      industry,
      sponsor: sponsor ? 'yes' : 'no',
    };

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

  async function showThankYouModal() {
    showModal = true;
    await new Promise((resolve) => setTimeout(resolve, 3000));
    showModal = false;
  }

  function copyToClipboard() {
    navigator.clipboard
      .writeText(lnurl)
      .then(() => {
        console.log('Text copied to clipboard');
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  }

  function updateTooltipPosition(event) {
    tooltip = { x: event.clientX, y: event.clientY, show: true };
  }

  function hideTooltip() {
    tooltip.show = false;
  }
</script>

{#if showFormModal}
  <div class="modal" transition:fade>
    <div class="modal-content modal-background">
      <button
        class="close-button"
        on:click={() => {
          showFormModal = false;
          dispatch('modal', showFormModal);
        }}>×</button
      >
      <h1>Corporate Sign Up</h1>
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
          <label id="why-join" for="goal">Why does your company want to join Plebnet.dev?*</label>
          <textarea type="text" id="goal" bind:value={goal} required />
        </div>

        <div class="input-wrapper">
          <label for="industry">Industry*</label>
          <input type="text" id="industry" bind:value={industry} required />
        </div>

        <div class="input-wrapper">
          <label for="sponsor">Do you want to sponsor Plebnet.dev?*</label>
          <input type="checkbox" id="sponsor" bind:checked={sponsor} />
        </div>

        <div class="input-wrapper">
          <label style="font-size:1.5rem; margin-top: 2rem;" for="qrCode">Membership Dues</label>
          <p style="color: #FF9500">300,000 sats</p>
          <div class="qr-code-container no-outline">
            <div
              class="no-outline"
              style="margin:auto; padding-right: 10px; cursor: pointer;"
              id="qrCode"
              bind:innerHTML={qrCode}
              contenteditable
              on:click={copyToClipboard}
              on:keypress={copyToClipboard}
            />
          </div>
        </div>
        {#if qrCode}
          <button type="button" on:click={copyToClipboard} class="lnurl">
            <div style="display: flex; justify-content: center;">Copy LNURL<ClipboardListSolid size={14} /></div>
          </button>
        {/if}
        {#if !hasPaid}
          <h6 style="font-size: 0.75rem;">
            <i>Please complete payment before signing up. Include your email in the comment field.</i>
          </h6>
        {/if}
        <button type="submit" disabled={!hasPaid}>Submit</button>

        {#if showModal}
          <div class="modal" transition:fade>
            <div class="modal-content">
              <h2>Thank you for signing up!</h2>
              <p>Check out some community projects and find one that's right for you</p>
            </div>
          </div>
        {/if}
      </form>
    </div>
  </div>
{/if}

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
  }

  input {
    padding: 0.5rem;
    border: none;
    border-bottom: 1px solid #ccc;
    font-size: 1rem;
    background-color: transparent;
  }

  input:focus {
    outline: none;
    border-bottom-color: #ff9500;
  }

  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: white;
    color: #ff9500;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #ff9500;
    color: white;
  }

  p {
    margin-top: 1rem;
    font-weight: bold;
  }

  textarea {
    padding: 0.5rem;
    border: none;
    border-bottom: 1px solid #ccc;
    font-size: 1rem;
    background-color: transparent;
    resize: vertical;
    min-height: 80px;
    resize: none;
  }

  textarea:focus {
    outline: none;
    border-bottom-color: #ff9500;
    resize: none;
  }

  input[type='checkbox'] {
    appearance: none;
    background-color: transparent;
    width: 16px;
    height: 16px;
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
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .input-wrapper:focus-within label {
    color: #ff9500;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px; /* Add padding to the modal */
    box-sizing: border-box; /* Ensure padding is included in the modal's width and height */
  }

  .modal-content {
    position: relative;
    background-color: white;
    padding: 2rem;
    border-radius: 4px;
    text-align: center;
    box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
    min-width: 300px;
    max-width: calc(100% - 40px);
    max-height: calc(100% - 40px);
    overflow: auto;
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .modal-content h2 {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 0;
    color: #ff9500;
  }

  .modal-content p {
    font-size: 1rem;
    margin-top: 0.5rem;
    color: rgba(0, 0, 0, 0.6);
  }

  .modal-background {
    background-color: #10182b;
  }

  h1 {
    font-size: 2rem;
    font-weight: bold;
    color: #ff9500;
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

  .tooltiptext {
    position: fixed;
    width: 120px;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    z-index: 100;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .tooltiptext.show {
    opacity: 1;
  }

  .qr-code-container {
    display: flex;
    justify-content: center;
  }

  .lnurl-container {
    display: block;
  }

  .no-outline:focus {
    outline: none;
  }

  .lnurl {
    background-color: #ff9500;
    color: #10182b;
    width: 25%;
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
  }
</style>
