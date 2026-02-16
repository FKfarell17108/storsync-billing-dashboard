# StorSync Billing Dashboard

This is the admin dashboard for StorSync Billing, built with Next.js, Tailwind CSS, and TypeScript.

## Getting Started

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Configure API URL:**

    By default, the dashboard connects to `http://storsync-billing.test/api`.
    If your Laravel API is running on a different URL (e.g., `http://localhost:8000/api`), create a `.env.local` file in the root of the `dashboard` directory:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000/api
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

-   **Dashboard**: Overview of key metrics (Customers, Active Subscriptions, Pending Invoices, Revenue).
-   **Customers**: View customer list.
-   **Packages**: View available packages.
-   **Subscriptions**: View customer subscriptions.
-   **Invoices**: View invoice status and details.
-   **Payments**: View payment history.
