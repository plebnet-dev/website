<script>
    import { onMount, onDestroy } from 'svelte';
    import QRCode from 'qrcode';  // Assuming you're using qrcode.js for QR code generation

    let corpMemberFee = 555
    corpMemberFee = import.meta.env.PUBLIC_CORP_FEE || corpMemberFee
  
    let orgName = '';
    let contactPerson = '';
    let discordHandle = '';
    let email = '';
    let website = '';
    let twitter = '';
    let goal = '';
    let industry = '';
  
    let qrCodeData = null;
    let invoiceRequest = '';


    onMount(async () => {
      // console.log("corpMemberFee", corpMemberFee)
    });
  
    onDestroy(() => {
    });
  
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
  
      //console.log(formData)
      const response = await fetch('/api/new-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
      if (response.ok) { 
        let body = await response.json()
            invoiceRequest = body.invoiceRequest;
              // Generate QR code
              QRCode.toDataURL(invoiceRequest, function (err, url) {
                if (err) console.error(err);
                qrCodeData = url;
            });


      } else { 
        console.log("Error submitting form", response.status, response.statusText)
      }
    }
  
    function formatNumberWithCommas(number) {
      // console.log("formatNumberWithCommas", number)
      return Number(number).toLocaleString();
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(invoiceRequest).then(() => {
            alert('Invoice request copied to clipboard!');
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    }

  
  </script>
  
  <div>
    <div>
        <h1>Corporate Membership</h1>

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
                <label for="twitter">Twitter or Nostr</label>
                <input type="text" id="twitter" bind:value={twitter} />
              </div>
              <div class="input-wrapper">
                <label id="why-join" for="goal">Any comments for us?*</label>
                <textarea type="text" id="goal" bind:value={goal} required />
              </div>
              <div class="input-wrapper">
                <label style="font-size:1.5rem; margin-top: 2rem;" class="text-center" for="qrCode">Membership Dues</label>
              <p style="color: #FF9500" class="text-center">{`${formatNumberWithCommas(corpMemberFee)} sats`}</p>
              </div>
              <div class="text-center">
                <p style="margin-top:2rem;">
                  One Time Membership Fee
                </p>      
                <button type="submit" class="btn">
                  <b>Pay with  ⚡️Lightning⚡️ </b>
                </button>
              </div>
            </form>

        {/if}
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
      padding: 1rem 1.5rem;
      background-color: #1F40AE;
      color: white;
      font-size: 1rem;
      font-weight: bold;
      border: none;
      border-radius: 20px;
      cursor: pointer;
      transition: background-color 0.3s;
      /* align-items: center;
      justify-content: center; */
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
  