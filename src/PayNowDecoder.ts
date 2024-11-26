import { PayNowData, DecodedField } from './types';

export class PayNowDecoder {
  // Root level IDs
  private static readonly PAYLOAD_FORMAT_INDICATOR = '00';
  private static readonly POINT_OF_INITIATION_METHOD = '01';
  private static readonly MERCHANT_ACCOUNT_INFO = '26';
  private static readonly MERCHANT_CATEGORY_CODE = '52';
  private static readonly TRANSACTION_CURRENCY = '53';
  private static readonly TRANSACTION_AMOUNT = '54';
  private static readonly COUNTRY_CODE = '58';
  private static readonly MERCHANT_NAME = '59';
  private static readonly MERCHANT_CITY = '60';
  private static readonly ADDITIONAL_DATA = '62';
  private static readonly CRC = '63';

  // Merchant Account Info nested IDs
  private static readonly MERCHANT_IDENTIFIER = '00';
  private static readonly MERCHANT_PROXY_TYPE = '01';
  private static readonly MERCHANT_PROXY_VALUE = '02';
  private static readonly MERCHANT_AMOUNT_EDITABLE = '03';
  private static readonly MERCHANT_EXPIRY_DATE = '04';

  // Additional Data nested IDs
  private static readonly REFERENCE_NUMBER = '01';

  public static decode(payload: string): PayNowData {
    const fields = this.parseFields(payload);
    return this.extractPayNowData(fields);
  }

  private static parseFields(payload: string): DecodedField[] {
    const fields: DecodedField[] = [];
    let position = 0;

    while (position < payload.length) {
      const id = payload.substr(position, 2);
      position += 2;

      const lengthStr = payload.substr(position, 2);
      const length = parseInt(lengthStr, 10);
      position += 2;

      const value = payload.substr(position, length);
      position += length;

      // Handle nested fields for merchant account info and additional data
      if (id === this.MERCHANT_ACCOUNT_INFO || id === this.ADDITIONAL_DATA) {
        const nestedFields = this.parseFields(value);   
        fields.push({ id, length, value, nestedFields });
      } else {
        fields.push({ id, length, value });
      }
    }

    return fields;
  }

  private static extractPayNowData(fields: DecodedField[]): PayNowData {
    const merchantInfoField = fields.find(f => f.id === this.MERCHANT_ACCOUNT_INFO);
    const additionalDataField = fields.find(f => f.id === this.ADDITIONAL_DATA);
    const transactionAmount = this.extractFieldValue(fields, this.TRANSACTION_AMOUNT);
    
    return {
      payloadFormat: this.extractFieldValue(fields, this.PAYLOAD_FORMAT_INDICATOR),
      pointOfInitiation: this.extractFieldValue(fields, this.POINT_OF_INITIATION_METHOD),
      merchantAccountInfo: this.parseMerchantAccountInfo(merchantInfoField?.nestedFields || []),
      merchantCategoryCode: this.extractFieldValue(fields, this.MERCHANT_CATEGORY_CODE),
      currencyCode: this.extractFieldValue(fields, this.TRANSACTION_CURRENCY),
      transactionAmount: transactionAmount ? parseFloat(transactionAmount) : undefined,
      countryCode: this.extractFieldValue(fields, this.COUNTRY_CODE),
      merchantName: this.extractFieldValue(fields, this.MERCHANT_NAME),
      merchantCity: this.extractFieldValue(fields, this.MERCHANT_CITY),
      additionalData: this.parseAdditionalData(additionalDataField?.nestedFields || []),
      crc: this.extractFieldValue(fields, this.CRC)
    };
  }

  private static extractFieldValue(fields: DecodedField[], id: string): string | undefined {
    const field = fields.find(f => f.id === id);
    return field?.value;
  }

  private static parseMerchantAccountInfo(nestedFields: DecodedField[]): PayNowData['merchantAccountInfo'] {
    const identifier = this.extractFieldValue(nestedFields, this.MERCHANT_IDENTIFIER);
    const rawProxyType = this.extractFieldValue(nestedFields, this.MERCHANT_PROXY_TYPE);
    const proxyType = rawProxyType === '0' ? 'mobile' : rawProxyType === '2' ? 'uen' : undefined;
    const amountEditableStr = this.extractFieldValue(nestedFields, this.MERCHANT_AMOUNT_EDITABLE);
    
    return {
      identifier: identifier,
      proxyType: proxyType,
      proxyValue: this.extractFieldValue(nestedFields, this.MERCHANT_PROXY_VALUE),
      amountEditable: amountEditableStr === '1',
      expiryDate: this.extractFieldValue(nestedFields, this.MERCHANT_EXPIRY_DATE)
    };
  }

  private static parseAdditionalData(nestedFields: DecodedField[]): PayNowData['additionalData'] | undefined {
    const referenceNumber = this.extractFieldValue(nestedFields, this.REFERENCE_NUMBER);
    return referenceNumber ? { referenceNumber } : undefined;
  }
}