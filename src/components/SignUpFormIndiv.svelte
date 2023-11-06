<script>
  import { createClient } from '@supabase/supabase-js';
  import { onMount, onDestroy } from 'svelte';
  import { ClipboardListSolid } from 'svelte-awesome-icons';

  import PaymentModal from './PaymentModal.svelte';

  let supabase;
  let paymentLink = '';
  let invoice = '';
  let formData = {};

  async function getPaymentLink() {
      try {
        const response = await fetch('https://testnet.plebnet.dev/satspay/api/v1/charge', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Api-Key': API_KEY,
            },
            body: JSON.stringify({
              "id": "6f900155ce2748c7bbcbc9f347da4906",
              "amount": 10,
              "time": 10,
              "description": "Lightning Invoice",
              // "expires_at": "2023-10-12T21:15:05Z",
              // "payreq": "lnbc100110n1p0x752vv86304402952522256949n335fuv3t56cqj7q7g7y9atgup965n33x99c6sr9qypqxe6uxqd3exxv64454675p7ch95p928q9q9qsqq9q9sqq9q9sqq9q9sqq9q9s752vv86304402952522256949n335fuv3t56cqj7q7g7y9atgup965n33x99c6sr9qypqxe6uxqd3exxv64454675p7ch95p928q9q9qsqq9q9sqq9q9sqq9q9sqq9q9s",
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

    onMount(async () => {
      const response = await fetch('/api/get-env');
      const responseBody = await response.text();
      const { baseURL, supabaseUrl, supabaseKey, LNbitsAPI, LNbitsXAPI, corpMembershipFee } = JSON.parse(responseBody);
      LNbitsXAPIKey = LNbitsXAPI;
      fee = corpMembershipFee;
      LNbitsApiKey = LNbitsAPI;
      baseLNbitsURL = baseURL;
      // supabase = createClient(supabaseUrl, supabaseKey);
      await getPaymentLink();
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

    const { data, error } = await supabase.from('members-individual').insert([formData]);

    if (error) {
      responseMessage = `Error submitting form: ${error.message}`;
    } else {
      console.log("sending email message to admins")
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
        window.location.href = '/thankyou';
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

        <div>
          <iframe class="iframe" src={paymentLink} allow="clipboard-read; clipboard-write;" title="Lightning Invoice" frameborder="0" style="width: 100%; height: 500px;"></iframe>
        </div>
        
        <button type="submit">Submit</button>
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

  .iframe {
    display: block;
    text-align: center;
  }
</style>
