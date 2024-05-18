# FORK_Backend API Documentation
### Table of Contents

- [FORK\_Backend API Documentation](#fork_backend-api-documentation)
    - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [HTTP Status codes \& Errors](#http-status-codes--errors)
  - [Reponse Format](#reponse-format)
    - [Response Content](#response-content)
    - [Example Response](#example-response)
  - [Author](#author)

## Getting Started
This project consists of 7 components. 

Click on each element for detailed API usage guides

| Service Name | Description | 
| --- | --- |
| [Admin](pages/admin.html) | Admin features, including bugs & content report, facility registration request handling. |
| [Authorization](pages/auth.html) | User account authorization |
| [Facility](pages/facility.html) | Facility information, including address, preferences, menu, stamp program, etc. Also handles facility posts management|
| [Map](pages/map.html) | Facility location / coordinates, GET requests only |
| [Review](pages/review.html) | Managing facility reviews, hashtags |
| [Stamp](pages/stamp.html) | Stamp-book data & stamp transactions. A stamp-book is a collection of stamps that corresponds to a `(user, facility)` |
| [User](pages/user.html) | User account information, profile, preferences, favorites. Also handles managing `my facilities` which is feature for facility-users

---

## HTTP Status codes & Errors
Here are the example error codes and HTTP status codes for all API responses.

| HTTP Status Code | Error Message | note |
| --- | --- | --- |
| **400 Bad Request** | `Invalid Request : ${ERROR_MSG}` | Request validation fail for one or more fields (request parameter, body, query) |
| **401 Unauthorized** | `Unauthorized Access` | Request missing authorization token / required fields |
| **403 Forbidden** | `Forbidden Access` | Request rejected, because it tried to access API calls not available to client user type. *(ex. non-admin tried to access admin features)* |
| **404 Not Found** | `ex. No user with id: 1` | Requested resource not found |
| **409 Conflict** | `ex. insert or update on table violates foreign key constraint` | Request accepted, but failed due to resource conflict with DB / server
| **200 OK** | | Request accepted |
| **201 Created** | | Request accepted, and resource was created as requested |

## Reponse Format
Responses are designed to follow [JSEND format](https://github.com/omniti-labs/jsend)

### Response Content
| Key | Data Type | Description |
| --- | --- | --- |
| status | string | status is one of - `success, fail, error` |
| data | array or object | the payload which is the requested data |
| message | string | in case of error, this will contain the error message |

### Example Response
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "row_01"
    },
    {
      "id": 2,
      "name": "row_02"
    }
  ],
  "message": "A message will be attached when there's an error"
}
```




---

## Author
- Woojin Choi | cwwojin@gmail.com
- Nurgissa Sailaubek | 