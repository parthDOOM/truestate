# TruEstate

A modern retail sales management system for tracking and analyzing transactions.

![TruEstate Dashboard](frontend\public\image.png)

## Features

- **830K+ Transactions** - Handle large-scale retail data
- **Smart Search** - Search by customer name, phone, or product
- **Advanced Filters** - Filter by region, status, payment method, and more
- **Live Statistics** - Real-time stats that update with filters
- **CSV Export** - Export filtered data for analysis

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

Open **http://localhost:5173** in your browser.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Tailwind CSS, TanStack Query |
| Backend | Express.js, Mongoose |
| Database | MongoDB Atlas |

## Environment Variables

Create `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/truestate
```

## Limitations

- MongoDB Atlas Free Tier: 512MB limit (~830K of 1M records)
- CSV Export: Limited to 50K records per export

