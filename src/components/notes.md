1. create the new invoice

```bash
curl -X POST https://sats.lnaddy.com/api/v1/payments \
-H "X-Api-Key: 9d8d0e262b5b43dca7f7d83599f22c9f" \
-H "Content-type: application/json" \
-d '{
  "out": false,
  "amount": 100000,
  "memo": "Plebnet Individual Membership",
  "expiry": 3600,
  "unit": "sat",
  "internal": false
}'
```

- returns:

```json
{
  "payment_hash": "2dd7707afb494cf66aad755716352e8a6ca7d73caf50d28402e982b5f3289063",
  "payment_request": "lnbc1u1pjtmelnpp59hthq7hmf9x0v64dw4t3vdfw3fk204eu4agd9pqzaxpttuegjp3sdq523jhxapqd9h8vmmfvdjscqzzsxqrrsssp59lfwpxd8qpv595mnpr8kyddmetanu79ttmtw7jv0ft69fzmc9e3s9qyyssq8gy2j00um96st0p4jja4uhe3cvwnl9ar9e5qrr5ncg65nax3kj6pjsdylze9csdhuqevdnufzchv304zf8lh5yr5lvx4qjfshxazldqpa463lh",
  "checking_id": "2dd7707afb494cf66aad755716352e8a6ca7d73caf50d28402e982b5f3289063",
  "lnurl_response": null
}
```

2. retrieve new invoice

```bash
curl -X POST https://sats.lnaddy.com/api/v1/payments/decode \
-H "X-Api-Key: 9d8d0e262b5b43dca7f7d83599f22c9f" \
-H "Content-type: application/json" \
-d '{
  "data": "lnbc1u1pjtmelnpp59hthq7hmf9x0v64dw4t3vdfw3fk204eu4agd9pqzaxpttuegjp3sdq523jhxapqd9h8vmmfvdjscqzzsxqrrsssp59lfwpxd8qpv595mnpr8kyddmetanu79ttmtw7jv0ft69fzmc9e3s9qyyssq8gy2j00um96st0p4jja4uhe3cvwnl9ar9e5qrr5ncg65nax3kj6pjsdylze9csdhuqevdnufzchv304zf8lh5yr5lvx4qjfshxazldqpa463lh"
}'
```

- returns:

```json
{
  "payment_hash": "2dd7707afb494cf66aad755716352e8a6ca7d73caf50d28402e982b5f3289063",
  "amount_msat": 100000,
  "description": "Test invoice",
  "description_hash": null,
  "payee": "036ff83834666d3ebfe61c2a7d1f8fc5d6b339a26559a61819e2b0d1b5f540fdfc",
  "date": 1690167283,
  "expiry": 3600,
  "secret": "2fd2e099a7005942d37308cf6235bbcafb3e78ab5ed6ef498f4af4548b782e63",
  "route_hints": [],
  "min_final_cltv_expiry": 18
}
```

3. check payment status

<payment_hash> is the payment_request returned from the invoice creation

```bash
curl -X GET https://sats.lnaddy.com/api/v1/payments/<payment_hash> -H "X-Api-Key: 9d8d0e262b5b43dca7f7d83599f22c9f" -H "Content-type: application/json"
```

returns:

```json
{
  "paid": false,
  "preimage": "0000000000000000000000000000000000000000000000000000000000000000",
  "details": {
    "checking_id": "2dd7707afb494cf66aad755716352e8a6ca7d73caf50d28402e982b5f3289063",
    "pending": true,
    "amount": 100000,
    "fee": 0,
    "memo": "Test invoice",
    "time": 1690167283,
    "bolt11": "lnbc1u1pjtmelnpp59hthq7hmf9x0v64dw4t3vdfw3fk204eu4agd9pqzaxpttuegjp3sdq523jhxapqd9h8vmmfvdjscqzzsxqrrsssp59lfwpxd8qpv595mnpr8kyddmetanu79ttmtw7jv0ft69fzmc9e3s9qyyssq8gy2j00um96st0p4jja4uhe3cvwnl9ar9e5qrr5ncg65nax3kj6pjsdylze9csdhuqevdnufzchv304zf8lh5yr5lvx4qjfshxazldqpa463lh",
    "preimage": "0000000000000000000000000000000000000000000000000000000000000000",
    "payment_hash": "2dd7707afb494cf66aad755716352e8a6ca7d73caf50d28402e982b5f3289063",
    "expiry": 1690170883.0,
    "extra": {},
    "wallet_id": "8795870d313e40949d421e878d86697a",
    "webhook": "http://your-webhook-url.com",
    "webhook_status": null
  }
}
```

4. display the qr code:

```bash
curl -X 'GET' \
  'https://sats.lnaddy.com/api/v1/qrcode/lnbc1u1pjtmelnpp59hthq7hmf9x0v64dw4t3vdfw3fk204eu4agd9pqzaxpttuegjp3sdq523jhxapqd9h8vmmfvdjscqzzsxqrrsssp59lfwpxd8qpv595mnpr8kyddmetanu79ttmtw7jv0ft69fzmc9e3s9qyyssq8gy2j00um96st0p4jja4uhe3cvwnl9ar9e5qrr5ncg65nax3kj6pjsdylze9csdhuqevdnufzchv304zf8lh5yr5lvx4qjfshxazldqpa463lh' \
  -H 'accept: */*'
```

returns:

```
big ol svg file
```

curl -X PUT https://sats.lnaddy.com/lnurlp/api/v1/links/RBeZwr -d '{"description": 'steve has paid', "amount": 1}' -H "Content-type: application/json" -H "X-Api-Key: 1cccf72bd6e643029760052d10fa5e0b"
