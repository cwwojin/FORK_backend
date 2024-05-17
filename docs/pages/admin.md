# Admin API

### Table of Contents

1. [GET report by query](#get--get-report-by-query)
2. [GET report by id](#get--get-report-by-id)
3. [POST create report](#post--create-report)
4. [DELETE delete report](#delete--delete-report)
5. [POST handle report](#post--handle-report-by-admin)



## GET : get report by query
- Get bug & content reports by query

### URL
`/api/admin/reports`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| query | user | int | - | unique id of the author of the report |
| query | type | int | - | one of - 0: bug report, 1: content report |
| query | status | int | - | one of - 0: pending, 1: accepted |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | array of `report` rows |

## GET : get report by id
- Get bug & content report by unique id

### URL
`/api/admin/reports/:id`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | unique id of `report` |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the returned `report` object |

## POST : create report
- Create a new bug / content report

### URL
`/api/admin/reports/upload`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| body | authorId | int | O | unique id of requesting user / report author |
| body | type | int | O | one of - 0: bug report, 1: content report |
| body | content | string | O | report contents |
| body | reviewId | int | - | for content reports, the corresponding review id |

### Response Format
- HTTP Status Code: `201`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the created `report` object |

## DELETE : delete report
- Delete a report

### URL
`/api/admin/reports/delete/:id`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | unique id of `report` |

### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the deleted `report` object |

## POST : handle report (by admin)
- set the report to `accepted`, and perform follow-up action.
- supported follow-up action is : `delete : delete the corresponding review`

### URL
`/api/admin/reports/handle/:id`

### Request Format
- Content-Type: `application/json`

| Location | Field Name | Data Type | Required | Description |
| --- | --- | --- | --- | --- |
| param | id | int | O | unique id of `report` |
| body | adminId | int | O | unique id of the requesting user, which is an admin |
| body | action | string | O | supported actions - `"delete" : delete the corresponding review` |


### Response Format
- HTTP Status Code: `200`

| Key | Description |
| --- | --- |
| status | `success` |
| data | the updated `report` object |
| deleteRows | if `action = "delete"`, then this will return all the deleted rows |