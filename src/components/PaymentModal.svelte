<!-- PaymentModal.svelte -->
<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let showPaymentModal;
    export let formData;
    let invoice = '';

    async function openModal() {
    // Perform the GET request when you open the modal
        try {
        const response = await fetch('https://testnet.plebnet.dev/satspay/1', {
            method: 'GET',
            headers: {
            // You can add headers if needed (e.g., authentication)
            },
        });

            if (response.ok) {
                invoice = await response.json(); // Parse the response data if it's in JSON
                console.log('GET request successful:', invoice);
            } else {
                console.error('GET request failed:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    // Call openModal to trigger the GET request when the modal opens
    openModal();
</script>
  
  <div class="modal" style="{showPaymentModal ? 'display: block;' : 'display: none;'}">
    <div class="modal-content">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <span class="close" on:click={() => showPaymentModal = false}>&times;</span>
      <h2>Here is your payment!</h2>
      <h2>{formData.name}</h2>
      <h2>{formData.discord_username}</h2>
      <h2>{formData.email}</h2>
      <h2>{formData.twitter}</h2>
      <h2>{formData.github}</h2>
      <h2>{formData.experience}</h2>
      <h2>{formData.goal}</h2>
      <h2>{formData.mentor}</h2>
      <h1>{invoice}</h1>
    </div>
  </div>
  
  <style>
    /* Modal styles */
    .modal {
      display: none;
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0, 0, 0, 0.6); /* Slightly darker background color */
    }
  
    .modal-content {
      background-color: darkblue; /* Change to your desired color */
      color: white; /* Text color in the modal */
      margin: 10% auto; /* Adjust the distance from the top */
      padding: 2rem; /* Increased padding for a larger modal */
      border-radius: 20px; /* Added to match form styles */
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.4); /* Box shadow for depth */
      width: 60%; /* Adjust the width as needed */
      max-width: 800px; /* Max width for larger screens */
      text-align: center; /* Center modal content */
    }
  
    .close {
      color: #aaa;
      float: right;
      font-size: 32px; /* Larger close button */
      font-weight: bold;
    }
  
    .close:hover,
    .close:focus {
      color: white; /* Hover and focus color */
      text-decoration: none;
      cursor: pointer;
    }
  
    /* Add any additional styles you want for your modal content here */
  
  </style>
  