# Authorization API

### Table of Contents

- [Authorization API](#authorization-api)
  - [POST : Log-in](#post--log-in)
  - [POST : Register New User](#post--register-new-user)
  - [POST : Re-send verification mail](#post--re-send-verification-mail)
  - [POST : Verify KAIST user \& complete registration](#post--verify-kaist-user--complete-registration)
  - [POST : Sign-out - Remove user account from the system](#post--sign-out---remove-user-account-from-the-system)

---

## POST : Log-in
- Login to a user account w/ user-ID & password

### URL
`/api/auth/login`

### Permissions

| userType | Guest | 0 (Admin) | 1 (KAIST) | 2 (Facility) |
| --- | --- | --- | --- | --- |
| Permission | O | O | X | X |

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| body | userId | string | O | account id of the `user` |
| body | password | string | O | password of the `user` |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | object containing keys `token, user` |
| data.token | the Bearer-format authorization token. Is in format `"Bearer {MY_TOKEN}"` |
| data.user | the logged-ing user information `id, accountId, userType` |

---

## POST : Register New User
- Register a new user
- Allowed user types are only KAIST(1) & Facility(2)

### URL
`/api/auth/register`

### Permissions

| userType | Guest | 0 (Admin) | 1 (KAIST) | 2 (Facility) |
| --- | --- | --- | --- | --- |
| Permission | O | O | X | X |

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| body | userId | string | O | account id of the registering `user` |
| body | password | string | O | password of the registering `user` |
| body | userType | int | O | allowed types are `1=KAIST, 2=facility` |
| body | email | string | O | the email of the registering `user` KAIST user's should have a valid KAIST email `@kaist.ac.kr` |

### Response Format
- HTTP Status Code: `201`

| Key | Description |
| --- | --- |
| status | `success` |
| data | object containing registering user's information |
| data.type | either `1=KAIST, 2=facility` |
| data.user | In case of Facility user, the inserted object `user`. In case of KAIST user, the `id (id in pending_kaist_user table), account_id(same as input)` | 

### Notes
- For KAIST User, this method will send verification mail & return partial info
  - a 6-digit code is sent
  - Registration is complete after email verfication
- For Facility User, this method will insert the new user directly & return their info

---

## POST : Re-send verification mail
- Re-send verification mail to the registering KAIST user's email
- Previously sent verification code(s) will be invalidated

### URL
`/api/auth/resend-verification-mail`

### Permissions

| userType | Guest | 0 (Admin) | 1 (KAIST) | 2 (Facility) |
| --- | --- | --- | --- | --- |
| Permission | O | O | X | X |

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| body | userId | string | O | the account id of the registering KAIST `user` |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| message | `"verification code sent to ${EMAIL_ADDRESS}"` |

### Notes
- This request should be sent containing the user-ID of the KAIST user who is trying to register.

---

## POST : Verify KAIST user & complete registration
- Verify the 6-digit code sent in the verification mail
- If success, insert the pending KAIST user into DB and return user info

### URL
`/api/auth/verify-kaist`

### Permissions

| userType | Guest | 0 (Admin) | 1 (KAIST) | 2 (Facility) |
| --- | --- | --- | --- | --- |
| Permission | O | O | X | X |

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| body | userId | string | O | the account id of the registering KAIST `user` |
| body | code | string | O | the 6-digit verification code |

### Response Format
- HTTP Status Code: `201`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the created `user` object |

---

## POST : Sign-out - Remove user account from the system
- Sign out from my account, deleting it from the FORK database
- Server will identify the requesting user from header value `id`

### URL
`/api/auth/sign-out`

### Permissions

| userType | Guest | 0 (Admin) | 1 (KAIST) | 2 (Facility) |
| --- | --- | --- | --- | --- |
| Permission | X | O | O | O |

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| . | . | . | . | . |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the deleted `user` object |

### Notes

- Client doesn't have to explicitly add user `id` in the request