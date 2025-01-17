import { PayNowDecoder } from "../PayNowDecoder";

describe("PayNowDecoder", () => {
  it("should decode a PayNow payload with amount and reference", () => {
    const payload =
      "00020101021226540009SG.PAYNOW01012020912345678A03011041420241130230000520400005303702540599.995802SG5912TEST COMPANY6009Singapore62140110TESTQRCODE63042A56";

    const result = PayNowDecoder.decode(payload);

    expect(result).toEqual({
      payloadFormat: "01",
      pointOfInitiation: "12",
      merchantAccountInfo: {
        identifier: "SG.PAYNOW",
        proxyType: "uen",
        proxyValue: "12345678A",
        amountEditable: true,
        expiryDate: "20241130230000",
      },
      merchantCategoryCode: "0000",
      currencyCode: "702",
      transactionAmount: 99.99,
      countryCode: "SG",
      merchantName: "TEST COMPANY",
      merchantCity: "Singapore",
      additionalData: {
        referenceNumber: "TESTQRCODE",
      },
      crc: "2A56",
    });
  });

  it("should decode a PayNow payload with mobile number", () => {
    const payload =
      "00020101021226560009SG.PAYNOW010100211+654343210003011041420241130193200520400005303702540820000.015802SG59006009Singapore62250121TESTQRCODEPHONENUMBER63041F4C";

    const result = PayNowDecoder.decode(payload);

    expect(result).toEqual({
      payloadFormat: "01",
      pointOfInitiation: "12",
      merchantAccountInfo: {
        identifier: "SG.PAYNOW",
        proxyType: "mobile",
        proxyValue: "+6543432100",
        amountEditable: true,
        expiryDate: "20241130193200",
      },
      merchantCategoryCode: "0000",
      currencyCode: "702",
      transactionAmount: 20000.01,
      countryCode: "SG",
      merchantName: "",
      merchantCity: "Singapore",
      additionalData: {
        referenceNumber: "TESTQRCODEPHONENUMBER",
      },
      crc: "1F4C",
    });
  });

  it("should decode a PayNow payload with VPA", () => {
    const payload =
      "00020101021226450009SG.PAYNOW010130218UEN201422384R#WISE0301052040000530370254031.05802SG5902NA6009SINGAPORE62150111P47556862QR630461FB";

    const result = PayNowDecoder.decode(payload);

    expect(result).toEqual({
      payloadFormat: "01",
      pointOfInitiation: "12",
      merchantAccountInfo: {
        identifier: "SG.PAYNOW",
        proxyType: "vpa",
        proxyValue: "UEN201422384R#WISE",
        amountEditable: false,
        expiryDate: undefined,
      },
      merchantCategoryCode: "0000",
      currencyCode: "702",
      transactionAmount: 1,
      countryCode: "SG",
      merchantName: "NA",
      merchantCity: "SINGAPORE",
      additionalData: { referenceNumber: "P47556862QR" },
      crc: "61FB",
    });
  });
});
