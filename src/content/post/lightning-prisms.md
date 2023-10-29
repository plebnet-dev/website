---
publishDate: 2023-10-02T00:00:00Z
title: Lightning Prisms with LNBits
excerpt: A step by step how-to guide to create a Lightning Prism split payments with LNBits
image:  /src/content/post/_images/lnprisms/lnprisms.webp
category: Guides and Tutorials
author: bitkarrot
canonical: https://bitkarrot.substack.com/p/why-nostr-wins
tags:
  - lightning
  - bitcoin
  - LNBits
  - payments
---

## What are Lightning Prisms?

> A Lightning Prism is a construct that allows for “lightning address value split workflows,” to quote the originator, Mr. Kukks.

This guide is a step-by-step demo of how to implement prisms in LNBits and is inspired by [dergigi’s post](https://dergigi.com/2023/03/12/lightning-prisms/).

## Step 1. Get LNBits

If you already have LNBits you can skip this step. But if you don’t, you can find out more here at https://lnbits.com

## Step 2. Payment Options in LNBits

There are three payment options:

1. Wallet ID - this is an ID created by LNBits on wallet creation. Every wallet has a Wallet ID which can be found in the API info section on the LNBits dashboard. It is internal to LNbits only ID, so best if used for splitting payments for wallets within your LNbits instance only.

2. LNURL – You can get one from the LNURLp Extension within LNBits. Can be used externally or within LNbits.

3. New or Existing LN addresses – If you receiving payment is going to someone outside of your organization you can use this, or create a new one within the LNURLp extension, that uses your LNBits domain name.

> CAVEAT: LN Addresses MUST accept comments, I’d suggest at least 100 characters, or else the split payments will not work in the LNURLp extension.If there is no comment, the split will not occur.

> ALSO: DO not split to 100% if you send to a wallet that is external (routing fees!).

Within the LNBits LNURLp extension, you can check the comment characters and the lightning addresses in the QR Tab.

![LNBits QR Code Image](/src/content/post/_images/lnprisms/lnprisms-lnbits1.webp)

## Step 3. Flows and Splits

Now, the fun part. First within LNBits, enable the splitpayments extension. Next, select your main incoming wallet. For the purpose of this demo, we make the main wallet the LNBits Wallet, and 3 wallets (one, two, and three) as the destination of the splits.

The main wallet can also have a LN address by creating it in the LNURLp extension, e.g. myorg@sats.lnaddy.com.

![LNBits Setup Image](/src/content/post/_images/lnprisms/lnprisms-lnbits2.webp)

To split payments between the other 3 wallets, we can set up the split payments with the source wallet as LNBits Wallet.

Depending on your needs, the target wallets can either be internal to the current LNBits instance by using just the Wallet ID or external using Lightning addresses, such as one@sats.lnaddy.com or LNURL.

![LNBits Split Image](/src/content/post/_images/lnprisms/lnprisms-lnbits3.webp)

Once all the targets have been saved, test your splits by sending to the main wallet, either by creating an invoice or sending to the lightning address associated with the main wallet.

![LNBits Payments Image](/src/content/post/_images/lnprisms/lnprisms-lnbits4.webp)

To watch it in action, see this [video](https://www.veed.io/view/94f29512-80b1-4644-9b75-4fd0a87da355?panel=share) or visit it on [twitter](https://twitter.com/bitkarrot/status/1639035993801261056?s=20)

If you have any questions, you can visit the LNBits chat on Telegram https://t.me/lnbits

## Step 4. Launch!

Now you’re ready to launch that prism!

P.S. Special thanks to @dni for getting the [splits payment extension working!](https://twitter.com/dnilabs/status/1639361220670021649)

<hr>

> This post can also be found on substack at: https://bitkarrot.substack.com/
> Find me on Nostr at: https://primal.net/bitkarrot or on twitter at: https://twitter.com/bitkarrot

[[Top]](#top)
