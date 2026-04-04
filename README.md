# IFN636 Travel Guide Platform

A full-stack web application built with **React.js**, **Node.js**, **Express**, and **MongoDB** as part of the IFN636 Software Life Cycle Management assessment. The platform allows users to browse destinations around the world and plan itineraries for their travel, functioning like an "online tour guidebook" that displays destination information, landmarks, and unique features of places around the world.

---

## Test credentials

| Field        | Value         |
| ------------ | ------------- |
| **Email**    | test@user.com |
| **Password** | test          |

---

## Features

1. **Itinerary CRUD** — authenticated users can create, view, edit, and delete personal travel itineraries through a card-based dashboard with a modal popup form.

2. **CI/CD Pipeline** — This project uses **GitHub Actions** with a **self-hosted runner** on AWS EC2 to automate testing and deployment, triggered on every push to `main`. Requires `MONGO_URI`, `JWT_SECRET`, `PORT`, and `PROD` environment secrets configured in GitHub.

---

## Tech Stack

| Layer           | Technology                          |
| --------------- | ----------------------------------- |
| Frontend        | React.js, Tailwind CSS, Axios       |
| Backend         | Node.js, Express.js                 |
| Database        | MongoDB Atlas (Mongoose)            |
| Authentication  | JWT (JSON Web Tokens)               |
| Deployment      | AWS EC2 (Ubuntu)                    |
| Web Server      | Nginx (reverse proxy)               |
| Process Manager | PM2                                 |
| CI/CD           | GitHub Actions (self-hosted runner) |
| Version Control | Git + GitHub                        |

## Local Setup Instructions

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v22 or above)
- [Git](https://git-scm.com/)
- A MongoDB Atlas account with a cluster set up

### 1. Clone the repository

```bash
git clone https://github.com/le-lim/IFN636-Travel-Guide-Platform.git
cd IFN636-Travel-Guide-Platform
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5001`

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`

### 4. Run backend tests

```bash
cd backend
npm test
```

---

### GitHub Secrets required

| Secret Name  | Description                                 |
| ------------ | ------------------------------------------- |
| `MONGO_URI`  | MongoDB Atlas connection string             |
| `JWT_SECRET` | Secret key for JWT signing                  |
| `PORT`       | Backend port number (5001)                  |
| `PROD`       | Full contents of the production `.env` file |
