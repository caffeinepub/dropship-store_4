# DropShip Store

## Current State
Full-stack dropshipping store with:
- Product catalog (6 products) fetched from backend
- Cart, checkout, contact/enquiry pages
- Admin panel at /admin with username/password login (Shivam / Shivam1234)
- Backend stores products, orders, enquiries in non-stable Maps
- Products seeded at actor init with INR prices (399, 699, 150, 99, 299, 499)
- Issue: canister state persists old prices from earlier deploys because upgrades don't reset non-stable state in all environments

## Requested Changes (Diff)

### Add
- `resetProductPrices` admin function that overwrites seed products with correct INR prices

### Modify
- Ensure product seed always overwrites existing entries (already uses `products.add()` which overwrites)
- Regenerate backend to force a clean canister reinstall with correct prices

### Remove
- Nothing

## Implementation Plan
1. Regenerate Motoko backend with all existing functionality plus `resetProductPrices` endpoint
2. Ensure seed prices are: Earbuds 399, Smart Watch 699, Yoga Mat 150, Water Bottle 99, Bluetooth Speaker 299, Fitness Tracker 499
3. Deploy to force canister reinstall with fresh state
