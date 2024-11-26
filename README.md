# PayNow Decoder

A TypeScript library for decoding PayNow QR codes and extracting payment information.

## Installation
```bash
npm install paynow-decoder
```

## Usage
```typescript
import { PayNowDecoder } from 'paynow-decoder';

const payload = '...'; // Your PayNow QR code payload
const decodedData = PayNowDecoder.decode(payload);
console.log(decodedData);
/* Output:
{
  payloadFormat: "01",
  pointOfInitiation: "12",
  merchantAccountInfo: {
    identifier: "SG.PAYNOW",
    proxyType: "mobile", // or "uen"
    proxyValue: "+6512345678",
    amountEditable: true,
    expiryDate: "20241130230000"
  },
  merchantCategoryCode: "0000",
  currencyCode: "702",
  transactionAmount: 99.99,
  countryCode: "SG",
  merchantName: "TEST COMPANY",
  merchantCity: "Singapore",
  additionalData: {
    referenceNumber: "TESTQRCODE"
  },
  crc: "2A56"
}
*/
```

## Features
- Decodes PayNow QR codes for both UEN and mobile number recipients
- Extracts complete payment information including:
  - Proxy type (UEN/mobile)
  - Proxy value
  - Transaction amount
  - Reference number
  - Merchant details
  - Expiry date
  - Amount editability

## License
MIT