<!-- PaymentModal.svelte -->
<meta http-equiv="permissions-policy" content="clipboard-read=(self)">

<script>
    import { createEventDispatcher } from 'svelte';
    // import { API_KEY } from '../../env'
    const dispatch = createEventDispatcher();

    export let showPaymentModal;
    export let formData;
    let paymentLink = '';
    let invoice = '';
    let amount = 300000;
    let name = '';

    async function openModal() {
      // paymentLink = "https://testnet.plebnet.dev/satspay/kbHacWmjVU8PTVeE2eyhuj"; // Replace with the actual payment link
      if (formData.formType = 'individual') {
        amount = 10;
        name = formData.name;
      } else if (formData.formType = 'corporate'){
        amount = 30;
        name = formData.orgName;
      }

      try {
        const response = await fetch('https://testnet.plebnet.dev/satspay/api/v1/charge', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Api-Key': API_KEY,
            // You can add headers if needed (e.g., authentication)
            },
            body: JSON.stringify({
              "id": "6f900155ce2748c7bbcbc9f347da4906",
              "amount": amount,
              "time": 10,
              "description": name + " Lightning Invoice",
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

    function closeModal() {
      showPaymentModal = false;
      window.location.reload();
    }

    openModal();
</script>
  
{#if showPaymentModal}
  <div class="modal" style="{showPaymentModal ? 'display: block;' : 'display: none;'}">
    <div class="modal-content">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- <span class="close" on:click={() => showPaymentModal = false}>&times;</span> -->
      <!-- <h2 class="heading">Membership Fee</h2> -->
      <!-- <h2>{formData.name}</h2>
      <h2>{formData.discord_username}</h2>
      <h2>{formData.email}</h2>
      <h2>{formData.twitter}</h2>
      <h2>{formData.github}</h2>
      <h2>{formData.experience}</h2>
      <h2>{formData.goal}</h2>
      <h2>{formData.mentor}</h2> -->
      <!-- <h2>{paymentLink}</h2> -->
      <iframe class="iframe" src={paymentLink} allow="clipboard-read; clipboard-write;" title="Lightning Invoice" frameborder="0" style="width: 100%; height: 100%;"></iframe>
      <button class="close" on:click={closeModal}>Close</button>
    </div>
  </div>
{/if}

<style>
  .modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 90%;
    height: 80%;
    background-color: rgba(15, 27, 47, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background-color: #0F1B2F;
    color: #FFFFFF;
    border-radius: 20px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    max-width: 800px;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .heading {
    font-size: 30px; 
    color: #FF9500;
    font-weight: bold;
    text-transform: uppercase;
    border-radius: 15px;
    display: inline-block;
  }


  .iframe {
    display: block;
    text-align: center;
  }

  .close {
    color: #FFFFFF;
    font-size: 32px;
    font-weight: bold;
    cursor: pointer;
    background-color: #FF9500;
    padding: 10px;
    border-radius: 20px;
    margin: 5vh 15vh; 
  }

</style>
