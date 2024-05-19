# User API

### Table of Contents

- [User API](#user-api)
  - [GET : get users by query](#get--get-users-by-query)
  - [GET : get user by ID](#get--get-user-by-id)
  - [POST : create a new user](#post--create-a-new-user)
  - [PUT : update user profile](#put--update-user-profile)
  - [DELETE : delete a user](#delete--delete-a-user)
  - [GET : get user preferences](#get--get-user-preferences)
  - [PUT : add a user preference](#put--add-a-user-preference)
  - [DELETE : delete a user preference](#delete--delete-a-user-preference)
  - [GET : get user favorites](#get--get-user-favorites)
  - [PUT : add a user favorite](#put--add-a-user-favorite)
  - [DELETE : delete a user favorite](#delete--delete-a-user-favorite)
  - [POST : upload a user profile image](#post--upload-a-user-profile-image)
  - [DELETE : delete a user profile image](#delete--delete-a-user-profile-image)
- [Preference Methods](#preference-methods)
  - [GET : get all preferences from the system](#get--get-all-preferences-from-the-system)
  - [GET : get preference by preference ID](#get--get-preference-by-preference-id)

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

## GET : get user preferences
- get all preferences of a single user

### URL
`/api/users/preference/:id`

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
| data | the array of `preference` rows |

---

## PUT : add a user preference
- add a preference to a user, given preference ID

### URL
`/api/users/preference/:id`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | the unique id of the `user` |
| body | preferenceId | int | O | the unique id of the `preference` |

### Response Format
- HTTP Status Code: `201`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the created junction object which has keys `{"user_id", "preference_id"}` |

### Notes
- If the preference requested already exists (already is one of user's preferences), then the request will still succeed without returning `data`

---

## DELETE : delete a user preference
- remove a preference of a user, given preference ID

### URL
`/api/users/preference/:id`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | the unique id of the `user` |
| body | preferenceId | int | O | the unique id of the `preference` |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the deleted junction object which has keys `{"user_id", "preference_id"}` |

---

## GET : get user favorites
- get all favorites of a single user

### URL
`/api/users/favorite/:id`

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
| data | the array of `facility` rows |

---

## PUT : add a user favorite
- add a favorite to user, given facility ID

### URL
`/api/users/favorite/:id`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | the unique id of the `user` |
| body | facilityId | int | O | the unique id of the `facility` to be added as a favorite |

### Response Format
- HTTP Status Code: `201`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the created junction object which has keys `{"user_id", "facility_id"}` |

### Notes
- If the facility requested already is one of user's favorites, then the request will still succeed without returning `data`

---

## DELETE : delete a user favorite
- remove a favorite of a user, given facility ID

### URL
`/api/users/favorite/:id`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | the unique id of the `user` |
| body | facilityId | int | O | the unique id of the `facility` |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the deleted junction object which has keys `{"user_id", "facility_id"}` |

---

## POST : upload a user profile image
- upload an image and set it as user profile image.
- if user already had a profile image, it will be replaced.
- `profile_img_uri` column will be updated as the URI of the new profile image

### URL
`/api/users/profile/image/:id`

### Request Format
- Content-Type: `multipart/form-data`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | the unique id of the `user` |
| body - FormData | image | file | O | image file to be uploaded |

### Response Format
- HTTP Status Code: `201`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the updated `user` object |

---

## DELETE : delete a user profile image
- delete a user profile image, and delete the file from the system
- `profile_img_uri` column value will be reset

### URL
`/api/users/profile/image/:id`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | the unique id of the `user` |

### Response Format
- HTTP Status Code: `201`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the updated `user` object |

---

# Preference Methods

---

## GET : get all preferences from the system
- get ALL `preference` rows that are in the database

### URL
`/api/preferences`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| ----- | ----- | ----- | ----- | ----- |
| . | . | . | . | . |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | array of `preference` rows |

---

## GET : get preference by preference ID
- get a single `preference` given preference ID

### URL
`/api/preferences/:id`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | the unique id of the `preference` |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | array of `preference` rows |

