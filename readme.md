# Chatty

A real-time chat application supporting 1-1 messaging with image sharing.

## Tech Stack

- MongoDB
- Express.js
- React.js
- Node.js
- Socket.IO
- Cloudinary
- JWT (JSON Web Tokens)
- Mongoose
- Zustand
- TailwindCSS
- DaisyUI

## Features

- User authentication with JWT
- Real-time chat using Socket.IO
- Online/offline user tracking
- Image upload via Cloudinary
- Zustand for state management
- Responsive UI with TailwindCSS and DaisyUI

## Installation

### Backend

```bash
cd backend
yarn install
```

### Frontend

```bash
cd frontend
yarn install
```

## Running the Application

### Backend

```bash
cd backend
yarn dev
```

### Frontend

```bash
cd frontend
yarn dev
```

## Environment Variables

### Backend (`/backend/.env`)

```
PORT=
JWT_SECRET=
MONGODB_URI=
NODE_ENV=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend (`/frontend/.env`)

```
VITE_API_URL=
VITE_API_BASE_URL=
```

## License

MIT
