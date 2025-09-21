# Neura – AI Chatbot Application (MERN Stack)

![Frontend Dark Mode Preview](./frontend/src/assets/neura%20frontend.jpg)

## Project Overview  
This is a full-stack AI Chatbot Application built with the **MERN stack (MongoDB, Express.js, React.js, Node.js)**.  
The application allows users to:  
- Sign up and log in securely.  
- Generate AI-powered text using **Google Gemini AI** (via the OpenAI React package).  
- Generate AI images from prompts using **ImageKit**.  
- Purchase credits online with **Stripe Payment Gateway**.  

---

## Tech Stack  

### Frontend  
- React.js (Vite)  
- Tailwind CSS  
- React Router DOM  
- React Markdown  
- React Icons  
- Motion (animations)  
- PrismJS (code highlighting)  

### Backend  
- Node.js & Express.js  
- MongoDB (Mongoose)  
- JWT Authentication  
- Bcrypt.js (password hashing)  
- Google Gemini API (AI text generation)  
- ImageKit (image generation & storage)  
- Stripe (payment processing)  
- CORS & Dotenv for configuration  

---

## Installation & Setup  

### 1. Clone the Repository  
```bash
git clone https://github.com/JOSIAHTHEPROGRAMMER/Neura.git
cd Neura
```

### 2. Backend Setup
```bash
cd backend
npm install
```

#### Create a .env file in /backend with:

```ini
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY = your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET = your_stripe_webhook_secret
GEMINI_API_KEY=your_gemini_api_key
```

#### Run the backend:

```bash
npm run server
```

### 3. Frontend Setup

```bash

cd ../frontend
npm install
npm run dev
## Frontend will run on: http://localhost:5173
## Backend will run on: http://localhost:5000
```

## Features
- User authentication with JWT

- AI-powered text generation (Google Gemini)

- AI-powered image generation (ImageKit)

- Credit-based system with online payments (Stripe)

- Modern dark-mode/light-mode UI built with Tailwind CSS and Motion

- Community page and chat history

Fully deployable to cloud platforms

