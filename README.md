# Double-Entry Accounting System

A minimal accounting ledger application which is the system allows users to record double entry transactions and generate real time financial reports including Journal, Balance Sheet, and Income Statement.

---

## Live Demo

🔗 **Live Application:** https://accounting-app-two-self.vercel.app/

---

## Transaction Management

- Create accounting transactions using double entry principle rule
- Support for:
  - Sales
  - Purchases
  - Receipts
  - Payments
- Multiple debit and credit entries per transaction
- Should be total debit = total credit or a toast error will show

---

## Installation & Setup

### Clone the repository

```bash
git clone https://github.com/tasnim29/accounting-app
cd YOUR-REPO

```

### Install dependencies

```bash
npm install
```

### Environment Variables

#### Create a .env.local file:

```bash
DATABASE_URL=your_local_DB_or_cloud_db_url
```

### Run the development server

```bash
npm run dev
```

## Architecture Overview

```bash
The project follows a simple and clear folder structure using the Next.js App Router:

- `app/page.js`
  Handles transaction creation from

- `app/reports/page.js`
  Main reports page (Journal, Balance Sheet, Income Statement)

- `app/api/transactions`
  API routes for creating, updating and deleting transactions

- `app/api/reports`
  Contains  logic for getting the data from database:
  - Journal report
  - Balance Sheet
  - Income Statement

- `components/`
   UI components such as:
  - `TransactionForm`
  - `JournalReport`
  - `Modal` (edit)

- `lib/db.js`
  PostgreSQL database connection using a connection pool







```
