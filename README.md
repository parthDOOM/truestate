# TruEstate

A modern retail sales management system for tracking and analyzing transactions.

![TruEstate Dashboard](frontend/public/image.png)

## Features

- **830K+ Transactions** - Handle large-scale retail data
- **Smart Search** - Search by customer, phone, or product
- **Advanced Filters** - Filter by region, status, payment method, etc.
- **Analytics Dashboard** - Charts for revenue, status, and categories
- **Dark/Light Theme** - Toggle between themes
- **Transaction Details** - Click any row to view full details
- **CSV Export** - Export filtered data

## Quick Start

```bash
# Backend
cd backend
npm install
npm run seed    # Seed database (requires MongoDB)
npm run dev     # Start on port 5000

# Frontend (new terminal)
cd frontend
npm install
npm run dev     # Start on port 5173
```

Open **http://localhost:5173**

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Tailwind CSS, Recharts |
| Backend | Express.js, Mongoose |
| Database | MongoDB Atlas |

## Environment

Create `backend/.env`:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/truestate
```

## Limitations

- Atlas Free Tier: 512MB limit (~830K records)
- CSV Export: Max 50K records
