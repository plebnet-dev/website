export async function getLightningInvoice(lightningAddress, satoshiAmount) {
  try {
    // Validate input
    if (!satoshiAmount || satoshiAmount <= 0) {
      throw new Error('Invalid amount: must be greater than 0');
    }

    // Parse the Lightning Address (user@domain)
    const [username, domain] = lightningAddress.split('@');
    if (!username || !domain) {
      throw new Error('Invalid Lightning Address format');
    }

    // Fetch the Lightning Address metadata
    const response = await fetch(`https://${domain}/.well-known/lnurlp/${username}`);
    // console.log(`https://${domain}/.well-known/lnurlp/${username}`)
    if (!response.ok) {
      throw new Error('Failed to fetch Lightning Address metadata');
    }

    const metadata = await response.json();
    //  console.log(metadata)
    if (!metadata.callback) {
      throw new Error('Invalid Lightning Address metadata');
    }

    // Check if amount is within allowed limits
    if (metadata.minSendable && satoshiAmount * 1000 < metadata.minSendable) {
      throw new Error(`Amount too small. Minimum is ${metadata.minSendable / 1000} sats`);
    }
    if (metadata.maxSendable && satoshiAmount * 1000 > metadata.maxSendable) {
      throw new Error(`Amount too large. Maximum is ${metadata.maxSendable / 1000} sats`);
    }

    // Request an invoice for the specified amount
    const amountMillisat = satoshiAmount * 1000; 
    // * 1000; // Convert to millisats
   

    const invoiceUrl = `${metadata.callback}?amount=${amountMillisat}`;
    console.log(invoiceUrl)
    
    const invoiceResponse = await fetch(invoiceUrl);
    if (!invoiceResponse.ok) {
      throw new Error('Failed to fetch invoice');
    }

    const invoiceData = await invoiceResponse.json();
   // console.log(invoiceData)
    if (!invoiceData.pr) {
      throw new Error('Invalid invoice response');
    }

    return invoiceData.pr; // Return the BOLT11 invoice
  } catch (error) {
    console.error('Error fetching Lightning invoice:', error);
    throw error;
  }
}

const lightningAddress = 'soc@plebnet.dev';
//const amount = 100000; // Amount in satoshis

// // Usage example 1
// let result = await getLightningInvoice(lightningAddress, amount);
// console.log(result)


// Usage example 2
/*
getLightningInvoice(lightningAddress, amount)
  .then(invoice => {
    console.log('BOLT11 Invoice:', invoice);
  })
  .catch(error => {
    console.error('Failed to get invoice:', error);
  });
*/
