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
  - [GET : check if a facility is user's favorite](#get--check-if-a-facility-is-users-favorite)
  - [PUT : add a user favorite](#put--add-a-user-favorite)
  - [DELETE : delete a user favorite](#delete--delete-a-user-favorite)
  - [POST : upload a user profile image](#post--upload-a-user-profile-image)
  - [DELETE : delete a user profile image](#delete--delete-a-user-profile-image)
  - [GET : Get My Facilities](#get--get-my-facilities)
  - [POST : Update My Facility](#post--update-my-facility)
  - [DELETE : Delete My Facility](#delete--delete-my-facility)
  - [GET : get posts of all user's favorite facilities](#get--get-posts-of-all-users-favorite-facilities)
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
- update user profile - updatable fields are : `password, email, preferences`
- preferences will be updated by input of list of preferences. This will overwrite all of the user's previous preference settings.

### URL
`/api/users/profile/:id`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | the unique id of the `user` |
| body | password | string | O | the new password of the user, or the existing one if its not to be updated |
| body | email | string | O | the new email of the user, or the existing one if its not to be updated |
| body | preferences | array | - | integer array containing preference `id` |

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

## GET : check if a facility is user's favorite
- check if a certain facility is a user's favorite
- return a boolean flag

### URL
`/api/users/favorite/:user/has/:facility`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | user | int | O | the unique id of the `user` |
| param | facility | int | O | the unique id of the `facility` |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | boolean `True : the user has the facility favorite-d, False : otherwise` |

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
## GET : Get My Facilities

- Get facility by its ID associated with the user

### URL

`/api/users/:id/myfacility`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                   |
| -------- | ---------- | --------- | -------- | ----------------------------- |
| param    | id         | int       | O        | unique ID of the user account |

### Response Format

- HTTP Status Code: `200`

| Key    | Description                            |
| ------ | -------------------------------------- |
| status | `success`                              |
| data   | the returned `facility` object         |

---

## POST : Update My Facility

- Update a facility by its ID associated with the user

### URL

`/api/users/:user/myfacility/:facility`

### Request Format

- Content-Type: `application/json`

| Location | Field Name             | Data Type | Required | Description                           |
| -------- | ---------------------- | --------- | -------- | ------------------------------------- |
| param    | user                   | int       | O        | unique ID of the user account         |
| param    | facility               | int       | O        | unique ID of the facility             |
| body     | name                   | string    | O        | name of the facility                  |
| body     | englishName                   | string    | O        | English name of the facility                  |
| body     | businessId             | string    | O        | business ID of the facility           |
| body     | type                   | string    | O        | type of the facility                  |
| body     | description            | string    | O        | description of the facility           |
| body     | url                    | string    | O        | URL of the facility                   |
| body     | phone                  | string    | O        | phone number of the facility          |
| body     | email                  | string    | O        | email of the facility                 |
| body     | address                | object    | -        | optional address of the facility      |
| body     | openingHours           | array     | -        | optional opening hours of the facility |
| body     | menu                   | array     | -        | optional menu of the facility         |
| body     | preferences            | array     | -        | optional preferences of the facility  |
| body     | stampRuleset           | object    | -        | optional stamp ruleset of the facility |
| body     | stampRuleset.rewards   | array     | -        | optional rewards in the stamp ruleset |

### Response Format

- HTTP Status Code: `200`

| Key    | Description                          |
| ------ | ------------------------------------ |
| status | `success`                            |
| data   | the updated `facility` object        |

### Example Request

```JSON
{
  "name": "Restaurant_01",
  "type": "restaurant",
  "businessId": "B00001",
  "phone": "02-1234-5678",
  "email": "fork350@foodies.com",
  "url": "www.restaurant.com",
  "description": "We serve great foods.",
  "address": {
    "postNumber": "12345",
    "country": "Korea",
    "city": "Seoul",
    "roadAddress": "도로명 주소 01",
    "englishAddress": "eng address 01",
    "lat": 100,
    "lng": 100
  },
  "openingHours": [
    {
      "day": 1,
      "openTime": "09:00",
      "closeTime": "17:00"
    },
    {
      "day": 2,
      "openTime": "09:00",
      "closeTime": "17:00"
    },
    {
      "day": 3,
      "openTime": "09:00",
      "closeTime": "17:00"
    }
  ],
  "menu": [
    {
      "name": "menu_01",
      "description": "menuDesc_01",
      "price": 20000,
      "quantity": "100g"
    },
    {
      "name": "menu_02",
      "description": "menuDesc_02",
      "price": 20000,
      "quantity": "100g"
    }
  ],
  "preferences": [
    1,
    2
  ],
  "stampRuleset": {
    "totalCnt": 100,
    "rewards": [
      {
        "name": "reward_001",
        "cnt": 10
      }
    ]
  }
}
```

---

## DELETE : Delete My Facility

- Delete a facility by its ID associated with the user
- This request will remove the facility entirely from the system DB

### URL

`/api/users/:id/myfacility/:facilityId`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                   |
| -------- | ---------- | --------- | -------- | ----------------------------- |
| param    | id         | int       | O        | unique ID of the user account |
| param    | facilityId | int       | O        | unique ID of the facility     |

### Response Format

- HTTP Status Code: `200`

| Key    | Description                                       |
| ------ | ------------------------------------------------- |
| status | `success`                                         |
| data   | array of the deleted `facility` objects or an empty array if none |

---
## GET : get posts of all user's favorite facilities
- Get all posts of the facilities that a user has marked as favorite in order, most recent first

### URL
`/api/users/favorite/:id/updates`

### Permissions

| userType | Guest | 0 (Admin) | 1 (KAIST) | 2 (Facility) |
| --- | --- | --- | --- | --- |
| Permission | X | O | O | O |

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                |
| -------- | ---------- | --------- | -------- | -------------------------- |
| param    | id         | int       | O        | the unique id of the `user`|

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | ----------- |
| status | `success` |
| data | array of `post` rows from all favorite facilities of the user |


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

