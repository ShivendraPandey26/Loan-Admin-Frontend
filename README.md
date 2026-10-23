# Loan Products Admin Panel — Frontend

A modern, responsive admin dashboard built with **React, Vite, and Tailwind CSS** for managing loan products, applicant records, and loan eligibility results through a REST API backend.

The application provides an intuitive interface for administrators to manage loan products, configure eligibility criteria, review applicants, and view eligible loan products. It integrates with a Node.js and Express.js backend for authentication, data persistence, and eligibility evaluation.

## Live Demo

- **Frontend:** Add your deployed frontend URL here.
- **Backend API:** https://loan-admin-f9ut.onrender.com
- **Frontend Repository:** https://github.com/ShivendraPandey26/Loan-Admin-Frontend
- **Backend Repository:** https://github.com/ShivendraPandey26/Loan-Admin-Backend

## Features

### Authentication and Session Management

- Admin login interface.
- JWT-based authenticated API requests.
- Protected application routes.
- Session validation through the backend.
- Logout and authentication-state management.

### Dashboard

- Overview of loan products and applicants.
- Product and applicant statistics.
- Centralized navigation to management modules.
- Support for eligibility analytics when connected to verified backend data.

### Loan Product Management

- View and search loan products by name.
- Filter products by employment type and salary type.
- Create new loan products.
- View individual product details.
- Edit existing products.
- Delete products when supported by the backend.
- Configure eligibility requirements for each product.

### Applicant Management

- View applicant records.
- Search applicants.
- Paginate applicant listings.
- Create and edit applicant records.
- View individual applicant details.
- Display eligible loan products returned by the backend.

### Eligibility Management

- Present applicant eligibility results.
- Display matching loan products.
- Reflect changes to applicant information and product criteria.
- Integrate with backend eligibility evaluation.

### User Interface

- Responsive layouts for desktop, tablet, and mobile.
- Reusable React components.
- Tailwind CSS utility-based styling.
- Lucide React icons.
- Loading, empty, and error states for data-driven pages.

## Technology Stack

| Technology   | Purpose                                 |
| ------------ | --------------------------------------- |
| React        | Component-based UI development          |
| Vite         | Development server and production build |
| Tailwind CSS | Responsive styling                      |
| React Router | Client-side routing                     |
| Axios        | HTTP requests and backend integration   |
| Lucide React | UI icons                                |
| JavaScript   | Application logic and interactions      |

## Application Architecture

The frontend follows a component-based architecture with a centralized API client.

```text
React Application
       |
       v
React Router
       |
       v
Pages and Components
       |
       v
Axios API Client
       |
       | HTTP / JSON
       | JWT Authorization
       v
Express REST API
       |
       v
MongoDB Atlas
```

The frontend is responsible for presentation, user interactions, form handling, navigation, and displaying API results.

Authentication, authorization, database operations, request validation, and final eligibility decisions are handled by the backend.

## Project Structure

```text
loan-admin-frontend/
├── public/
├── src/
│   ├── components/
│   │   └── Reusable UI components
│   ├── lib/
│   │   └── api.js
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Products.jsx
│   │   ├── CreateProduct.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── EditProduct.jsx
│   │   ├── Applicants.jsx
│   │   ├── CreateApplicant.jsx
│   │   └── ApplicantDetails.jsx
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── package.json
└── vite.config.js
```

_This is a representative structure. Update it to match the actual files and folders in the repository._

## Getting Started

### Prerequisites

- Node.js compatible with the project dependencies.
- npm.
- Git.
- A running backend API or access to the deployed API.

### 1. Clone the Repository

