# FORK_Backend API Documentation
### Table of Contents

- [FORK\_Backend API Documentation](#fork_backend-api-documentation)
    - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [HTTP Status codes \& Errors](#http-status-codes--errors)
  - [Author](#author)

## Getting Started
This project consists of 7 components. 

Click on each element for detailed API usage guides

| Service Name | Description | 
| --- | --- |
| [Admin](pages/admin.md) | Admin features, including bugs & content report, facility registration request handling. |
| [Authorization](pages/auth.md) | User account authorization |
| [Facility](pages/facility.md) | Facility information, including address, preferences, menu, stamp program, etc. Also handles facility posts management|
| [Map](pages/map.md) | Facility location / coordinates, GET requests only |
| [Review](pages/review.md) | Managing facility reviews, hashtags |
| [Stamp](pages/stamp.md) | Stamp-book data & stamp transactions. A stamp-book is a collection of stamps that corresponds to a `(user, facility)` |
| [User](pages/user.md) | User account information, profile, preferences, favorites. Also handles managing `my facilities` which is feature for facility-users

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

## Author
- Woojin Choi | cwwojin@gmail.com
- Nurgissa Sailaubek | 
