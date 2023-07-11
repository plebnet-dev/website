<script>
  import { createClient } from '@supabase/supabase-js';
  import { fade } from 'svelte/transition';
  import { onMount, onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let supabase;

  export let showFormModal = false;

  let isSubmitEnabled = false;

// Function to check payment status
async function checkPaymentStatus() {
  const response = await fetch('/api/payment-webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  console.log(data)
  if (data.status) {
    isSubmitEnabled = true;
  }
}

  async function getQRCode() {
    const response = await fetch('https://legend.lnbits.com/api/v1/qrcode/LNURL1DP68GURN8GHJ7MR9VAJKUEPWD3HXY6T5WVHXXMMD9AKXUATJD3CZ7STG0FG5G5GAR6M50');
    const data = await response.text();
    qrCode = data;
    console.log(data)
  }

  onMount(async () => {
    checkPaymentStatus();
    intervalId = setInterval(checkPaymentStatus, 5000);
    await getQRCode();
    const response = await fetch('/api/get-supabase');
    const responseBody = await response.text();
    const { supabaseUrl, supabaseKey } = JSON.parse(responseBody);
    supabase = createClient(supabaseUrl, supabaseKey);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });

  let name = '';
  let email = '';
  let twitter = '';
  let github = '';
  let experience = '';
  let goal = '';
  let prLink = '';
  let mentor = false;
  let responseMessage = '';
  let showModal = false;
  let qrCode = '';
  let intervalId;

async function handleSubmit() {
  const formData = {
    formType: 'individual',
    name,
    email,
    twitter,
    github,
    experience,
    goal,
    pr_link: prLink,
    mentor: mentor ? 'yes' : 'no',
  };
  console.log(JSON.stringify(formData));

  const { data, error } = await supabase.from('members-individual').insert([formData]);

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

  function toggleFormModal() {
  showFormModal = !showFormModal;
}

</script>

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
    border-bottom-color: #FF9900;
  }

  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: white;
    color: #FF9900;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #FF9900;
    color: white
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
    border-bottom-color: #FF9900;
    resize: none;
  }

input[type="checkbox"] {
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

input[type="checkbox"]:checked {
  background-color: #FF9900;
  border-color: #FF9900;
}

input[type="checkbox"]:checked::before {
  content: "";
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
  color:  #FF9900;
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
  color: #FF9900;
}

.modal-content p {
  font-size: 1rem;
  margin-top: 0.5rem;
  color: rgba(0, 0, 0, 0.6);
}
.modal-background {
  background-color: #10182B
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #FF9900;
  margin-top: 0;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .close-button {
    top: -15px;
    right: 5px;
  }
}
</style>

{#if showFormModal}
  <div class="modal" transition:fade>
    <div class="modal-content modal-background">
      <button class="close-button" on:click={() => {
        showFormModal = false;
        dispatch('modal', showFormModal);
      }}>×</button>
    <h1>Individual Sign Up</h1>
      <form on:submit|preventDefault={handleSubmit}>
<div class="input-wrapper">
  <label for="name">Name*</label>
  <input type="text" id="name" bind:value={name} required />
</div>

<div class="input-wrapper">
  <label for="email">Email*</label>
  <input type="email" id="email" bind:value={email} required />
</div>

<div class="input-wrapper">
  <label for="twitter">Twitter or Nostr npub</label>
  <input type="text" id="twitter" bind:value={twitter} />
</div>

<div class="input-wrapper">
  <label for="github">GitHub or GitLab*</label>
  <input type="text" id="github" bind:value={github} required />
</div>

<div class="input-wrapper">
  <label for="experience">Experience*</label>
  <textarea type="text" id="experience" bind:value={experience} required />
</div>

<div class="input-wrapper">
  <label for="goal">What do you want to get out of plebnet.dev?*</label>
  <textarea type="text" id="goal" bind:value={goal} required />
</div>

<div class="input-wrapper">
  <label for="prLink">PR Link (if applicable)</label>
  <input type="text" id="prLink" bind:value={prLink} />
</div>

<div class="input-wrapper">
  <label for="mentor">Do you want to mentor?</label>
  <input type="checkbox" id="mentor" bind:checked={mentor} />
</div>
  <div class="input-wrapper">
  <label for="qrCode">QR Code</label>
  <div id="qrCode" bind:innerHTML={qrCode} contenteditable></div>
</div>
  <button type="submit" disabled={!isSubmitEnabled}>Submit</button>

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