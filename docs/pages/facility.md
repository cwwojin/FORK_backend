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

### Notes
- If a post should be made without an image, leave the `image` field undefined or omit it.

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