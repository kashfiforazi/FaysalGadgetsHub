# Security Specification - Faysal Gadgets Hub

## Data Invariants
1. A user can only read and write their own profile data.
2. Only admins can create, update, or delete products and categories.
3. Users can only read their own orders.
4. Product reviews can only be created by authenticated users.
5. Wishlist items can only be managed by the owner.
6. Prices and stock levels are immutable by regular users.

## The "Dirty Dozen" Payloads (Deny Cases)
1. **Identity Spoofing**: User A attempts to update User B's role to 'admin'.
2. **Resource Poisoning**: Attacker attempts to create a product with a 2MB description string.
3. **Price Manipulation**: User attempts to update a product price to $0.01.
4. **Order Status Hijack**: User attempts to mark their own pending order as 'delivered'.
5. **Orphaned Write**: User attempts to create an order referencing a non-existent product ID.
6. **Shadow Field injection**: User attempts to add `isVerified: true` to their user profile.
7. **Cross-User Wishlist**: User A attempts to delete an item from User B's wishlist.
8. **Admin Bypass**: Unauthenticated user attempts to delete a product.
9. **Email Spoofing**: Attacker uses a non-verified email that matches an admin email to gain access.
10. **Flash Sale Overflow**: Attacker attempts to buy 10,000 units of a limited stock item in one order (if logic handled in rules).
11. **Review Spam**: User attempts to post 100 reviews for the same product in 1 second.
12. **PII Leak**: Authenticated user attempts to list all users' private addresses.

## Test Runner Plan
- `firestore.rules` will enforce these constraints using `isValidUser`, `isValidProduct`, etc.
- `isAdmin()` will check against an `admins` collection.

## Admin Setup
- I will include `mdkawsarforazi.biz@gmail.com` as an initial admin in the rules logic or a dedicated collection check.
