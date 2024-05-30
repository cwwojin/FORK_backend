# Review API

### Table of Contents

- [Review API](#review-api)
  - [GET : get review by query](#get--get-review-by-query)
  - [GET : get review by ID](#get--get-review-by-id)
  - [POST : Create a Review](#post--create-a-review)
  - [POST : Edit Review Contents - Text \& Hashtags](#post--edit-review-contents---text--hashtags)
  - [DELETE : Delete a Review](#delete--delete-a-review)
- [Hashtag Methods](#hashtag-methods)
  - [GET : Get all Hashtags from the system](#get--get-all-hashtags-from-the-system)
  - [GET : Get a Hashtag by ID](#get--get-a-hashtag-by-id)
  - [GET : Get Top-N Hashtags of a Facility](#get--get-top-n-hashtags-of-a-facility)

---

## GET : get review by query
- Get reviews by query
- If no query parameters are provided, get ALL reviews

### URL
`/api/reviews`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| query | facility | int | - | unique id of `facility` |
| query | user | int | - | unique id of `user` |
| query | hasImage | bool | - | if `true` then return reviews that contain images |
| query | hashtags | array | - | an array of `hashtag.id` integers. will return reviews that contain **1 or more** of the hashtags provided |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | array of objects that contain columns of `review, hashtag` tables. This means it gets reviews along with all the associated hashtag data. |

---

## GET : get review by ID
- Get a single review by review ID

### URL
`/api/reviews/:id`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | unique id of the `review` |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the returned `review` object + all associated `hashtag`  |

---

## POST : Create a Review
- Create a new review
- Can have up to 1 image attachment

### URL
`/api/reviews/upload`

### Request Format
- Content-Type: `multipart/form-data`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| body | authorId | int | O | the unique id of the `user` who is the author of the review |
| body | facilityId | int | O | the unique id of the `facility` |
| body | score | int | O | the review score, which is an integer value in range `[0, 5]` |
| body | content | string | O | review contents, which is text |
| body | hashtags | JSON-string | O | All `hashtag` objects that should be associated with the review. A JSON-stringified string. The content should be an array of object, in the format below |
| body-FormData | image | file | - | the image file to upload |

### Request Body - `hashtags`
- You can upload a review with hashtags that are either :
  - already recorded in the system
  - new hashtag made by the author (user)
- Existing hashtag data must match with DB
- To insert a new hashtag, set the `id = NULL` for it

```JSON
{
    "hashtags": [
        {
            "id": 1,
            "name": "Good Food"
        },
        {
            "id": null,
            "name": "A New Hashtag"
        }
    ]
}
```


### Response Format
- HTTP Status Code: `201`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the created `review` object + all associated `hashtag` |

---

## POST : Edit Review Contents - Text & Hashtags
- Edit review contents
- Updatable fields are : `content, hashtags`
- Image & score can't be updated

### URL
`/api/reviews/:id`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | unique id of the `review` |
| body | content | string | O | review contents, which is text |
| body | hashtags | JSON-string | O | All `hashtag` objects that should be associated with the review. A JSON-stringified string. The content should be an array of objects. |

### Response Format
- HTTP Status Code: `201`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the updated `review` object + all associated `hashtag` |

---

## DELETE : Delete a Review
- Delete a review from the system

### URL
`/api/reviews/:id`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | unique id of the `review` |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the deleted `review` object (no hashtags) |

---

# Hashtag Methods

---

## GET : Get all Hashtags from the system
- Get all hashtag data from the DB

### URL
`/api/hashtags/`

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
| data | array of `hashtag` rows |

---

## GET : Get a Hashtag by ID
- Get a single hashtag by hashtag-ID

### URL
`/api/hashtags/:id`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | unique id of the `hashtag` |

### Response Format

- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the returned `hashtag` object |

---

## GET : Get Top-N Hashtags of a Facility
- Get the top-N hashtags of a certain facility
- the top-N is given by : out of all hashtags in the facility's reviews, order by number of occurences

### URL
`/api/hashtags/top/:facility`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | facility | int | O | the unique id of the `facility` |
| query | limit | int | - | limit the returned `hashtag` rows to this amount. If not given, the result will contain every hashtag that appears at least once |

### Response Format

- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | array of `hashtag` rows |