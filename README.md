# Login Demo Application

A full-stack login application with React frontend and Node.js/Express backend.

## Features

- User authentication (login/register)
- Form validation
- Remember me functionality
- Password reset
- MongoDB database integration
- JWT token-based authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd login-demo-app
```

2. Install dependencies:
```bash
npm run install-all
```

3. Create a `.env` file in the root directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/login-demo
JWT_SECRET=your-super-secret-key-change-this-in-production
```

4. Start MongoDB:
```bash
mongod
```

5. Start the development servers:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
login-demo-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   └── App.tsx       # Main App component
├── src/                   # Backend source
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   └── server.ts         # Express server
├── .env                  # Environment variables
└── package.json          # Project dependencies
```

## API Endpoints

- POST /api/auth/login - User login
- POST /api/auth/register - User registration
- POST /api/auth/forgot-password - Password reset request

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

MIT