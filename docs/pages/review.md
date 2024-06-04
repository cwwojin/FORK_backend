# Review API

### Table of Contents

- [Review API](#review-api)
  - [GET : get review by query](#get--get-review-by-query)
  - [GET : get review by ID](#get--get-review-by-id)
  - [POST : Create a Review](#post--create-a-review)
  - [POST : Edit Review Contents - Text \& Hashtags](#post--edit-review-contents---text--hashtags)
  - [DELETE : Delete a Review](#delete--delete-a-review)
  - [GET : Get a Summary of reviews for a Faciltiy](#get--get-a-summary-of-reviews-for-a-faciltiy)
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
- Content moderation will be performed on the uploaded review text & image

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
| body | hashtags | JSON-string | O | a JSON-strint of an array of `hashtag` names to be inserted `ex. ['hashtag 1', 'hashtag 2']` |
| body-FormData | image | file | - | the image file to upload |

### Request Body - `hashtags`
- You can upload a review with hashtags that are either :
  - already recorded in the system
  - new hashtag made by the author (user)
- In the request body, simply include the array of hashtag names

```JSON
{
    "hashtags": ["Good Food", "A New Hashtag"]
}
```


### Response Format
- HTTP Status Code: `201`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the created `review` object + all associated `hashtag` |

### Response Format - Moderation
- HTTP Status Code: `499`

| Key | Description |
| --- | --- |
| status | `error` |
| message | `"review upload failed due to harmful content detected"` |
| data | object containing content moderation result `{ status, message, image, text }` keys `image, text` include data & scores for each moderation result. |

### Example Response - Moderation

- HTTP Status Code: `499`

```JSON
{
  "status": "error",
  "message": "review upload failed due to harmful content detected",
  "data": {
    "status": 499,
    "message": "review upload failed due to harmful content detected",
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
| body | hashtags | JSON-string | O | a JSON-strint of an array of `hashtag` names to be inserted `ex. ['hashtag 1', 'hashtag 2']` |

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

## GET : Get a Summary of reviews for a Faciltiy
- Get a summary text of all reviews for a certain facility
- choose a facility via route parameter 'facility' (facility ID)
- Response will include the summary if : **the facility has more than 3 reviews**

### URL
`/api/reviews/summary/:facility`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | facility | int | O | the unique id of the `facility` |
| query | force | bool | - | if set to `true` this will force-recreate the summary rather than using a cached one. The constraint of facility needing more than 3 reviews will still apply. **ONLY USE THIS FOR DEVELOPMENT & TEST PURPOSES** |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | data format is `{ id, summary }, id = facilityId, summary = the generated text summary` |

### Notes : Criteria for generating a summary
- This method will generate a new summary & return it if :
  1. the facility has 3 or more reviews
  2. If a summary cached in DB exists, then use the cached summary if :
    - The cached summary is not older than `24 hours`
  3. If 2. is FALSE (either no cached summary or older than 24hrs), then generate a new summary via OpenAI API call
    - Store the NEW summary in the DB 

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