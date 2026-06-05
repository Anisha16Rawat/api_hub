# 🚀 API Hub

A production-ready collection of RESTful APIs built with **Node.js** and **Express.js**, featuring JWT authentication, role-based access, and clean MVC architecture.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MySQL |
| Auth | JWT + HTTP-only Cookies |
| Templating | EJS |
| Security | bcrypt, input validation |

---

## 📁 Project Structure

```
api_hub/
├── config/         # DB and environment config
├── controller/     # Business logic
├── middleware/     # Auth & error middleware
├── router/         # API route definitions
├── services/       # Reusable service layer
├── helper/         # Utility functions
├── sendemail/      # Email service
├── views/          # EJS templates
└── index.js        # App entry point
```

---

## ✨ Features

- ✅ JWT Authentication with HTTP-only cookies
- ✅ Full CRUD REST API
- ✅ MVC Architecture
- ✅ Password hashing with bcrypt
- ✅ Input validation & error handling
- ✅ Email service integration
- ✅ Modular, scalable folder structure

---

## ⚙️ Getting Started

```bash
# Clone the repo
git clone https://github.com/Anisha16Rawat/api_hub.git
cd api_hub

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the server
npm start
```

---

## 🔐 Environment Variables

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=api_hub
JWT_SECRET=your_jwt_secret
```

---

## 👩‍💻 Author

**Anisha Rawat** — Backend Developer  
[LinkedIn](https://linkedin.com/in/anishaaks) • [GitHub](https://github.com/Anisha16Rawat)

---

⭐ If you found this useful, please consider starring the repo!
