# Facility API

### Table of Contents

- [Facility API](#facility-api)
  - [GET : get facilities](#get--get-facilities)
  - [GET : get facility by ID](#get--get-facility-by-id)
  - [POST : create a new facility](#post--create-a-new-facility)
  - [PUT : update a facility](#put--update-a-facility)
  - [DELETE : delete a facility](#delete--delete-a-facility)
  - [GET : get address by facility ID](#get--get-address-by-facility-id)
  - [POST : add or update address for a facility](#post--add-or-update-address-for-a-facility)
  - [DELETE : delete address for a facility](#delete--delete-address-for-a-facility)
  - [GET : get opening hours for a facility](#get--get-opening-hours-for-a-facility)
  - [POST : add opening hours for a facility](#post--add-opening-hours-for-a-facility)
  - [DELETE : delete opening hours for a facility](#delete--delete-opening-hours-for-a-facility)
  - [GET : get menu for a facility](#get--get-menu-for-a-facility)
  - [GET : get menu item by ID](#get--get-menu-item-by-id)
  - [POST : create menu for a facility](#post--create-menu-for-a-facility)
  - [PUT : update menu item by ID](#put--update-menu-item-by-id)
  - [DELETE : delete menu item by ID](#delete--delete-menu-item-by-id)
  - [GET : get all posts by facility ID](#get--get-all-posts-by-facility-id)
  - [GET : get post by ID](#get--get-post-by-id)
  - [POST : create a new post for a facility](#post--create-a-new-post-for-a-facility)
  - [PUT : update a post by ID](#put--update-a-post-by-id)
  - [DELETE : delete a post by ID](#delete--delete-a-post-by-id)
  - [GET : get stamp ruleset rewards by facility ID](#get--get-stamp-ruleset-rewards-by-facility-id)
  - [POST : create stamp ruleset](#post--create-stamp-ruleset)
  - [PUT : update existing stamp ruleset](#put--update-existing-stamp-ruleset)
  - [POST : add stamp reward](#post--add-stamp-reward)
  - [PUT : update stamp reward by ID](#put--update-stamp-reward-by-id)
  - [DELETE : delete stamp reward by ID](#delete--delete-stamp-reward-by-id)
  - [GET : get preferences by facility ID](#get--get-preferences-by-facility-id)
  - [POST : add a preference to a facility](#post--add-a-preference-to-a-facility)
  - [DELETE : delete a preference from a facility](#delete--delete-a-preference-from-a-facility)
  - [POST : upload a facility profile image](#post--upload-a-facility-profile-image)
  - [DELETE : delete a facility profile image](#delete--delete-a-facility-profile-image)
  - [POST : upload stamp logo image](#post--upload-stamp-logo-image)
  - [DELETE : delete stamp logo image](#delete--delete-stamp-logo-image)
  - [POST : upload menu image](#post--upload-menu-image)
  - [DELETE : delete menu image](#delete--delete-menu-image)
  - [GET : Get list of trending facilities](#get--get-list-of-trending-facilities)
  - [GET : Get list of newest facilities](#get--get-list-of-newest-facilities)
  - [POST : send facility registration request to admin to create facility](#post--send-facility-registration-request-to-admin-to-create-facility)


---

## GET : get facilities

- Retrieve all facilities

### URL

`/api/facilities/`

### Request Format

- Content-Type: `application/json`

### Response Format

- HTTP Status Code: `200`

| Key    | Description                 |
| ------ | --------------------------- |
| status | `success`                   |
| data   | array of `facility` objects |

---

## GET : get facility by ID

- Retrieve a facility by its ID

### URL

`/api/facilities/:id`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                 |
| -------- | ---------- | --------- | -------- | --------------------------- |
| param    | id         | int       | O        | unique ID of the `facility` |

### Response Format

- HTTP Status Code: `200`

| Key    | Description                    |
| ------ | ------------------------------ |
| status | `success`                      |
| data   | the returned `facility` object |

---

## POST : create a new facility

- Create a new facility

### URL

`/api/facilities/`

### Request Format

- Content-Type: `application/json`

| Location | Field Name             | Data Type | Required | Description                       |
| -------- | ---------------------- | --------- | -------- | --------------------------------- |
| body     | name                   | string    | O        | name of the facility              |
| body     | englishName                   | string    | O        | English name of the facility              |
| body     | businessId             | string    | O        | business ID of the facility       |
| body     | type                   | string    | O        | type of the facility              |
| body     | description            | string    | O        | description of the facility       |
| body     | url                    | string    | O        | URL of the facility               |
| body     | phone                  | string    | O        | phone number of the facility      |
| body     | email                  | string    | O        | email of the facility             |
| body     | profileImgUri          | string    | O        | profile image URI of the facility |
| body     | address.postNumber     | string    | O        | post number of the facility       |
| body     | address.country        | string    | O        | country of the facility           |
| body     | address.city           | string    | O        | city of the facility              |
| body     | address.roadAddress    | string    | O        | road address of the facility      |
| body     | address.jibunAddress   | string    | O        | jibun address of the facility     |
| body     | address.englishAddress | string    | O        | English address of the facility   |
| body     | address.lat            | float     | O        | latitude of the facility          |
| body     | address.lng            | float     | O        | longitude of the facility         |

### Response Format

- HTTP Status Code: `201`

| Key    | Description                   |
| ------ | ----------------------------- |
| status | `success`                     |
| data   | the created `facility` object |

---

## PUT : update a facility

- Update a facility by its ID

### URL

`/api/facilities/:id`

### Request Format

- Content-Type: `application/json`

| Location | Field Name             | Data Type | Required | Description                       |
| -------- | ---------------------- | --------- | -------- | --------------------------------- |
| param    | id                     | int       | O        | unique ID of the `facility`       |
| body     | name                   | string    | O        | name of the facility              |
| body     | englishName                   | string    | O        | English name of the facility              |
| body     | businessId             | string    | O        | business ID of the facility       |
| body     | type                   | string    | O        | type of the facility              |
| body     | description            | string    | O        | description of the facility       |
| body     | url                    | string    | O        | URL of the facility               |
| body     | phone                  | string    | O        | phone number of the facility      |
| body     | email                  | string    | O        | email of the facility             |
| body     | profileImgUri          | string    | O        | profile image URI of the facility |
| body     | address.postNumber     | string    | O        | post number of the facility       |
| body     | address.country        | string    | O        | country of the facility           |
| body     | address.city           | string    | O        | city of the facility              |
| body     | address.roadAddress    | string    | O        | road address of the facility      |
| body     | address.jibunAddress   | string    | O        | jibun address of the facility     |
| body     | address.englishAddress | string    | O        | English address of the facility   |
| body     | address.lat            | float     | O        | latitude of the facility          |
| body     | address.lng            | float     | O        | longitude of the facility         |

### Response Format

- HTTP Status Code: `200`

| Key    | Description                   |
| ------ | ----------------------------- |
| status | `success`                     |
| data   | the updated `facility` object |

---

## DELETE : delete a facility

- Delete a facility by its ID

### URL

`/api/facilities/:id`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                 |
| -------- | ---------- | --------- | -------- | --------------------------- |
| param    | id         | int       | O        | unique ID of the `facility` |

### Response Format

- HTTP Status Code: `200`

| Key    | Description                                                       |
| ------ | ----------------------------------------------------------------- |
| status | `success`                                                         |
| data   | array of the deleted `facility` objects or an empty array if none |

---

## GET : get address by facility ID

- Retrieve address for a facility by its ID

### URL

`/api/facilities/:facilityId/address`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                 |
| -------- | ---------- | --------- | -------- | --------------------------- |
| param    | facilityId | int       | O        | unique ID of the `facility` |

### Response Format

- HTTP Status Code: `200`

| Key    | Description                   |
| ------ | ----------------------------- |
| status | `success`                     |
| data   | the returned `address` object |

---

## POST : add or update address for a facility

- Add or update address for a facility

### URL

`/api/facilities/:facilityId/address`

### Request Format

- Content-Type: `application/json`

| Location | Field Name     | Data Type | Required | Description                     |
| -------- | -------------- | --------- | -------- | ------------------------------- |
| param    | facilityId     | int       | O        | unique ID of the `facility`     |
| body     | postNumber     | string    | O        | post number of the facility     |
| body     | country        | string    | O        | country of the facility         |
| body     | city           | string    | O        | city of the facility            |
| body     | roadAddress    | string    | O        | road address of the facility    |
| body     | jibunAddress   | string    | O        | jibun address of the facility   |
| body     | englishAddress | string    | O        | English address of the facility |
| body     | lat            | float     | O        | latitude of the facility        |
| body     | lng            | float     | O        | longitude of the facility       |

### Response Format

- HTTP Status Code: `201`

| Key    | Description                             |
| ------ | --------------------------------------- |
| status | `success`                               |
| data   | the created or updated `address` object |

---

## DELETE : delete address for a facility

- Delete address for a facility by its ID

### URL

`/api/facilities/:facilityId/address`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                 |
| -------- | ---------- | --------- | -------- | --------------------------- |
| param    | facilityId | int       | O        | unique ID of the `facility` |

### Response Format

- HTTP Status Code: `200`

| Key    | Description                                                      |
| ------ | ---------------------------------------------------------------- |
| status | `success`                                                        |
| data   | array of the deleted `address` objects or an empty array if none |

---

## GET : get opening hours for a facility

- Retrieve opening hours for a facility by its ID

### URL

`/api/facilities/:facilityId/opening-hours`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                 |
| -------- | ---------- | --------- | -------- | --------------------------- |
| param    | facilityId | int       | O        | unique ID of the `facility` |

### Response Format

- HTTP Status Code: `200`

| Key    | Description                      |
| ------ | -------------------------------- |
| status | `success`                        |
| data   | array of `opening hours` objects |

---

## POST : add opening hours for a facility

- Add opening hours for a facility

### URL

`/api/facilities/:facilityId/opening-hours`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                             |
| -------- | ---------- | --------- | -------- | --------------------------------------- |
| param    | facilityId | int       | O        | unique ID of the `facility`             |
| body     | day        | int       | O        | day of the week (0-6, where 0 = Sunday) |
| body     | openTime   | string    | O        | opening time (HH:MM:SS)                 |
| body     | closeTime  | string    | O        | closing time (HH:MM:SS)                 |

### Response Format

- HTTP Status Code: `201`

| Key    | Description                                |
| ------ | ------------------------------------------ |
| status | `success`                                  |
| data   | array of the added `opening hours` objects |

---

## DELETE : delete opening hours for a facility

- Delete opening hours for a facility by its ID

### URL

`/api/facilities/:facilityId/opening-hours`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                 |
| -------- | ---------- | --------- | -------- | --------------------------- |
| param    | facilityId | int       | O        | unique ID of the `facility` |

### Response Format

- HTTP Status Code: `200`

| Key    | Description                                                            |
| ------ | ---------------------------------------------------------------------- |
| status | `success`                                                              |
| data   | array of the deleted `opening hours` objects or an empty array if none |

---

## GET : get menu for a facility

- Retrieve menu for a facility by its ID

### URL

`/api/facilities/:facilityId/menu`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                 |
| -------- | ---------- | --------- | -------- | --------------------------- |
| param    | facilityId | int       | O        | unique ID of the `facility` |

### Response Format

- HTTP Status Code: `200`

| Key    | Description             |
| ------ | ----------------------- |
| status | `success`               |
| data   | array of `menu` objects |

---

## GET : get menu item by ID

- Retrieve menu item by its ID

### URL

`/api/facilities/:facilityId/menu/:menuId`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                 |
| -------- | ---------- | --------- | -------- | --------------------------- |
| param    | facilityId | int       | O        | unique ID of the `facility` |
| param    | menuId     | int       | O        | unique ID of the `menu`     |

### Response Format

- HTTP Status Code: `200`

| Key    | Description                     |
| ------ | ------------------------------- |
| status | `success`                       |
| data   | the returned `menu item` object |

---

## POST : create menu for a facility

- Create menu for a facility

### URL

`/api/facilities/:facilityId/menu`

### Request Format

- Content-Type: `application/json`

| Location | Field Name  | Data Type | Required | Description                  |
| -------- | ----------- | --------- | -------- | ---------------------------- |
| param    | facilityId  | int       | O        | unique ID of the `facility`  |
| body     | name        | string    | O        | name of the menu item        |
| body     | description | string    | O        | description of the menu item |
| body     | price       | float     | O        | price of the menu item       |
| body     | quantity    | int       | O        | quantity of the menu item    |

### Response Format

- HTTP Status Code: `201`

| Key    | Description                         |
| ------ | ----------------------------------- |
| status | `success`                           |
| data   | array of the created `menu` objects |

---

## PUT : update menu item by ID

- Update a menu item by its ID

### URL

`/api/facilities/:facilityId/menu/:menuId`

### Request Format

- Content-Type: `application/json`

| Location | Field Name  | Data Type | Required | Description                  |
| -------- | ----------- | --------- | -------- | ---------------------------- |
| param    | facilityId  | int       | O        | unique ID of the `facility`  |
| param    | menuId      | int       | O        | unique ID of the `menu`      |
| body     | name        | string    | O        | name of the menu item        |
| body     | description | string    | O        | description of the menu item |
| body     | price       | float     | O        | price of the menu item       |
| body     | quantity    | int       | O        | quantity of the menu item    |

### Response Format

- HTTP Status Code: `200`

| Key    | Description                    |
| ------ | ------------------------------ |
| status | `success`                      |
| data   | the updated `menu item` object |

---

## DELETE : delete menu item by ID

- Delete a menu item by its ID

### URL

`/api/facilities/:facilityId/menu/:menuId`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                 |
| -------- | ---------- | --------- | -------- | --------------------------- |
| param    | facilityId | int       | O        | unique ID of the `facility` |
| param    | menuId     | int       | O        | unique ID of the `menu`     |

### Response Format

- HTTP Status Code: `200`

| Key    | Description                                                        |
| ------ | ------------------------------------------------------------------ |
| status | `success`                                                          |
| data   | array of the deleted `menu item` objects or an empty array if none |

---

## GET : get all posts by facility ID

- Retrieve all posts by facility ID

### URL

`/api/facilities/:facilityId/post`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                 |
| -------- | ---------- | --------- | -------- | --------------------------- |
| param    | facilityId | int       | O        | unique ID of the `facility` |

### Response Format

- HTTP Status Code: `200`

| Key    | Description             |
| ------ | ----------------------- |
| status | `success`               |
| data   | array of `post` objects |

---

## GET : get post by ID

- Retrieve a post by its ID

### URL

`/api/facilities/:facilityId/post/:postId`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                 |
| -------- | ---------- | --------- | -------- | --------------------------- |
| param    | facilityId | int       | O        | unique ID of the `facility` |
| param    | postId     | int       | O        | unique ID of the `post`     |

### Response Format

- HTTP Status Code: `200`

| Key    | Description                |
| ------ | -------------------------- |
| status | `success`                  |
| data   | the returned `post` object |

---

## POST : create a new post for a facility

- Create a new post for a facility
- a post can contain up to 1 image attachment
- Content moderation will be performed on the uploaded text & image

### URL

`/api/facilities/:facilityId/post`

### Request Format

- Content-Type: `multipart/form-data`

| Location | Field Name | Data Type | Required | Description                 |
| -------- | ---------- | --------- | -------- | --------------------------- |
| param    | facilityId | int       | O        | unique ID of the `facility` |
| body     | authorId   | int       | O        | ID of the post author       |
| body     | title      | string    | O        | title of the post           |
| body     | content    | string    | O        | content of the post         |
| body - FormData | image | file | - | the image file to be uploaded |

### Response Format

- HTTP Status Code: `201`

| Key    | Description               |
| ------ | ------------------------- |
| status | `success`                 |
| data   | the created `post` object |

### Response Format - Moderation / Harmful Content Detected

- HTTP Status Code: `499`

| Key | Description |
| --- | --- |
| status | `error` |
| message | `"post upload failed due to harmful content detected"` |
| data | object containing content moderation result `{ status, message, image, text }` keys `image, text` include data & scores for each moderation result. |

### Example Response - Moderation

- HTTP Status Code: `499`

```JSON
{
  "status": "error",
  "message": "facility post upload failed due to harmful content detected",
  "data": {
    "status": 499,
    "message": "facility post upload failed due to harmful content detected",
    "text": {
      "result": true,
      "data": {
        "sexual": 0.09,
        "discriminatory": 0.08,
        "insulting": 0.86,
        "violent": 0.04,
        "toxic": 0.87
      }
    },
    "image": {
      "result": true,
      "data": {
        "nudity": 0.030000000000000027,
        "offensive": 0.89,
        "gore": 0.01,
        "textProfanity": []
      }
    }
  }
}
```

### Notes
- For content moderation, the method will return an ERROR if moderation fails / harmful content is detected.
- we use a custom HTTP code to indicate this specific error case `499` in order to allow simple client-side error handling.

---

## PUT : update a post by ID

- Update a post by its ID

### URL

`/api/facilities/:facilityId/post/:postId`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                 |
| -------- | ---------- | --------- | -------- | --------------------------- |
| param    | facilityId | int       | O        | unique ID of the `facility` |
| param    | postId     | int       | O        | unique ID of the `post`     |
| body     | title      | string    | O        | title of the post           |
| body     | content    | string    | O        | content of the post         |

### Response Format

- HTTP Status Code: `200`

| Key    | Description               |
| ------ | ------------------------- |
| status | `success`                 |
| data   | the updated `post` object |

---

## DELETE : delete a post by ID

- Delete a post by its ID

### URL

`/api/facilities/:facilityId/post/:postId`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                 |
| -------- | ---------- | --------- | -------- | --------------------------- |
| param    | facilityId | int       | O        | unique ID of the `facility` |
| param    | postId     | int       | O        | unique ID of the `post`     |

### Response Format

- HTTP Status Code: `200`

| Key    | Description                                                   |
| ------ | ------------------------------------------------------------- |
| status | `success`                                                     |
| data   | array of the deleted `post` objects or an empty array if none |

---

## GET : get stamp ruleset rewards by facility ID

- Retrieve stamp ruleset rewards by facility ID

### URL

`/api/facilities/:facilityId/stamp-ruleset`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                 |
| -------- | ---------- | --------- | -------- | --------------------------- |
| param    | facilityId | int       | O        | unique ID of the `facility` |

### Response Format

- HTTP Status Code: `200`

| Key    | Description                                 |
| ------ | ------------------------------------------- |
| status | `success`                                   |
| data   | the returned `stamp ruleset rewards` object |

---

## POST : create stamp ruleset

- Create a new stamp ruleset

### URL

`/api/facilities/:facilityId/stamp-ruleset`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                            |
| -------- | ---------- | --------- | -------- | -------------------------------------- |
| param    | facilityId | int       | O        | unique ID of the `facility`            |
| body     | logoImgUri | string    | O        | logo image URI of the stamp ruleset    |
| body     | totalCnt   | int       | O        | total count of the stamp ruleset       |
| body     | rewards    | array     | O        | array of rewards for the stamp ruleset |

### Response Format

- HTTP Status Code: `201`

| Key    | Description                        |
| ------ | ---------------------------------- |
| status | `success`                          |
| data   | the created `stamp ruleset` object |

---

## PUT : update existing stamp ruleset

- Update an existing stamp ruleset

### URL

`/api/facilities/:facilityId/stamp-ruleset`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                      |
| -------- | ---------- | --------- | -------- | -------------------------------- |
| param    | facilityId | int       | O        | unique ID of the `facility`      |
| body     | totalCnt   | int       | O        | total count of the stamp ruleset |

### Response Format

- HTTP Status Code: `200`

| Key    | Description                        |
| ------ | ---------------------------------- |
| status | `success`                          |
| data   | the updated `stamp ruleset` object |

---

## POST : add stamp reward

- Add a new stamp reward

### URL

`/api/facilities/:facilityId/stamp-rewards`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                 |
| -------- | ---------- | --------- | -------- | --------------------------- |
| param    | facilityId | int       | O        | unique ID of the `facility` |
| body     | cnt        | int       | O        | count of the stamp reward   |
| body     | name       | string    | O        | name of the stamp reward    |

### Response Format

- HTTP Status Code: `201`

| Key    | Description                       |
| ------ | --------------------------------- |
| status | `success`                         |
| data   | the created `stamp reward` object |

---

## PUT : update stamp reward by ID

- Update a stamp reward by its ID

### URL

`/api/facilities/:facilityId/stamp-rewards/:rewardId`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                 |
| -------- | ---------- | --------- | -------- | --------------------------- |
| param    | facilityId | int       | O        | unique ID of the `facility` |
| param    | rewardId   | int       | O        | unique ID of the `reward`   |
| body     | cnt        | int       | O        | count of the stamp reward   |
| body     | name       | string    | O        | name of the stamp reward    |

### Response Format

- HTTP Status Code: `200`

| Key    | Description                       |
| ------ | --------------------------------- |
| status | `success`                         |
| data   | the updated `stamp reward` object |

---

## DELETE : delete stamp reward by ID

- Delete a stamp reward by its ID

### URL

`/api/facilities/:facilityId/stamp-rewards/:rewardId`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                 |
| -------- | ---------- | --------- | -------- | --------------------------- |
| param    | facilityId | int       | O        | unique ID of the `facility` |
| param    | rewardId   | int       | O        | unique ID of the `reward`   |

### Response Format

- HTTP Status Code: `200`

| Key    | Description                                                           |
| ------ | --------------------------------------------------------------------- |
| status | `success`                                                             |
| data   | array of the deleted `stamp reward` objects or an empty array if none |

---

## GET : get preferences by facility ID

- Retrieve preferences by facility ID

### URL

`/api/facilities/:facilityId/preferences`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                 |
| -------- | ---------- | --------- | -------- | --------------------------- |
| param    | facilityId | int       | O        | unique ID of the `facility` |

### Response Format

- HTTP Status Code: `200`

| Key    | Description                    |
| ------ | ------------------------------ |
| status | `success`                      |
| data   | array of `preferences` objects |

---

## POST : add a preference to a facility

- Add a new preference to a facility

### URL

`/api/facilities/:facilityId/preferences`

### Request Format

- Content-Type: `application/json`

| Location | Field Name   | Data Type | Required | Description                   |
| -------- | ------------ | --------- | -------- | ----------------------------- |
| param    | facilityId   | int       | O        | unique ID of the `facility`   |
| body     | preferenceId | int       | O        | unique ID of the `preference` |

### Response Format

- HTTP Status Code: `201`

| Key    | Description                              |
| ------ | ---------------------------------------- |
| status | `success`                                |
| data   | the created `facility preference` object |

---

## DELETE : delete a preference from a facility

- Delete a preference from a facility by its ID

### URL

`/api/facilities/:facilityId/preferences/:preferenceId`

### Request Format

- Content-Type: `application/json`

| Location | Field Name   | Data Type | Required | Description                   |
| -------- | ------------ | --------- | -------- | ----------------------------- |
| param    | facilityId   | int       | O        | unique ID of the `facility`   |
| param    | preferenceId | int       | O        | unique ID of the `preference` |

### Response Format

- HTTP Status Code: `200`

| Key    | Description                                                                  |
| ------ | ---------------------------------------------------------------------------- |
| status | `success`                                                                    |
| data   | array of the deleted `facility preference` objects or an empty array if none |

---

## POST : upload a facility profile image

- upload a profile image for a facility
- If there is and existing profile image, this will replace it

### URL

`/api/facilities/:id/profile/image`

### Request Format
- Content-Type: `multipart/form-data`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | the unique id of the `facility` |
| body - FormData | image | file | O | image file to be uploaded |

### Response Format
- HTTP Status Code: `201`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the updated `facility` object |

---

## DELETE : delete a facility profile image

- delete a facility profile image

### URL

`/api/facilities/:id/profile/image`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | the unique id of the `facility` |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the updated `facility` object |

---

## POST : upload stamp logo image

- upload a stamp logo image for a facility
- this image will be displayed alongside the stamp ruleset / settings

### URL

`/api/facilities/:id/stamp-ruleset/logo`

### Request Format
- Content-Type: `multipart/form-data`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | the unique id of the `facility` |
| body - FormData | image | file | O | image file to be uploaded |

### Response Format
- HTTP Status Code: `201`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the updated `stamp_ruleset` object |

---

## DELETE : delete stamp logo image

- delete the stamp logo image of a facility

### URL

`/api/facilities/:id/stamp-ruleset/logo`

### Request Format
- Content-Type : `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | the unique id of the `facility` |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the updated `stamp_ruleset` object |

---

## POST : upload menu image

- upload a menu image for a single menu item
- if there is an existing menu image, this will replace it

### URL

`/api/facilities/:facilityId/menu/:menuId/image`

### Request Format
- Content-Type : `multipart/form-data`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | facilityId | int | O | the unique id of the `facility` |
| param | menuId | int | O | the unique id of the `menu` |
| body - FormData | image | file | O | image file to be uploaded |

### Response Format
- HTTP Status Code: `201`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the updated `menu` object |

---

## DELETE : delete menu image

- delete the menu image of a menu item

### URL

`/api/facilities/:facilityId/menu/:menuId/image`

### Request Format
- Content-Type : `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | facilityId | int | O | the unique id of the `facility` |
| param | menuId | int | O | the unique id of the `menu` |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the updated `menu` object |

---

## GET : Get list of trending facilities
- get list of trending facilities
- also filter by preferences using query parameters
- result contains only facilities that have at least 1 review

### URL

`/api/facilities/leaderboard/trending`

### Permissions

| userType | Guest | 0 (Admin) | 1 (KAIST) | 2 (Facility) |
| --- | --- | --- | --- | --- |
| Permission | O | O | O | O |

### Request Format
- Content-Type : `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| query | limit | int | O | limit number of result rows to `limit` |
| query | preferences | array | - | comma-seperated array of `preference.id` (integer). If provided, then search for facilities that contain at least one of the preferences queried |

### Example Request URL
`http://{BASE_URL}/api/facilities/leaderboard/trending?limit=5&preferences=1,2,3`

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | array of `pin` rows |

### Notes
- This method will return facility data in `pin` format, which is the same as results in [map API](./map.md)
- Includes `name, address, preferences, opening_hours, etc.`

---

## GET : Get list of newest facilities
- get list of newest facilities, ordered by `created_at` column in DB

### URL

`/api/facilities/leaderboard/newest`

### Permissions

| userType | Guest | 0 (Admin) | 1 (KAIST) | 2 (Facility) |
| --- | --- | --- | --- | --- |
| Permission | O | O | O | O |

### Request Format
- Content-Type : `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| query | limit | int | O | limit number of result rows to `limit` |

### Example Request URL
`http://{BASE_URL}/api/facilities/leaderboard/newest?limit=5`

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | array of `pin` rows |

### Notes
- This method will return facility data in `pin` format, which is the same as results in [map API](./map.md)
- Includes `name, address, preferences, opening_hours, etc.`

---

## POST : send facility registration request to admin to create facility

- Send a facility registration request to admin
- Attach multiple images that should be included in the facility profile (optional)
  - Images include : `1. Facility Profile Image (1), 2. Menu Images (1 per menu) 3. Stamp Logo Image (1)`
  - All uploaded images will be viewable after the facilty has been accepted and registered into FORK.

### URL

`/api/facilities/facility-requests`

---

### Request Format

- Content-Type: `multipart/form-data`

| Location | Field Name               | Data Type | Required | Description                                    |
| -------- | ------------------------ | --------- | -------- | -----------------------------------------------|
| body     | images                   | array of files (FormData) | - | The array of image files to be uploaded. This field is optional |
| body     | authorId                 | int       | O        | unique ID of the author of the request         |
| body     | title                    | string    | O        | title of the facility registration request     |
| body     | content                  | JSON-string    | O | the content of the facility registration request, which is an object containing all necessary & optional information for the `facility` the entire field should be wrapped as JSON-string |

### Request Format : Content

- the `content` field of this request body is an object wrapped as JSON-string `use JSON.stringify()`
- this section covers the included keys of the `content`

| Location | Field Name               | Data Type | Required | Description                                    |
| -------- | ------------------------ | --------- | -------- | -----------------------------------------------|
| body     | content.name             | string    | O        | name of the facility                           |
| body     | content.englishName             | string    | O        | English name of the facility                           |
| body     | content.type             | string    | O        | type of the facility                           |
| body     | content.businessId       | string    | O        | business ID of the facility                    |
| body     | content.phone            | string    | O        | phone number of the facility                   |
| body     | content.email            | string    | O        | email of the facility                          |
| body     | content.url              | string    | O        | URL of the facility                            |
| body     | content.description      | string    | O        | description of the facility                    |
| body     | content.profileImgFile   | string    | O        | the BASE-NAME of the uploaded file for the facilty profile image `(ex. "Image_001.png")` |
| body     | content.address          | object    | O        | address of the facility                        |
| body     | content.openingHours     | array     | -        | opening hours of the facility (optional)       |
| body     | content.menu             | array     | -        | menu items of the facility (optional)          |
| body     | content.preferences      | array     | -        | preferences of the facility (optional)         |
| body     | content.stampRuleset     | object    | -        | stamp ruleset of the facility (optional)       |
| body     | content.stampRuleset.rewards     | array    | -        | array of `stamp reward` elements (optional)       |

### Request Format : Content - menu (array element)

| Location | Field Name               | Data Type | Required | Description                                    |
| -------- | ------------------------ | --------- | -------- | -----------------------------------------------|
| body | content.menu.*.name | string | O | the name of the `menu` |
| body | content.menu.*.description | string | O | the description of the `menu` |
| body | content.menu.*.price | int | O | the price of the `menu` item |
| body | content.menu.*.quantity | string | O | the quantity per serving of the `menu` item, in (g) or (mL) `(ex. 200g)` |
| body | content.menu.*.imgFile | string | - | the BASE-NAME of the uploaded file for the image for this particular `menu` item `(ex. "Image_001.png")` |

### Request Format : Content - stampRuleset

| Location | Field Name               | Data Type | Required | Description                                    |
| -------- | ------------------------ | --------- | -------- | -----------------------------------------------|
| body | content.stampRuleset.totalCnt | int | O | the total-count of the `stamp_ruleset` the total-count refers to the MAX amount of stamps collectable by a KAIST user |
| body | content.stampRuleset.logoImgFile | string | - | the BASE-NAME of the uploaded file for the stamps logo image `(ex. "Image_001.png")` |
| body     | content.stampRuleset.rewards     | array    | -        | array of `stamp reward` elements (optional)       |

---

### Response Format

- HTTP Status Code: `201`

| Key    | Description                                      |
| ------ | ------------------------------------------------ |
| status | `success`                                        |
| data   | the created `facility registration request` object |

### Notes
- Attached images are all optional. If there are no images, exclude the field or have empty array.
- Image files in the `images` field should match the file base-names saved in the `content` field `ex. profileImgFile` If not, the image won't be saved even if facility is registered into the system
- If some of the images fail to upload, only the uploaded images will be saved when facility is registered into the system

### Example Request
- In this example, the field `images` is excluded

```JSON
{
  "authorId": 2,
  "title" : "Hello FORK!",
  "content" : JSON.Stringify({
    "name":"Restaurant_01", 
    "englishName":"Restaurant_01",
    "type":"restaurant", 
    "businessId":"B00001", 
    "phone":"02-1234-5678", 
    "email":"fork350@foodies.com", 
    "url":"www.restaurant.com", 
    "description":"We serve great foods.", 
    "profileImgFile": "facility_img_01.png", 
    "address": { 
      "postNumber":"12345", 
      "country":"Korea", 
      "city":"Seoul", 
      "roadAddress":"도로명 주소 01", 
      "englishAddress":"eng address 01", 
      "lat":100.00, 
      "lng":100.00
    }, 
    "openingHours":[
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
    "menu":[ 
      {
        "name": "menu_01", 
        "description": "menuDesc_01", 
        "price": 20000, 
        "quantity": "100g", 
        "imgFile": "menu_img_01.png" 
      }, 
      { 
        "name": "menu_02", 
        "description": "menuDesc_02", 
        "price": 20000, 
        "quantity": "100g", 
        "imgFile": "menu_img_02.png" 
      } 
    ], 
    "preferences":[
      1,
      2
    ], 
    "stampRuleset":{ 
      "totalCnt":100, 
      "logoImgFile": "stamp_img_01.png", 
      "rewards":[ 
        { 
          "name":"reward_001", 
          "cnt":10 
        } 
      ] 
    } 
  })
}
```

---

### Example Response

- The response body will contain the actual facility registration request that is saved to DB
- additional fields `profileImgUri, imgUri, logoImgUri` will indicate the S3-URI of the images saved

```JSON
{
  "status": "success",
  "data": {
    "id": 46,
    "author_id": 2,
    "status": 0,
    "title": "Hello FORK!",
    "content": {
      "name": "Restaurant_01",
      "englishName":"Restaurant_01",
      "type": "restaurant",
      "businessId": "B00001",
      "phone": "02-1234-5678",
      "email": "fork350@foodies.com",
      "url": "www.restaurant.com",
      "description": "We serve great foods.",
      "profileImgFile": "facility_img_01.png",
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
          "quantity": "100g",
          "imgFile": "menu_img_01.png",
          "imgUri": "s3://fork-foodies/images/2024-06-01/1717226029920_menu_img_01.png"
        },
        {
          "name": "menu_02",
          "description": "menuDesc_02",
          "price": 20000,
          "quantity": "100g",
          "imgFile": "menu_img_02.png",
          "imgUri": "s3://fork-foodies/images/2024-06-01/1717226029940_menu_img_02.png"
        }
      ],
      "preferences": [
        1,
        2
      ],
      "stampRuleset": {
        "totalCnt": 100,
        "logoImgFile": "stamp_img_01.png",
        "rewards": [
          {
            "name": "reward_001",
            "cnt": 10
          }
        ],
        "logoImgUri": "s3://fork-foodies/images/2024-06-01/1717226029964_stamp_img_01.png"
      },
      "profileImgUri": "s3://fork-foodies/images/2024-06-01/1717226029911_facility_img_01.png"
    },
    "send_date": "2024-05-31T22:13:50.169Z",
    "respond_date": null,
    "created_at": "2024-05-31T22:13:50.169Z",
    "updated_at": "2024-05-31T22:13:50.169Z"
  }
}
```


