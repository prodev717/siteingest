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
| Database + OAuth | PocketBase (v0.28.4)                         |
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

### 3. Install & Run PocketBase (v0.28.4)

Download PocketBase from [https://pocketbase.io](https://pocketbase.io)
Extract and run the server:

```bash
pocketbase serve --automigrate
```

> Configure collections for `users`, `sites`, `impressions` as per your app's needs.

### 4. Environment Variables

Create a `.env` file in the backend directory (root):

```env
POCKETBASE_URL=http://127.0.0.1:8090
```

Create a `.env` file in the frontend directory (`frontend/`):

```env
VITE_POCKETBASE_URL=http://127.0.0.1:8090
VITE_MICROSERVICE_URL=http://localhost:8000
VITE_MICROSERVICE_HOST=localhost:8000
VITE_REVENUE_EMAIL=revenue@siteingest.com
```

### 5. Run the Project

Use the `startup.bat` file (Windows) or run manually:

---

## 🌍 Production Deployment

If you are planning to deploy SiteIngest in production on a VPS (like DigitalOcean, AWS EC2, or Hetzner), the architecture requires specific routing for subdomains to function properly.

### Subdomain Routing Theory
The Flask backend uses `request.host.split(".")[0]` to dynamically resolve which site to serve.
For this to work, you need two things:
1. **Wildcard DNS**: A `* A` record pointing to your server's IP address (e.g., `*.siteingest.com -> 198.51.100.1`).
2. **Proper Reverse Proxy**: Nginx must pass the original `Host` header to the Flask backend so it can extract the subdomain.

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name siteingest.com www.siteingest.com *.siteingest.com;

    location / {
        # Forward the original host header to the Flask microservice
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Assuming Gunicorn/Waitress is running on port 8000
        proxy_pass http://127.0.0.1:8000;
    }
}
```

### Additional Production Considerations
* **WSGI Server**: In production, do not use `app.run()`. Serve the Flask app via a production WSGI server like Waitress (Windows) or Gunicorn (Linux).
* **Process Manager**: Use `systemd`, `pm2`, or `supervisor` to keep your Flask backend and PocketBase running continuously.
* **Reserved Subdomains**: To prevent users from registering names like `www`, `api`, or `admin`, ensure you implement validation logic to block these specific strings during the subdomain selection step.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

