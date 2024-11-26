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
// {
// proxyType: 'MOBILE',
// proxyValue: '91234567',
// amount: 50.00,
// editable: false,
// reference: 'INV123'
// }
```

## License
MIT