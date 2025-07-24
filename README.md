
# 🌍 Tour Booking Platform

A full-stack tour booking system where travel agents can register and submit tours, users can book tours, and admins manage approvals and monitor activity. This document provides a complete overview of how the platform works.

---

## 🎯 Purpose

To simplify the process of offering and booking tours:
- Tour agents can submit tours.
- Customers can book available tours.
- Admins approve or reject submitted tours and oversee all activities.

---

## 🧭 User Flow (Client-Friendly Overview)

### 1. 👥 **User Registration & Login**
- **Two types of users**:
  - **Tour Providers (Agents)** – can create and submit tour listings.
  - **Customers** – can browse and book tours.
- Secure registration and login using email and password.

---

### 2. 📤 **Tour Submission (By Agents)**
- Agents can log in and:
  - Submit a new tour by filling a form with:
    - Tour name, image, description, price, date, location, available seats, etc.
  - View status of submitted tours:
    - **Pending**, **Approved**, or **Rejected**

---

### 3. ✅ **Admin Approval**
- Admin reviews all new tour submissions.
- Tours will only be shown to customers **after admin approval**.
- Admin actions:
  - Approve or reject tours.
  - Monitor bookings and users.

---

### 4. 🔎 **Browse & View Tours (For Customers)**
- Customers can view all **approved tours**.
- Filter by destination, price, date, etc.
- Click on a tour to see:
  - Full details, images, pricing, availability, and agent info.

---

### 5. 🛒 **Booking a Tour**
- Customers click **“Book Now”**.
- Confirm tour details.
- Booking will be saved in their account.

---

### 6. 📋 **User Dashboard**
- Customers see:
  - All their booked tours.
  - Status (upcoming, completed, or canceled).
  - Option to cancel or request to **swap tour** (if enabled).

---

### 7. 🔁 **Tour Swap (Optional Feature)**
- Customers can request to swap to another tour if something comes up.
- The system finds alternatives and allows switching if slots are available.

---

### 8. 🛠 **Admin Panel**
- Admin functionalities include:
  - Approve or reject new tour submissions
  - Manage all users and bookings
  - Handle tour swap requests (if applicable)
  - Access platform analytics (optional)

---

## 🛠 Tech Stack

| Layer       | Technology           |
|-------------|----------------------|
| **Frontend**| React (with Vite)    |
| **Backend** | Node.js + Express.js |
| **Database**| MongoDB (via Atlas)  |
| **Auth**    | JWT (JSON Web Token) |

---

## 🧾 Project Structure

```

/client     --> React frontend
/server     --> Express backend
├── models  --> Mongoose schemas: Tour, User, Booking
├── routes  --> API routes: Auth, Tours, Bookings
├── controllers --> Logic for handling API endpoints
.env        --> Environment config (API keys, DB URI)
README.md

````

---

## ⚙️ Installation Guide

> For Developers or Future Admins

### Step 1: Clone the project

```bash
git clone https://github.com/Henok225/TourSwap/tree/main
cd tour-booking-platform
````

### Step 2: Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd tourgideFrontend
npm install
```

### Step 3: Setup Environment Variables

Create a `.env` file inside the `server/` directory:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

---



## 📦 Future Improvements

* Tour payment integration (Stripe/PayPal)
* Tour ratings and reviews
* Real-time chat with tour providers
* Email notifications for booking and tour status
* Mobile app version

## 📄 License

This project is licensed under the MIT License.


