# Drello

A modern, high-performance task management application built with the MERN stack (MongoDB, Express, React, Node.js). Designed to help individuals and teams organize their workflow with intuitive drag-and-drop functionality, real-time updates, and a sleek user interface.

## ✨ Features

- **User Authentication:** Secure signup and login using JWT (JSON Web Tokens).
- **Custom Boards:** Create multiple dedicated boards for different projects or workflows.
- **Dynamic Columns:** Add, edit, and organize columns to match your exact pipeline (e.g., Todo, In Progress, Done).
- **Drag & Drop Tasks:** Seamlessly drag tasks across columns for a fluid workflow experience.
- **Task Management:** Create, edit, and delete tasks with instant optimistic UI updates.
- **Fully Responsive:** Optimized for both desktop and mobile viewing.

## 🛠 Tech Stack

**Frontend:**
- React (bootstrapped with Vite)
- `@hello-pangea/dnd` for fluid drag-and-drop interactions
- Context API for state management
- Vanilla CSS with modern, dark-mode-first aesthetic

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose ORM
- JSON Web Tokens (JWT) for stateless authentication
- bcryptjs for password hashing

## 🚀 Getting Started Locally

### Prerequisites
- Node.js installed on your machine
- A MongoDB cluster (or local MongoDB instance)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AmeySingh19/Drello.git
   cd Drello
   ```

2. **Setup the Backend:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend:**
   Open a new terminal window:
   ```bash
   cd client
   npm install
   ```
   *(Optional)* If you are testing a production build locally, create a `.env` in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Open the app:**
   Visit `http://localhost:5173` in your browser.

## ☁️ Deployment

Drello is configured for easy deployment across popular cloud providers. 

### Backend (Render)
1. Connect your repository to Render.
2. Create a new Web Service pointing to the `server` root directory.
3. Set the build command to `npm install` and start command to `node server.js`.
4. Add your `MONGO_URI` and `JWT_SECRET` environment variables.

### Frontend (Vercel)
1. Connect your repository to Vercel.
2. Set the root directory to `client`.
3. Add an environment variable named `VITE_API_URL` pointing to your deployed Render backend (e.g., `https://your-backend.onrender.com/api`).
4. Deploy!

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
