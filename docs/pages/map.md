# Map API

### Table of Contents

1. [GET locations by area](#get--get-locations-by-area)
2. [GET location by id](#get--get-location-by-id)
3. [GET locations by search & query](#get--get-location-by-query--search)

---

## GET : get locations by area
- Get all `pin: includes {coordinates, id, name, avg_score} of a facility` that are in a given area
- 2 corner point coordinates are given

### URL
`/api/map`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| body | area | object | O | Object with keys `{latMin, lngMin, latMax, lngMax}` all values are float |

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
| body | name | string | - | name of the facility to search for |
| body | openNow | bool | - | if TRUE, then return only facilities that are currently open |
| body | preferences | array | - | array of `preference.id` (integer). If provided, then search for facilities that contain at least one of the preferences queried |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | array of `pin` rows |
