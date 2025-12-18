# Testing GeM Bid Document Extraction

## Test File: GEM.txt

### Expected Extracted Data:

```json
{
  "tenderId": "GEM/2025/B/6572913",
  "department": "Department Of Heavy Industry",
  "ministry": "Ministry Of Heavy Industries And Public Enterprises",
  "organization": "Bharat Heavy Electricals Limited (BHEL)",
  "submissionDeadline": "29-08-2025 18:00:00",
  "openingDate": "29-08-2025 18:30:00",
  "validity": "90 (Days)",
  "totalQuantity": "900",
  "paymentTerms": "Payments shall be made to the Seller within 90 days",
  "emdRequired": "No",
  "epbgRequired": "No",
  "itemCategory": "MAPLITHO PAPER 80GSM SIZE 0.841X100MTS",
  "bidType": "Two Packet Bid",
  "msePreference": "Yes",
  "miiPreference": "Yes"
}
```

## Testing Commands:

1. Start dev server:
```bash
npm run dev
```

2. Upload GEM.txt through the UI

3. Check extraction results

---

## What AI Should Extract:

### Company Info:
- Organization: Bharat Heavy Electricals Limited (BHEL)
- Ministry: Ministry Of Heavy Industries And Public Enterprises
- Department: Department Of Heavy Industry
- Office: Boiler Auxiliaries Plant Ranipet

### Timeline:
- End Date: 29-08-2025 18:00:00
- Opening Date: 29-08-2025 18:30:00
- Validity: 90 Days

### Financial:
- Total Quantity: 900
- EMD Required: No
- ePBG Required: No
- Payment Terms: 90 days

### Product:
- Category: MAPLITHO PAPER 80GSM SIZE 0.841X100MTS
- Specifications: Various sizes (0.841X100MTS, 0.457X100M, etc.)

### Compliance:
- MSE Purchase Preference: Yes
- MII Purchase Preference: Yes
- Bid Type: Two Packet Bid
- Reverse Auction: Yes

