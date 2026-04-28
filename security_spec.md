# Firebase Security Specification

## Data Invariants
1. Only the authenticated admin user (`in8460@hanmail.net`) can write to any collection.
2. All users can read the site content.
3. All fields must have size constraints to prevent resource exhaustion.
4. Timestamps should be handled correctly (though currently using numbers, I'll allow both if possible or stick to numbers if preferred by the existing logic).

## The "Dirty Dozen" Payloads (Deny Test Cases)
1. **Unauthenticated Write**: Trying to update site settings without login.
2. **Identity Spoofing**: Logged in as a regular user (if any) and trying to update admin settings.
3. **Ghost Fields**: Adding `isVerified: true` to a service document.
4. **ID Poisoning**: Using a 2KB string as a `postId`.
5. **PII Leak**: (Not applicable yet, but will guard if user data is added).
6. **Zero-Byte Attack**: Submitting empty strings for required titles.
7. **Resource Bloat**: Submitting a 1MB string for a category field.
8. **Type Mismatch**: Sending a boolean for `siteName`.
9. **Relational Orphan**: (Not strictly applicable here as collections are flat).
10. **State Shortcut**: (Not applicable).
11. **Email Spoofing**: Trying to access as `in8460@hanmail.net` but with `email_verified: false`.
12. **Blanket Read Exposure**: (Will enforce secure queries if needed, but here public read is intended for the site).

## Firestore Security Rules Drafting
I'll implement the "Fortress" rules with the "Action-Based" update pattern.
