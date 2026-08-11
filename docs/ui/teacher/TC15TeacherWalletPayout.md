# TC15 Teacher Wallet and Payout

- **Tên màn hình:** Wallet and Payout
- **Đường dẫn:** `VERIFY: /teacher/wallet`
- **Asset:** New screen derived from `TC04TeacherEarning.svg` and confirmed 80/20/minimum-1000-VND rules.

## Wireframe

~~~text
DESKTOP 1600x1300
+================================================================================================+
| [Dreams LMS] Teacher Dashboard                         [notifications] [profile] [Logout]     |
+================================================================================================+
|                                      WALLET & PAYOUT                                             |
+================================================================================================+
| [Available balance 2,400,000 VND] [Pending 350,000 VND] [Total earned 8,000,000 VND]          |
| +------------------------------------------------------+  +-------------------------------+ |
| | Request payout                                       |  | Payout rules                  | |
| | Amount [________________] VND                        |  | Minimum: 1,000 VND           | |
| | Bank name [____________________]                     |  | Admin approval required      | |
| | Account name [_________________]                     |  | Platform share: 20%          | |
| | Account number [________________]                    |  | Teacher share: 80%           | |
| | [Request payout]                                     |  +-------------------------------+ |
| +------------------------------------------------------+                                |
| | Ledger: Date | Order | Type | Amount | Balance | Status                             | |
| | 16 Jan | ORD-01 | Course revenue | +79,000 | 2,400,000 | Completed                 | |
| | 18 Jan | PAY-01 | Payout debit  | -1,000 | 2,399,000 | Pending                    | |
| +------------------------------------------------------+                                |
+================================================================================================+
~~~

~~~text
MOBILE 390x844
+------------------------------------------+
| [hamburger] [Dreams LMS]      [profile]  |
+------------------------------------------+
|              WALLET & PAYOUT             |
+------------------------------------------+
| Available 2,400,000 VND                  |
| Pending 350,000 VND                      |
| Total earned 8,000,000 VND               |
| Request payout                           |
| Amount [____________________] VND        |
| Bank name [__________________]           |
| Account name [_______________]           |
| Account number [_____________]           |
| Minimum: 1,000 VND                       |
| [Request payout]                         |
| Ledger                                  |
| 16 Jan | Course revenue | +79,000       |
| 18 Jan | Payout debit  | -1,000         |
+------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| KPI | Wallet balances | Available, pending, total earned | Refreshed after settlement |
| Form | Payout request | Amount and bank account information | Minimum 1,000 VND validation |
| Rules | Revenue split card | 80% Teacher, 20% Platform, Admin approval | Read-only policy |
| Ledger | Wallet entries | Revenue, payout debit, status, balance | Immutable history |

## States

- Balance below 1,000 VND: request disabled with explanation.
- Pending payout: request button disabled for duplicate request.
- Rejected payout: Admin note and resubmit action visible.
- Completed payout: ledger shows debit and completed status.
