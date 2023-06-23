<script>
  import { createClient } from '@supabase/supabase-js';
  import { fade } from 'svelte/transition';

  const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

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
      sponsor,
    };
    console.log(JSON.stringify(formData));

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
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 4px;
  text-align: center;
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
  min-width: 300px;
  max-width: 90%;
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
</style>

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
  <label for="goal">Why does your company want to join Pleb Devs?*</label>
  <textarea type="text" id="goal" bind:value={goal} required />
</div>

<div class="input-wrapper">
  <label for="industry">Industry*</label>
  <input type="text" id="industry" bind:value={industry} required />
</div>

<div class="input-wrapper">
  <label for="sponsor">Do you want to sponsor Pleb Devs?*</label>
  <input type="checkbox" id="sponsor" bind:checked={sponsor} />
</div>

  <button type="submit">Submit</button>

{#if showModal}
  <div class="modal" transition:fade>
    <div class="modal-content">
      <h2>Thank you for signing up!</h2>
      <p>Check out some community projects and find one that's right for you</p>
    </div>
  </div>
{/if}
</form>