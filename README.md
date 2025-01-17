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

## Technical Details

### QR Code Structure
Each PayNow QR code consists of data objects with three components:
1. ID (00-99)
2. Length of value (01-99)
3. Value

For example, in "000201", "00" is the ID, "02" is the length, and "01" is the value.

### Key Fields
- **Payload Format (ID 00)**: Always "01" for current version
- **Point of Initiation (ID 01)**:
  - "11" for static QR (reusable)
  - "12" for dynamic QR (one-time use)
- **Merchant Account Info (ID 26)**:
  - Contains nested PayNow-specific data:
    - Identifier: Fixed as "SG.PAYNOW"
    - Proxy Type: "0" for mobile, "2" for UEN
    - Proxy Value: Mobile (+65XXXXXXXX) or UEN number
    - Amount Editable: "0" for fixed, "1" for editable
- **Currency Code (ID 53)**: "702" for SGD
- **Country Code (ID 58)**: "SG" for Singapore
- **CRC (ID 63)**: Checksum calculated using CRC-16-CCITT



## License
MIT

## References
- [Python PayNow QR Code Generator](https://github.com/poonchuanan/Python-PayNow-QR-Code-Generator) - A helpful reference implementation for PayNow QR code structure