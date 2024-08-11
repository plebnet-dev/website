<script>
    import { onMount, onDestroy } from 'svelte';
    import QRCode from 'qrcode';  // Assuming you're using qrcode.js for QR code generation

    let amount= '';
    let comment = '';

    let qrCodeData = null;
    let invoiceRequest = '';
  
    onMount(async () => {
    });
  
    onDestroy(() => {
    });
  
    async function handleSubmit() {
      try {
        const formData = {
          formType: 'donate',
          amount,
          comment,
        };
    
        const response = await fetch('/api/donate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
  
          if (response.ok) { 
            let body = await response.json()
            // console.log("body: \n", body)
            invoiceRequest = body.invoiceRequest;
              // Generate QR code
              QRCode.toDataURL(invoiceRequest, function (err, url) {
                if (err) console.error(err);
                qrCodeData = url;
            });
            
          } else { 
            console.log("Error submitting form", response.status, response.statusText)
          }      
      } catch (error) {
        console.error('Error handling submit:', error);
      }
    }
    
    function copyToClipboard() {
        navigator.clipboard.writeText(invoiceRequest).then(() => {
            alert('Invoice request copied to clipboard!');
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    }
</script>

        {#if qrCodeData}
          <div class="input-wrapper">
              <p class="text-center invoice-text">
                {#if invoiceRequest.length > 20}
                    {invoiceRequest.slice(0, 20)}... 
                    <button class="text-center copy-invoice" on:click={copyToClipboard}>
                      Click to copy Invoice
                      <img src={qrCodeData} alt="QR Code"/>
                    </button>
                {/if}
              </p>
              <h1 class="text-center mt-2"> Thank you! </h1>
            </div>        
        {:else}

        <form on:submit|preventDefault={handleSubmit}>
            <label for="amount">Amount</label>
            <input type="number" id="amount" placeholder="1000" bind:value={amount} required />
            <label for="comment">comment (optional)</label>
            <input type="text" id="comment" placeholder="your comment here" bind:value={comment} />
            <button type="submit" class="btn">
             <b> ⚡️Zap⚡️ </b>
            </button>
        </form>
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
  
    .input-wrapper {
      /* position: relative;*/
      display: flex;
      flex-direction: column; 
    }
  
    h1 {
      font-size: 2rem;
      font-weight: bold;
      margin-top: 0;
      margin-bottom: 1rem;
    }
  </style>
  