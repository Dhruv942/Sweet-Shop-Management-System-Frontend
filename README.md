# Sweet Shop Management System - Frontend

A React-based e-commerce frontend application for managing a sweet shop, built with Test-Driven Development (TDD) methodology. Features user authentication, admin dashboard for managing sweets inventory, and a shopping interface for customers.

## Features

- **User Authentication**: Login and registration for both customers and admins
- **Shopping Interface**: Browse and purchase sweets with quantity selection
- **Admin Dashboard**: Manage sweets inventory (CRUD operations)
- **Stock Management**: Add, update, delete, and restock sweets
- **Test-Driven Development**: Comprehensive test coverage with Jest and React Testing Library

## Tech Stack

- **React** 18.3.1
- **React Router DOM** 6.26.0
- **Tailwind CSS** 4.1.18
- **Jest** 29.7.0
- **React Testing Library** 16.0.0
- **Vite** 5.3.4

## Setup

Install dependencies:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

## Testing

This project follows Test-Driven Development (TDD) methodology with comprehensive test coverage.

### Run Tests

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Test Cases

![Test Cases](./images/testcases.png)

### Test Files

The project includes the following test files:

#### App Tests

- **`src/__tests__/App.test.jsx`**
  - Tests app rendering and default home page display

#### Authentication Tests

- **`src/__tests__/auth/Register.test.jsx`**

  - Tests user registration form rendering
  - Tests form input handling
  - Tests registration submission

- **`src/__tests__/components/UserLogin.test.jsx`**
  - Tests login form rendering
  - Tests email and password input handling
  - Tests login functionality

#### Dashboard Tests (Admin Panel)

- **`src/__tests__/pages/DashboardContent.test.jsx`**

  - Tests add sweet functionality
  - Tests form submission with validation
  - Tests new sweet addition to the list
  - Tests modal opening and closing

- **`src/__tests__/pages/DashboardContentGetSweets.test.jsx`**

  - Tests GET API call on component mount
  - Tests sweets display from API response
  - Tests loading state

- **`src/__tests__/pages/DashboardContentEditSweets.test.jsx`**

  - Tests edit modal opening with pre-filled data
  - Tests update API call with correct payload
  - Tests sweet update in the list

- **`src/__tests__/pages/DashboardContentDeleteSweets.test.jsx`**

  - Tests delete API call
  - Tests sweet removal from list
  - Tests admin-only access enforcement
  - Tests deletion cancellation

- **`src/__tests__/pages/DashboardContentRestockSweets.test.jsx`**
  - Tests restock modal opening
  - Tests current stock display
  - Tests quantity input handling
  - Tests restock API call
  - Tests stock update in UI

#### Shop Tests (User Side)

- **`src/__tests__/pages/ShopPurchaseSweets.test.jsx`**

  - Tests Buy button display for each sweet
  - Tests purchase API call
  - Tests success message display
  - Tests error message display
  - Tests stock update after purchase

- **`src/__tests__/pages/ShopPurchaseQuantity.test.jsx`**
  - Tests quantity input field display
  - Tests quantity change functionality
  - Tests purchase API call with correct quantity
  - Tests default quantity (1) handling
  - Tests Buy button disable when quantity exceeds stock
  - Tests Buy button disable when quantity is less than 1
  - Tests stock update after purchase with quantity
  - Tests success/error messages with quantity

### Test Coverage

All critical user flows are covered:

- ✅ User registration and login
- ✅ Admin dashboard operations (CRUD)
- ✅ Sweet inventory management
- ✅ Purchase functionality
- ✅ Stock management
- ✅ Error handling
- ✅ Admin-only access control

## Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## API Integration

The application integrates with a backend API for:

- User authentication (`/api/auth/login`, `/api/auth/register`)
- Sweet management (`/api/sweets`)
  - GET: Fetch all sweets
  - POST: Create new sweet
  - PUT: Update sweet
  - DELETE: Delete sweet (Admin only)
  - POST `/api/sweets/:id/restock`: Restock sweet (Admin only)
  - POST `/api/sweets/:id/purchase`: Purchase sweet

## Project Structure

```
src/
├── __tests__/          # Test files
│   ├── auth/          # Authentication tests
│   ├── components/    # Component tests
│   └── pages/         # Page tests
├── auth/              # Authentication components
├── components/        # Reusable components
├── config/            # Configuration files
├── pages/             # Page components
└── services/          # API services
```

## Deployment

The application is configured for deployment on Vercel with proper SPA routing support.
