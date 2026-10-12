# Changes made today — Monday 12 October 2026

This workbook records the Mailtrap registration rollback work on `CODETRACK-BE-code` and the React auth integration on `main`. The backend section comes first so the class can follow the request from the server outward to the UI.

> Safety note: use your own local environment configuration when running the backend. This workbook lists configuration variable names only; it contains no credentials. Do not commit or share `.env` files.

## Part 1 — Backend changes (`CODETRACK-BE-code`)

### Files changed for the Mailtrap and registration-rollback fix

| File | Change and teaching focus |
| --- | --- |
| [`src/controllers/auth.controller.js`](https://github.com/Juadebfm/codetrack-dashboard-react-clone/blob/CODETRACK-BE-code/src/controllers/auth.controller.js) | Registration catches verification-email failures, deletes the account created by that registration, logs a rollback failure if deletion itself fails, then forwards the original mail error to the error handler. |
| [`src/utils/send-email.js`](https://github.com/Juadebfm/codetrack-dashboard-react-clone/blob/CODETRACK-BE-code/src/utils/send-email.js) | Sends verification mail with Nodemailer over Mailtrap Sandbox SMTP. It awaits `sendMail`, allowing delivery errors to reach the controller. |
| [`src/config/environment.js`](https://github.com/Juadebfm/codetrack-dashboard-react-clone/blob/CODETRACK-BE-code/src/config/environment.js) | Reads SMTP host, port, username, password, sender email, and sender name; validates required mail settings outside test mode. |
| [`package.json`](https://github.com/Juadebfm/codetrack-dashboard-react-clone/blob/CODETRACK-BE-code/package.json) and `package-lock.json` | Adds Nodemailer as the SMTP client dependency. |
| [`tests/auth.test.js`](https://github.com/Juadebfm/codetrack-dashboard-react-clone/blob/CODETRACK-BE-code/tests/auth.test.js) | Mocks mail delivery to fail, then checks that registration returns an error and the newly created user is absent from the database. |
| [`tests/send-email.test.js`](https://github.com/Juadebfm/codetrack-dashboard-react-clone/blob/CODETRACK-BE-code/tests/send-email.test.js) | Checks SMTP transport options and the message sent to Nodemailer without contacting Mailtrap. |
| [`.env.example`](https://github.com/Juadebfm/codetrack-dashboard-react-clone/blob/CODETRACK-BE-code/.env.example) and [`docs/mailtrap-setup.md`](https://github.com/Juadebfm/codetrack-dashboard-react-clone/blob/CODETRACK-BE-code/docs/mailtrap-setup.md) | Updates the example variable names and SMTP setup instructions. The example is a template; never put real secrets in it. |

### Teach the backend flow

1. **Start at the route.** In `src/routes/auth.routes.js`, `POST /register` maps to `register`. `src/app.js` mounts auth routes under `/api/v1/auth`.
2. **Trace the write and email.** In `src/controllers/auth.controller.js`, registration validates input, creates the user, then calls `sendVerificationEmail`. That helper saves a hashed verification token and expiry before asking the mail utility to send the email.
3. **Follow the error boundary.** If sending fails, the controller tries `User.deleteOne({ _id: user._id })`. It then passes the original mail error to `next`, and `src/middleware/error-handler.js` formats the HTTP 500 response.
4. **Explain the rollback boundary.** This is a compensating delete for the new user record, not a transaction involving the external SMTP service. If deletion also fails, the code logs that failure; it cannot guarantee the user was removed. Delivery may also be ambiguous if the provider accepted the message but the connection failed before confirmation.
5. **Separate transport from controller logic.** In `src/utils/send-email.js`, `sendMail` is awaited. If that promise rejects, the registration controller can perform its rollback.

### Backend test exercise

From the backend branch, run:

```sh
npm test
```

In `tests/auth.test.js`, find “removes the new account when its verification email cannot be sent.” The test makes the mail helper reject, expects HTTP 500, and queries the test database to confirm that the account is gone. In `tests/send-email.test.js`, inspect the SMTP configuration assertions. These tests mock SMTP; the real Mailtrap inbox is a separate manual integration check.

Discussion prompt: what should happen if account deletion fails after the email failure? Point students to the logged rollback error and discuss monitoring and recovery rather than claiming rollback is infallible.

## Part 2 — Frontend changes (`main`)

### Files changed for the React auth integration

| File | Change and teaching focus |
| --- | --- |
| [`.gitignore`](./.gitignore) | Ignores `.env*` files so local configuration is not accidentally added to Git. |
| [`src/context/AuthContext.jsx`](./src/context/AuthContext.jsx) | Replaces mock auth with a small `fetch` helper and Context actions for registration, verification, login, session refresh/profile lookup, and logout. Requests include cookies with `credentials: "include"`. The API defaults to `http://localhost:4000/api/v1`; `VITE_API_URL` can override it. |
| [`src/pages/AuthPage.jsx`](./src/pages/AuthPage.jsx) | Makes form submission asynchronous, displays backend errors, and shows a registration success message without treating an unverified account as logged in. |
| [`src/pages/EmailVerificationPage.jsx`](./src/pages/EmailVerificationPage.jsx) | Reads the token from the email link, calls the verification endpoint, and shows success or failure. It reuses one in-flight request so React Strict Mode does not submit the same token twice in development. |
| [`src/App.jsx`](./src/App.jsx) | Adds the verification route and waits for session restoration before redirecting from the protected dashboard. |
| [`src/pages/DashboardPage.jsx`](./src/pages/DashboardPage.jsx) | Displays the backend's `displayName` field and provides a logout button. |
| [`src/index.css`](./src/index.css) | Adds the success-message style used after signup and email verification. |

### Teach the frontend flow

```text
Signup form
  → POST /api/v1/auth/register
  → backend creates account and sends verification email
  → user opens /verify-email?token=...
  → GET /api/v1/auth/verify-email?token=...
  → user signs in
  → backend sets HTTP-only cookies
  → Context loads /auth/me (tries /auth/refresh after a 401)
  → protected dashboard shows the user
```

1. Start with `src/context/AuthContext.jsx`: show how Context keeps API calls and user/session state together without adding a service layer.
2. Follow `src/pages/AuthPage.jsx`: signup success means “check your email,” not “go to the dashboard.” Login is the step that sets the current user.
3. Open `src/pages/EmailVerificationPage.jsx`: the token is read from the URL and sent to the backend; success then lets the user go to sign-in.
4. Finish with `src/App.jsx` and `src/pages/DashboardPage.jsx`: session loading prevents an early redirect, and logout calls the backend before returning to sign-in.

### Manual class test

1. Run the backend and frontend on their expected local ports. The backend defaults to port `4000`; its allowed frontend origin must match the frontend origin (normally `http://localhost:5173`) for credentialed requests.
2. Register with an email you can inspect in the Mailtrap Sandbox. Confirm signup says to check email and does not open the dashboard.
3. Open the verification link from the inbox, then sign in.
4. Refresh the dashboard to exercise session restoration. Log out and confirm the protected dashboard returns you to sign-in.
5. For the rollback lesson, use the mocked failure test in `tests/auth.test.js`; do not break live Mailtrap settings to simulate an error.

## Verification record

- Frontend `npm run lint`: passed after the integration changes.
- Frontend `npm run build`: passed after the integration changes.
- This workbook describes the backend failure test and the real Mailtrap check; rerun them in class to demonstrate current behavior.
