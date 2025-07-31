# 🌐 SiteIngest

**Host. Monetize. Earn.**
SiteIngest is a fullstack SaaS application that lets users host their websites with subdomain support, injects ads to monetize traffic, and provides a built-in analytics dashboard with impressions tracking and an admin panel.

---

## 🚀 Features

* 🖥️ **Custom Site Hosting** with subdomain support
* 💰 **Ad Injection for Monetization**
* 📊 **Analytics** (Impression tracking)
* 🛠️ **Admin Panel** to manage sites
* 🔐 **Authentication & Authorization** (via PocketBase)
* 🧹 **Deploy/Delete Website** via simple ZIP upload
* 🧾 **Clean API Design** using Flask microservice
* 📦 Built with **React**, **Bootstrap**, **PocketBase**, and **Flask**

---

## 🛠 Tech Stack

| Layer    | Tech                               |
| -------- | ---------------------------------- |
| Frontend | React + Bootstrap                  |
| Backend  | Flask (Microservice)               |
| Database + OAuth | PocketBase                         |
| Hosting  | Not deployed yet (VPS coming soon) |

---


## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/siteingest.git
cd siteingest
```

### 2. Install Dependencies

#### Python (Flask microservice)

```bash
pip install uv
uv sync
```

#### React Frontend

```bash
cd frontend
npm install
```

### 3. Install & Run PocketBase

Download PocketBase from [https://pocketbase.io](https://pocketbase.io)
Extract and run the server:

```bash
pocketbase serve --automigrate
```

> Configure collections for `users`, `sites`, `impressions` as per your app's needs.

### 4. Environment Variables

Create a `.env` file in the backend directory:

```env
POCKETBASE_URL=http://127.0.0.1:8090
```

### 5. Run the Project

Use the `startup.bat` file (Windows) or run manually:

---
