# YouTube-Like Backend

This project showcases a **YouTube-like backend** built with **Node.js**, **Express**, and **MongoDB**. It implements **JWT-based authentication and authorization**, comprehensive **CRUD** operations, and core features such as **video posting**, **liking**, **commenting**, **subscriptions**, and **community posts**. Leveraging **MongoDB aggregation pipelines** for data insights, the codebase demonstrates a clean, modular structure with robust endpoint handling—ideal for anyone exploring scalable REST API design and modern backend best practices.

## Features

- **JWT Authentication & Authorization**: Securely manage user sessions and permissions.
- **CRUD Operations**: Comprehensive routes for users, videos, comments, and more.
- **Video & Post Management**: Upload, edit, delete videos, and create community posts.
- **Like & Comment System**: Users can like and comment on videos, tweets, or community posts.
- **Subscriptions**: Follow or subscribe to channels/users, view subscriber counts.
- **MongoDB Aggregation Pipelines**: Efficient data processing and analytics.
- **Clean REST Architecture**: Structured routes, controllers, and middleware.

## Tech Stack

- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for creating robust RESTful APIs.
- **MongoDB**: NoSQL database for flexible data storage.
- **Mongoose**: ODM for seamless MongoDB integration.

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/WhisperNet/TubeBackend.git
   ```
2. **Install dependencies**:
   ```bash
   cd TubeBackend
   npm install
   ```
3. **Configure environment variables** (e.g., `.env` file) with your database connection string and JWT secret.
4. **Start the server**:
   ```bash
   npm start
   ```

