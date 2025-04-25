# 🛒 E-commerce REST API

This project is a RESTful API for an e-commerce application, built with **Node.js**, **Express.js**, and **MongoDB**. It provides endpoints for product management, user authentication, and order processing.

## 🚀 Features

- Product CRUD operations
- User registration and login
- Order management
- JWT authentication middleware
- Modular project structure using TypeScript

## 🧰 Tech Stack

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [TypeScript](https://www.typescriptlang.org/)

## ⚙️ Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/andraRafi/ecommerce-REST-API.git
   cd ecommerce-REST-API
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:

   Create a .env file in the root directory and add the following:

   ```
   PORT=5000
   CONNECTION_STRING=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret`
   JWT_REFRESH_SECRET=your_jwt_secret_refresh
   ```

4. run the server
   🔄 Run the development server:

   ```bash
   npm run dev
   ```

   This will start the server with hot-reload using tsx for a smoother development experience.

   🛠️ Build the app:

   ```bash
   npm run build
   ```

   This will compile all TypeScript (.ts) files into JavaScript (.js) and output them into the dist/ folder (or as specified in tsconfig.json).

   🚀 Run the production server:

   ```bash
   npm start
   ```

   Runs the app from the compiled JavaScript files (e.g. for deployment).

🧪 Testing
Use Postman or a similar tool to test the API endpoints.

🤝 Contributing
Contributions are welcome! Feel free to open issues or submit pull requests to improve this project.