```bash
git clone https://github.com/ShivendraPandey26/Loan-Admin-Frontend.git

cd Loan-Admin-Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the frontend root directory.

```env
VITE_BACKEND_API_URL=https://loan-admin-f9ut.onrender.com/api
```

For local development, configure the URL to match your local backend:

```env
VITE_BACKEND_API_URL=http://localhost:5000/api
```

The examples assume that the backend is mounted under `/api` and that the local server uses port `5000`. Adjust these values to match your actual configuration.

The frontend API client should read the variable through `import.meta.env.VITE_BACKEND_API_URL`.

**Security note:** Vite exposes `VITE_` variables to client-side code. Store only public configuration, such as the API base URL, in frontend environment variables. Never place JWT signing secrets, database credentials, or private API keys in them.

### 4. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in the terminal, typically:

```text
http://localhost:5173
```

### 5. Build for Production

```bash
npm run build
```

Vite generates the production build in the `dist/` directory by default.

### 6. Preview the Production Build

```bash
npm run preview
```

Use the preview command to check the production build locally. It is intended for verification, not as a production hosting server.

## Environment Variables

| Variable               | Description                      |
| ---------------------- | -------------------------------- |
| `VITE_BACKEND_API_URL` | Base URL of the backend REST API |

Example `.env.example`:

```env
VITE_BACKEND_API_URL=http://localhost:5000/api
```

Keep `.env` out of version control and provide `.env.example` without private credentials.

After changing a Vite environment variable, restart the development server or rebuild the application as appropriate.

## API Integration

The frontend communicates with the backend using Axios.

The following endpoints describe the intended API contract. Verify their exact paths against the deployed backend before relying on them.

| Method   | Endpoint                                | Purpose                               |
| -------- | --------------------------------------- | ------------------------------------- |
| `POST`   | `/api/auth/login`                       | Authenticate the administrator        |
| `GET`    | `/api/auth/me`                          | Validate the current session          |
| `GET`    | `/api/products`                         | Retrieve loan products                |
| `GET`    | `/api/products/:id`                     | Retrieve product details              |
| `POST`   | `/api/products`                         | Create a loan product                 |
| `PATCH`  | `/api/products/:id`                     | Update a loan product                 |
| `DELETE` | `/api/products/:id`                     | Delete a loan product, if implemented |
| `GET`    | `/api/applicants`                       | Retrieve applicants                   |
| `GET`    | `/api/applicants/:id`                   | Retrieve applicant details            |
| `POST`   | `/api/applicants`                       | Create an applicant                   |
| `PATCH`  | `/api/applicants/:id`                   | Update an applicant                   |
| `GET`    | `/api/applicants/:id/eligible-products` | Retrieve eligible loan products       |

If the Axios base URL already ends in `/api`, use paths such as `/products` in the API client rather than repeating the `/api` prefix.

### API Client Responsibilities

The shared API client can centralize:

- Backend base URL configuration.
- Authentication headers.
- HTTP request configuration.
- Response handling.
- Error handling.

The frontend displays eligibility information returned by the backend instead of independently deciding whether an applicant qualifies.

## Authentication Flow

1. The administrator enters login credentials.
2. The frontend sends the credentials to the login endpoint.
3. The backend validates the credentials and returns the authentication response.
4. The frontend uses the returned token for protected requests.
5. The application validates the session and displays the appropriate interface.
6. Logging out clears the frontend authentication state.

Protected React routes improve navigation and user experience, but backend authorization remains necessary for securing API operations.

For production, evaluate token storage carefully. Browser storage is accessible to JavaScript, while appropriately configured `HttpOnly`, `Secure`, and `SameSite` cookies can reduce certain token-exposure risks.

## Loan Eligibility Interface

The frontend presents results calculated by the backend eligibility engine.

Loan products may define requirements for:

- Minimum and maximum applicant age.
- Minimum credit score.
- Allowed employment types.
- Allowed salary types.
- Minimum monthly salary.

The backend checks whether an applicant meets all configured requirements for each product.

The frontend is responsible for presenting those results clearly. It should not treat client-side filtering as the authoritative eligibility decision.

## Error Handling and User Experience

The frontend should handle common API responses appropriately.

| Status | Frontend Behaviour                       |
| ------ | ---------------------------------------- |
| `400`  | Display validation errors                |
| `401`  | Handle invalid or expired authentication |
| `403`  | Show an access-denied message            |
| `404`  | Display a not-found state                |
| `409`  | Explain a conflicting operation          |
| `500`  | Show a generic server error              |

Recommended interface behaviour includes loading indicators, empty states, form validation, success notifications, request-failure messages, and confirmation dialogs before destructive actions.

## Deployment

The frontend can be deployed to a static hosting platform such as Vercel or Netlify.

### Deployment Steps

1. Import the frontend GitHub repository into the hosting platform.
2. Configure the build command as `npm run build`.
3. Configure the output directory as `dist`.
4. Add `VITE_BACKEND_API_URL` to the production environment variables.
5. Ensure the backend allows requests from the production frontend origin.
6. Configure SPA fallback routing so direct navigation to nested React routes works.
7. Deploy the application.
8. Test login, navigation, CRUD workflows, and eligibility results against the deployed backend.

### Production Checklist

- [ ] Production API URL configured.
- [ ] HTTPS enabled.
- [ ] CORS configured on the backend.
- [ ] Authentication and logout verified.
- [ ] Product management workflows tested.
- [ ] Applicant management workflows tested.
- [ ] Eligibility results verified against backend responses.
- [ ] Dashboard statistics verified against actual data.
- [ ] Mobile and desktop layouts tested.
- [ ] Environment files excluded from Git.

## Known Limitations to Verify

- Confirm whether dashboard eligibility statistics are connected to actual backend evaluation data.
- Confirm that product deletion is implemented and supported by the backend.
- Verify the exact applicant evaluation and eligible-products routes.
- Verify pagination and filtering behaviour against the actual API.
- Confirm session persistence and expired-token handling.

Only retain items in this section that are genuinely unresolved in the current implementation.

## Future Improvements

- Add automated component and integration tests.
- Introduce end-to-end testing for critical user workflows.
- Add accessible form validation and keyboard navigation.
- Improve dashboard analytics using verified backend data.
- Add sorting and advanced filtering.
- Add automated linting and continuous integration.
- Improve session management and authentication security.
- Add screenshots and a hosted frontend demo.

---

**Built with React, Vite, Tailwind CSS, and Axios.**
