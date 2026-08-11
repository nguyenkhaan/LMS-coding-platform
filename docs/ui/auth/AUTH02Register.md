# AUTH02 Register

- **Tên màn hình:** Sign Up
- **Mã màn hình:** `AUTH02`
- **Đường dẫn:** `/auth/register` (suy luận từ tên màn hình)
- **Asset:** [AUTH02Register.svg](./AUTH02Register.svg)
- **Viewport nguồn:** `1600x1000`
- **Mức độ chắc chắn:** Layout và component đã đối chiếu từ SVG render; route và CTA cần xác nhận với app contract.

## Wireframe

~~~text
DESKTOP 1600x1000
+======================================================================+
| LEFT AUTH BRAND 800px           | RIGHT AUTH FORM 800px              |
| background: pale pink gradient  | background: white                  |
|                                 |                                    |
|          (large white circle)   |                    [Dreams LMS]    |
|        [phone/person/lock]      |                    Back to Home    |
|                                 |                                    |
|                                 |             Sign Up                |
|                                 |                                    |
|                                 | Full Name *                         |
|                                 | [________________________] [user]  |
|                                 |                                    |
|                                 | Email *                             |
|                                 | [________________________] [mail]  |
|                                 |                                    |
|                                 | Password *              [eye-off]   |
|                                 | [________________________]          |
|                                 | [----][----][----][----]            |
|                                 |                                    |
|                                 | Confirm Password *      [eye-off]   |
|                                 | [________________________]          |
|                                 |                                    |
|                                 | [x] I agree with Terms of Service   |
|                                 |     and Privacy Policy               |
|                                 |                                    |
|                                 | [           Login ->           ]    |
|                                 |                                    |
|                                 |                ---- Or ----          |
|                                 | [          Google          ]         |
|                                 | [         Facebook         ]         |
|                                 |                                    |
|                                 | Already you have an account?        |
|                                 |                         [Sign In]    |
|                                 |                                    |
|        Welcome to DreamsLMS    |                                    |
|             Courses.            |                                    |
|  Platform designed to help      |                                    |
|  organizations, educators, and  |                                    |
|  learners manage, deliver, and  |                                    |
|  track learning activities.     |                                    |
|              -- o o             |                                    |
+======================================================================+

MOBILE 390x844 (responsive interpretation; brand panel hidden)
+------------------------------------------+
| [Dreams LMS]              Back to Home   |
|                                          |
| Sign Up                                  |
| Full Name *                              |
| [____________________________] [user]    |
| Email *                                  |
| [____________________________] [mail]    |
| Password *                    [eye-off]  |
| [____________________________]            |
| [----][----][----][----]                 |
| Confirm Password *            [eye-off]  |
| [____________________________]            |
| [x] I agree with Terms of Service and    |
|     Privacy Policy                        |
| [             Login ->              ]     |
|                 ---- Or ----             |
| [ Google ]             [ Facebook ]      |
| Already you have an account? [Sign In]   |
+------------------------------------------+
| Brand illustration and pager hidden.     |
+------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Left `0..800` | Brand hero | Pale pink gradient, large circular backdrop, phone/person/lock illustration, slogan and 3-dot pager | Ẩn trên mobile |
| Right top | Logo + home link | Dreams LMS logo and `Back to Home` | Navigate home |
| Form | Full name input | Required field with user icon | Validate non-empty name |
| Form | Email input | Required field with email icon | Validate email format |
| Form | Password input | Required field with eye-off icon and strength indicator | Toggle visibility and validate strength |
| Form | Confirm password input | Required field with eye-off icon | Validate that it matches Password |
| Consent | Terms checkbox | Checked in the source asset; links to `Terms of Service` and `Privacy Policy` | Required before submit |
| Actions | Primary auth button | Coral full-width pill with arrow; visible label is `Login` in the source SVG | Submit registration; loading disables repeat |
| Social | Google/Facebook buttons | Two equal gray OAuth pills with provider icons | Start social registration |
| Footer copy | Existing-account prompt | `Already you have an account? Sign In` | Navigate `/auth/login` |

## States

- Default: Full Name, Email, Password and Confirm Password are empty; consent checkbox is shown checked as in the asset.
- Focus: active input border/focus ring; trailing icon remains inside the field.
- Validation error: inline error under the affected field for missing/invalid data, weak password, mismatch, or missing consent.
- Password visibility: eye-off controls toggle masked/plain text for Password and Confirm Password.
- Loading: registration and social actions are disabled while the request is pending.
- Registration error: show a non-destructive form-level or field-level error and preserve entered values.
- Success: create the account and navigate to the next authentication/onboarding step.

## Verification notes

- The source SVG is a Sign Up layout, not Forgot Password: it contains four registration fields, consent, social buttons and an existing-account prompt.
- The primary button visibly reads `Login` in the SVG although the screen title reads `Sign Up`; confirm whether the intended product label should be `Sign Up` before implementation.
- The mobile wireframe is a responsive interpretation because the supplied asset only declares a `1600x1000` viewport.
