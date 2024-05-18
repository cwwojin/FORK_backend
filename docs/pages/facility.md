# Facility API

### Table of Contents

- [Facility API](#facility-api)
    - [Table of Contents](#table-of-contents)
  - [GET : get facilities](#get--get-facilities)
    - [URL](#url)
    - [Request Format](#request-format)
    - [Response Format](#response-format)
  - [GET : get facility by ID](#get--get-facility-by-id)
    - [URL](#url-1)
    - [Request Format](#request-format-1)
    - [Response Format](#response-format-1)
  - [POST : create a new facility](#post--create-a-new-facility)
    - [URL](#url-2)
    - [Request Format](#request-format-2)
    - [Response Format](#response-format-2)
  - [PUT : update a facility](#put--update-a-facility)
    - [URL](#url-3)
    - [Request Format](#request-format-3)
    - [Response Format](#response-format-3)
  - [DELETE : delete a facility](#delete--delete-a-facility)
    - [URL](#url-4)
    - [Request Format](#request-format-4)
    - [Response Format](#response-format-4)
  - [GET : get address by facility ID](#get--get-address-by-facility-id)
    - [URL](#url-5)
    - [Request Format](#request-format-5)
    - [Response Format](#response-format-5)
  - [POST : add or update address for a facility](#post--add-or-update-address-for-a-facility)
    - [URL](#url-6)
    - [Request Format](#request-format-6)
    - [Response Format](#response-format-6)
  - [DELETE : delete address for a facility](#delete--delete-address-for-a-facility)
    - [URL](#url-7)
    - [Request Format](#request-format-7)
    - [Response Format](#response-format-7)
  - [GET : get opening hours for a facility](#get--get-opening-hours-for-a-facility)
    - [URL](#url-8)
    - [Request Format](#request-format-8)
    - [Response Format](#response-format-8)
  - [POST : add opening hours for a facility](#post--add-opening-hours-for-a-facility)
    - [URL](#url-9)
    - [Request Format](#request-format-9)
    - [Response Format](#response-format-9)
  - [DELETE : delete opening hours for a facility](#delete--delete-opening-hours-for-a-facility)
    - [URL](#url-10)
    - [Request Format](#request-format-10)
    - [Response Format](#response-format-10)
  - [GET : get menu for a facility](#get--get-menu-for-a-facility)
    - [URL](#url-11)
    - [Request Format](#request-format-11)
    - [Response Format](#response-format-11)
  - [GET : get menu item by ID](#get--get-menu-item-by-id)
    - [URL](#url-12)
    - [Request Format](#request-format-12)
    - [Response Format](#response-format-12)
  - [POST : create menu for a facility](#post--create-menu-for-a-facility)
    - [URL](#url-13)
    - [Request Format](#request-format-13)
    - [Response Format](#response-format-13)
  - [PUT : update menu item by ID](#put--update-menu-item-by-id)
    - [URL](#url-14)
    - [Request Format](#request-format-14)
    - [Response Format](#response-format-14)
  - [DELETE : delete menu item by ID](#delete--delete-menu-item-by-id)
    - [URL](#url-15)
    - [Request Format](#request-format-15)
    - [Response Format](#response-format-15)
  - [GET : get all posts by facility ID](#get--get-all-posts-by-facility-id)
    - [URL](#url-16)
    - [Request Format](#request-format-16)
    - [Response Format](#response-format-16)
  - [GET : get post by ID](#get--get-post-by-id)
    - [URL](#url-17)
    - [Request Format](#request-format-17)
    - [Response Format](#response-format-17)
  - [POST : create a new post for a facility](#post--create-a-new-post-for-a-facility)
    - [URL](#url-18)
    - [Request Format](#request-format-18)
    - [Response Format](#response-format-18)
  - [PUT : update a post by ID](#put--update-a-post-by-id)
    - [URL](#url-19)
    - [Request Format](#request-format-19)
    - [Response Format](#response-format-19)
  - [DELETE : delete a post by ID](#delete--delete-a-post-by-id)
    - [URL](#url-20)
    - [Request Format](#request-format-20)
    - [Response Format](#response-format-20)
  - [GET : get stamp ruleset rewards by facility ID](#get--get-stamp-ruleset-rewards-by-facility-id)
    - [URL](#url-21)
    - [Request Format](#request-format-21)
    - [Response Format](#response-format-21)
  - [POST : create stamp ruleset](#post--create-stamp-ruleset)
    - [URL](#url-22)
    - [Request Format](#request-format-22)
    - [Response Format](#response-format-22)
  - [PUT : update existing stamp ruleset](#put--update-existing-stamp-ruleset)
    - [URL](#url-23)
    - [Request Format](#request-format-23)
    - [Response Format](#response-format-23)
  - [POST : add stamp reward](#post--add-stamp-reward)
    - [URL](#url-24)
    - [Request Format](#request-format-24)
    - [Response Format](#response-format-24)
  - [PUT : update stamp reward by ID](#put--update-stamp-reward-by-id)
    - [URL](#url-25)
    - [Request Format](#request-format-25)
    - [Response Format](#response-format-25)
  - [DELETE : delete stamp reward by ID](#delete--delete-stamp-reward-by-id)
    - [URL](#url-26)
    - [Request Format](#request-format-26)
    - [Response Format](#response-format-26)
  - [GET : get preferences by facility ID](#get--get-preferences-by-facility-id)
    - [URL](#url-27)
    - [Request Format](#request-format-27)
    - [Response Format](#response-format-27)
  - [POST : add a preference to a facility](#post--add-a-preference-to-a-facility)
    - [URL](#url-28)
    - [Request Format](#request-format-28)
    - [Response Format](#response-format-28)
  - [DELETE : delete a preference from a facility](#delete--delete-a-preference-from-a-facility)
    - [URL](#url-29)
    - [Request Format](#request-format-29)
    - [Response Format](#response-format-29)

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

### URL

`/api/facilities/:facilityId/post`

### Request Format

- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description                 |
| -------- | ---------- | --------- | -------- | --------------------------- |
| param    | facilityId | int       | O        | unique ID of the `facility` |
| body     | authorId   | int       | O        | ID of the post author       |
| body     | title      | string    | O        | title of the post           |
| body     | content    | string    | O        | content of the post         |
| body     | imgUri     | string    | O        | image URI of the post       |

### Response Format

- HTTP Status Code: `201`

| Key    | Description               |
| ------ | ------------------------- |
| status | `success`                 |
| data   | the created `post` object |

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

`/api/facilities/:facilityId/stamp-ruleset-rewards`

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
