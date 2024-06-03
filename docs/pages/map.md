# Map API

### Table of Contents

- [Map API](#map-api)
  - [GET : get locations by area](#get--get-locations-by-area)
  - [GET : get location by id](#get--get-location-by-id)
  - [GET : get location by query / search](#get--get-location-by-query--search)

---

## GET : get locations by area
- Get all `pin: includes {lat, lng, id, name, avg_score} of a facility` that are in a given area
- 2 corner point coordinates are given

### URL
`/api/map`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| query | latMin | float | O | latitude minimum |
| query | lngMin | float | O | longitude minimum |
| query | latMax | float | O | latitude maximum |
| query | lngMax | float | O | longitude maximum |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | array of `pin` rows |

---

## GET : get location by id
- Get a pin / location of a facility by id

### URL
`/api/map/locate/:id`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | unique id of `facility` |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the returned `pin` object |

---

## GET : get location by query / search
- Get filtered locations by query & search bar input

### URL
`/api/map/search`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| query | name | string | - | name of the facility to search for. this will search on columns `name, english_name` |
| query | openNow | bool | - | if TRUE, then return only facilities that are currently open |
| query | preferences | array | - | comma-seperated array of `preference.id` (integer). If provided, then search for facilities that contain at least one of the preferences queried |
| query | favorite | bool | - | if TRUE, then return only the `favorite` facilities of the requesting `user` if the requester is a `guest` then using this parameter will raise ERROR |

### Example Request URL
`http://{BASE_URL}/api/map/search?name=restaurant&openNow=true&preferences=1,2,3`

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | array of `pin` rows |
