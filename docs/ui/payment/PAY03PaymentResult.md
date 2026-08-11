# PAY03 Payment Result

- **Tên màn hình:** Payment Result
- **Đường dẫn:** `VERIFY: /checkout/result/:orderId`
- **Asset:** New screen derived from PAY01/PAY02 and PayOS webhook states.

## Wireframe

~~~text
DESKTOP 1200x900
+========================================================================================+
| [Dreams LMS]                                                             [profile]     |
+========================================================================================+
|                                  PAYMENT RESULT                                        |
| +------------------------------------------------------------------------------------+ |
| | [check] Payment completed                                                         | |
| | Order: ORD-0001       Transaction: PAYOS-0001                                    | |
| | Python Foundations for Problem Solving                                            | |
| | Amount: 79,000 VND                                                               | |
| | Enrollment created. You can start learning now.                                  | |
| | [Go to course] [View orders]                                                     | |
| +------------------------------------------------------------------------------------+ |
| Payment status: COMPLETED | Notification sent to your account                         |
+========================================================================================+
~~~

~~~text
MOBILE 390x844
+------------------------------------------+
| [Dreams LMS]                 [profile]  |
+------------------------------------------+
|             PAYMENT RESULT              |
| +--------------------------------------+ |
| | [check] Payment completed            | |
| | Order: ORD-0001                     | |
| | Python Foundations                  | |
| | Amount: 79,000 VND                 | |
| | Enrollment created.                | |
| | [Go to course]                     | |
| | [View orders]                      | |
| +--------------------------------------+ |
+------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Result | Payment status | Completed/failed/expired state, order and transaction code | Polls webhook state if pending |
| Enrollment | Success message | Confirms immediate enrollment | Opens course workspace |
| Actions | Course/orders | Continue learning or review order | Navigation |

## States

- Pending: show waiting for PayOS confirmation and refresh action.
- Failed/expired: explain no enrollment was created and offer retry.
- Completed: show course access immediately.
