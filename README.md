An admin panel for managing loan products and applicants, with an eligibility engine that evaluates applicants against configured loan-product criteria.

## Features

- Admin login and authenticated API requests
- Dashboard overview with product and applicant statistics
- Loan product listing and name search
- Filter loan products by employment type and salary type
- Create, view, edit, and delete loan products
- Configure eligibility criteria for each loan product:
  - Minimum and maximum applicant age
  - Minimum credit score
  - Allowed employment types
  - Allowed salary types
  - Minimum monthly salary
- Applicant listing, search, and pagination
- Create and edit applicant records
- Evaluate an applicant's eligibility against loan products
- View eligible loan products for an applicant
- Re-evaluate applicants when loan products are created, updated, or deleted

> Note: Dashboard analytics for eligible and rejected applicants may still need to be connected to the backend evaluation status. Verify the current implementation before presenting these metrics as live.

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Zod validation
- JSON Web Tokens (JWT)

## Project Structure

The repository is organized into frontend and backend applications. The exact backend filenames and folder structure may vary by implementation.

```text
loan-products-admin/
├── loan-admin-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   │   └── api.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── CreateProduct.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── EditProduct.jsx
│   │   │   ├── Applicants.jsx
│   │   │   ├── CreateApplicant.jsx
│   │   │   └── ApplicantDetails.jsx
│   │   └── App.jsx
│   └── package.json
└── backend/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── services/
    ├── validators/
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (use a version supported by your installed Vite and backend dependencies)
- npm
- A MongoDB database, such as MongoDB Atlas
- Backend API deployment or a locally running backend

### 1. Clone the repository

```bash
git clone https://github.com/ShivendraPandey26/Loan-Admin-Frontend.git
cd loan-admin-frontend
```

### 2. Install frontend dependencies

```bash
cd loan-admin-frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file in the frontend root:

```env
VITE_BACKEND_API_URL=http://loan-admin-f9ut.onrender.com/api
```

Replace the example URL with your actual backend API base URL. For a deployed backend, use its HTTPS URL ending in `/api`.

The frontend API client reads this variable in `src/lib/api.js`.

### 4. Start the frontend

```bash
npm run dev
```

Open the local URL printed by Vite in the terminal.

### 5. Start the backend

In a separate terminal, navigate to your backend directory, install its dependencies, configure the backend environment variables, and run the script defined in its `package.json`.

The backend environment variable names and start command depend on your actual backend setup. At minimum, configure the MongoDB connection URI and JWT secret according to your backend implementation. Never commit real secrets to source control.

## API Overview

The frontend is designed to call endpoints similar to these:

| Method   | Endpoint                                | Purpose                                                        |
| -------- | --------------------------------------- | -------------------------------------------------------------- |
| `POST`   | `/api/auth/login`                       | Admin login                                                    |
| `GET`    | `/api/auth/me`                          | Validate the current session                                   |
| `GET`    | `/api/products`                         | List loan products                                             |
| `GET`    | `/api/products/:id`                     | Get one loan product                                           |
| `POST`   | `/api/products`                         | Create a loan product                                          |
| `PATCH`  | `/api/products/:id`                     | Update a loan product                                          |
| `DELETE` | `/api/products/:id`                     | Delete a loan product                                          |
| `GET`    | `/api/applicants`                       | List applicants, with pagination and optional status filtering |
| `GET`    | `/api/applicants/:id`                   | Get one applicant                                              |
| `PATCH`  | `/api/applicants/:id`                   | Update an applicant                                            |
| `POST`   | `/api/applicants/:id/evaluate`          | Evaluate applicant eligibility                                 |
| `GET`    | `/api/applicants/:id/eligible-products` | Get eligible products for an applicant                         |

Confirm endpoint prefixes and route names against the backend before relying on this table. The frontend API client's base URL may already include `/api`, so frontend requests typically use paths such as `/products` rather than `/api/products`.

## Loan Eligibility Criteria

A loan product can define the following rules:

- Minimum and maximum age
- Minimum credit score
- Allowed employment types (`Salaried`, `Self-Employed`)
- Allowed salary types (`DAT`, `Cash`, `Cheque`)
- Minimum monthly salary

The backend eligibility engine should be treated as the source of truth for eligibility decisions. Frontend filtering is for presentation and should not replace server-side validation or authorization.

## Deployment

### Frontend

Deploy the Vite frontend to a static hosting provider such as Vercel or Netlify. Set `VITE_BACKEND_API_URL` in the hosting provider's environment settings to the deployed backend API base URL, then rebuild/redeploy.

### Backend

Deploy the Express API to a Node.js hosting provider such as Render. Configure the MongoDB connection string, JWT secret, allowed frontend origin/CORS settings, and other required environment variables in the hosting dashboard.

### Before Launch

- [ ] Confirm production frontend and backend URLs
- [ ] Confirm HTTPS is enabled
- [ ] Verify CORS allows the production frontend origin
- [ ] Verify login, logout, and session validation
- [ ] Test product create, read, update, and delete
- [ ] Test applicant create, read, update, and eligibility evaluation
- [ ] Verify eligibility status persistence and dashboard counts
- [ ] Test loading, empty, and error states
- [ ] Test mobile, tablet, and desktop layouts
- [ ] Add the correct favicon and page metadata
- [ ] Remove test records and placeholder content
- [ ] Ensure `.env` files and secrets are excluded from Git

## Security Notes

- Never commit MongoDB credentials, JWT secrets, or access tokens.
- Validate all inputs on the backend.
- Protect management endpoints with authentication and appropriate authorization.
- Use HTTPS in production.
- Configure CORS for trusted origins only.
- Treat any previously exposed token or secret as compromised and rotate it.

## Current Limitations / To Verify

- Confirm the exact backend folder structure and npm scripts.
- Confirm production environment variable names and deployment URLs.
- Verify that the product delete route is deployed and tested.
- Connect eligible/rejected dashboard metrics to persisted backend evaluation results.
- Verify sorting and any additional filters before documenting them as complete.

## License

Add the license that applies to this project.
"""

out = Path("/mnt/data/README.md")
out.write_text(readme, encoding="utf-8")
print(f"Created: {out}")
