# User API

### Table of Contents

1. [GET users by query](#get--get-users-by-query)
2. [GET user by id](#get--get-user-by-id)
3. [POST create user](#post--create-a-new-user)
4. [PUT update user profile](#put--update-user-profile)
5. [DELETE user](#delete--delete-a-user)

---

## GET : get users by query
- Get users by query
- use without querystring to get ALL users

### URL
`/api/users`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| query | accountId | string | - | the account id of the user. (not to be confused with `id` which is an integer unique identifier) |
| query | type | int | - | type is one of - `0: admin, 1: KAIST user, 2: Facility user` |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | array of `user` rows |

---

## GET : get user by ID
- Get a single user by ID (unique identifier)

### URL
`/api/users/:id`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | the unique id of the `user` |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the returned `user` object |

---

## POST : create a new user
- create a new user

### URL
`/api/users/create`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| body | userId | string | O | the account id of the new user. must satisfy account id constraints, or insert will fail |
| body | password | string | O | the password of the new user. must satisfy password constraints or insert will fail |
| body | userType | string | O | type is one of - `0: admin, 1: KAIST user, 2: Facility user` |
| body | email | string | O | email address of the new user. insert will fail if its not a valid email |

### Response Format
- HTTP Status Code: `201`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the created `user` object |

---

## PUT : update user profile
- update user profile - updatable fields are : `password, email`

### URL
`/api/users/profile/:id`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | the unique id of the `user` |
| body | password | string | O | the new password of the user, or the existing one if its not to be updated |
| body | email | string | O | the new email of the user, or the existing one if its not to be updated |

### Response Format
- HTTP Status Code: `201`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the updated `user` object |

---

## DELETE : delete a user
- delete a user from the system
- deleting the user will result in cascading deletes of certain data
  - `review`

### URL
`/api/users/delete/:id`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | the unique id of the `user` |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the deleted `user` object |

---