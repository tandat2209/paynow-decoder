export interface PayNowData {
    payloadFormat?: string;
    pointOfInitiation?: string;
    merchantAccountInfo?: {
        identifier?: string;
        proxyType?: string;
        proxyValue?: string;
        amountEditable?: boolean;
        expiryDate?: string;
    };
    merchantCategoryCode?: string;
    currencyCode?: string;
    transactionAmount?: number;
    countryCode?: string;
    merchantName?: string;
    merchantCity?: string;
    additionalData?: {
        referenceNumber?: string;
    };
    crc?: string;
}
  
export interface DecodedField {
    id?: string;
    length?: number;
    value?: string;
    nestedFields?: DecodedField[];
}