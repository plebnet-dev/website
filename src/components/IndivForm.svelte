<script>
    import { onMount, onDestroy } from 'svelte';
    
    let indivMembershipFee = 333
    indivMembershipFee = import.meta.env.PUBLIC_INDIV_FEE || indivMembershipFee
  
    let name = '';
    let email = '';
    let twitter = '';
    let github = '';
    let experience = '';
    let goal = '';
    let mentor = false;
    let discordHandle = '';
  
    onMount(async () => {
      // console.log("indivMembershipFee", indivMembershipFee)
    });
  
    onDestroy(() => {
    });
  
    async function handleSubmit() {
      try {
        const formData = {
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
  
        // console.log(formData)
  
        const response = await fetch('/api/new-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
  
          if (response.ok) { 
            // console.log("Success submitting form")
            let body = await response.json()
            // console.log("response", body, 'url', body['url'])
  
            let forwardlink = body['url']
            window.location.href=forwardlink
            
          } else { 
            console.log("Error submitting form", response.status, response.statusText)
          }      
      } catch (error) {
        console.error('Error handling submit:', error);
      }
    }
  
    function formatNumberWithCommas(number) {
      // console.log("formatNumberWithCommas", number)
      return Number(number).toLocaleString();
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
            <input type="text" id="discordHandle" bind:value={discordHandle} required />
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
            <label for="mentor" style="margin-top:2.5rem;">Do you want to mentor?</label>
            <input type="checkbox" id="mentor" bind:checked={mentor} />
          </div>
          <div class="input-wrapper text-center">
            <label style="font-size:1.5rem; margin-top: 2rem;" class="text-center" for="qrCode">Membership Dues</label>
            <p style="color: #FF9500" class="text-center">{`${formatNumberWithCommas(indivMembershipFee)} sats`}</p>
          </div>
          <div class="text-center">
            <p style="margin-top:2rem;">
              One Time Membership Fee
            </p>
            <button type="submit" class="btn">
             <b>Pay with &nbsp;</b> <img src="/images/lnbitslogo.svg" width="70px" alt="LNBits" />
            </button>
            </div>
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
      border: 0.5px solid #555;
      font-size: 1rem;
      background-color: transparent;
    }
  
    input:focus {
      outline: none;
      border-color: #fff;
    }
  
    button {
      margin-top: 1rem;
      padding: 1rem 1.5rem;
      background-color: #1F40AE;
      color: white;
      border: none;
      border-radius: 20px;
      cursor: pointer;
      transition: background-color 0.3s;
      font-size: 1rem;
      font-weight: bold;
      /* align-items: center;
      justify-content: center;   */
    }
  
    button:hover {
      background-color: #FF9500;
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
  </style>
  