# Authorization API

### Table of Contents

- [Authorization API](#authorization-api)
  - [POST : Log-in](#post--log-in)
  - [POST : Register New User](#post--register-new-user)
  - [POST : Re-send verification mail](#post--re-send-verification-mail)
  - [POST : Verify KAIST user \& complete registration](#post--verify-kaist-user--complete-registration)
  - [POST : Sign-out - Remove user account from the system](#post--sign-out---remove-user-account-from-the-system)
  - [POST : Reset password \& send new password via email](#post--reset-password--send-new-password-via-email)
  - [POST : Refresh client's Access-Token using Refresh-Token](#post--refresh-clients-access-token-using-refresh-token)
  - [POST : Log-out - Destroy User Refresh Token stored in DB](#post--log-out---destroy-user-refresh-token-stored-in-db)

---

## POST : Log-in
- Login to a user account w/ user-ID & password
- The server will generate **2 tokens** for credentials, and also the logged in user's information

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
| message | `"login successful"` |
| data | object containing keys `{ token, refreshToken, user }` |
| data.token | the Bearer-format authorization token. Is in format `"Bearer {MY_TOKEN}"` |
| data.refreshToken | the refresh token. This is not in Bearer format, just regular token |
| data.user | object containing the logged-in user info with keys `{ id, accountId, userType }` The client should store this data, especially `id` to make future API requests |

### Example Response
- HTTP Status Code: `200`

```JSON
{
  "status": "success",
  "data": {
    "token": "Bearer {ACCESS_TOKEN}",
    "refreshToken": "{REFRESH_TOKEN}",
    "user": {
      "id": 1,
      "accountId": "cwwojin",
      "userType": 1
    }
  },
  "message": "login successful"
}
```

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

---

## POST : Reset password & send new password via email
- Reset the requesting user's password and save into DB
- The user is identified by their account-ID
- Send the generated new password to user's saved email

### URL
`/api/auth/reset-password`

### Permissions

| userType | Guest | 0 (Admin) | 1 (KAIST) | 2 (Facility) |
| --- | --- | --- | --- | --- |
| Permission | O | O | X | X |

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| body | userId | string | O | the account-ID of the `user` whose password would be reset |

### Response Format
- HTTP Status Code: `201`

| Key | Description |
| --- | --- |
| status | `success` |
| message | `"Password reset mail sent"` |

### Notes

- The outcome of this request, is the password reset mail being sent to the `user`
- The client may use the same request again to "re-send" the password-reset mail
- The response body will not contain any of the `user` information, such as email


---

## POST : Refresh client's Access-Token using Refresh-Token
- Get a new Access Token using the client user's Refresh Token as key
- This method is called by the client when their **Access Token is Expired**

### URL
`/api/auth/refresh`

### Permissions
- The requesting user must be : an already-logged-in user

| userType | Guest | 0 (Admin) | 1 (KAIST) | 2 (Facility) |
| --- | --- | --- | --- | --- |
| Permission | X | O | O | O |

### Prerequisites

- the prerequisite / condition for calling this request is :
  - a logged-in user's access token is expired
  - a preceding request returned a `401 Unauthorized`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| header | Authorization | string | O | user's `access token in Bearer format`. This is the same header as for ALL other requests. However in this case, the client will send their expired token.  |
| header | Refresh | string | O | user's `refresh token`. This header must be included, and it is for **this request** only. |

### Example Request

```JSON
{
  "headers" :{
    "Authorization": "Bearer {ACCESS_TOKEN}",
    "Refresh": "{REFRESH_TOKEN}",
  }
}
```

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| message | `"access token renewed successfully"` |
| data | object containing keys `{ token, refreshToken, user }` |
| data.token | the NEW access token. It is in format `"Bearer {MY_TOKEN}"` |
| data.refreshToken | the CURRENT refresh token. This is not in Bearer format, just regular token. This is the same value as the one client sent in the header. |
| data.user | object containing the logged-in user info with keys `{ id, accountId, userType }` |

### Example Response
- HTTP Status Code: `200`

```JSON
{
  "status": "success",
  "data": {
    "token": "Bearer {ACCESS_TOKEN}",
    "refreshToken": "{REFRESH_TOKEN}",
    "user": {
      "id": 1,
      "accountId": "cwwojin",
      "userType": 1
    }
  },
  "message": "access token renewed successfully"
}
```

### Response Format - Token Refresh Error / Failure

- HTTP Status Code: `401`

| Key | Description |
| --- | --- |
| status | `error` |
| message | `"refresh token validation failed. Please login again"` |
| data | the `error` object |

### Example Response - Token Refresh Error / Failure

- HTTP Status Code: `401`

```JSON
{
  "status": "error",
  "message": "refresh token validation failed. Please login again",
  "data": {
    "status": 401,
    "message": "refresh token validation failed. Please login again"
  }
}
```


### Notes

- This request will NOT generate a new refresh token. The previous expiration time still holds
- If this request returns a `401` (in any case), then it means either
  - Refresh token is missing, invalid, or expired
  - Any other authentication / authorization failure
- So, in case of `401` the client must set to **logged-out** state & ask the user to login again.

---

## POST : Log-out - Destroy User Refresh Token stored in DB

- This method should be called when the user attempts to log-out of their session
- Since refresh token is stored in DB, the server must delete it to ensure user is logged out & not accessible before re-login

### URL
`/api/auth/logout`

### Permissions
- The requesting user must be : an already-logged-in user

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
| message | `"logout successful"` |

### Notes

- Log-out process should be handled in the client-side as :
  - client deletes both the Access Token & Refresh Token from local storage
  - client calls this method, to delete the stored Refresh Token from DB

