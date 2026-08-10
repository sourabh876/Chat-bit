# Chat   bit — Real   Time Chat Application

A real   time chat application built using React, Node.js, Express.js, Socket.io, and MongoDB.

The application allows users to join using a username, send and receive messages instantly, view previous messages, and track message delivery/read status.

## Features

### Core Features

* Local storage based dummy login
* Persistent login using browser localStorage
* Logout functionality
* Send messages
* Receive messages instantly using Socket.io
* Chat history stored in MongoDB
* Message timestamps
* Sent, delivered, and read message status
* Real   time typing indicator
* Online/offline user status
* REST APIs for message operations
* Real   time communication using Socket.io
* Responsive and user   friendly chat interface

### Real   Time Communication

Socket.io is used for real   time communication between connected clients.

When a user sends a message:

  text
Sender
   ↓
Socket.io
   ↓
Node.js Server
   ↓
Receiver
 

The message is also persisted in MongoDB so that previous messages remain available after refreshing the application.

## Technology Stack

### Frontend

* React.js
* JavaScript
* CSS
* Socket.io Client
* Axios

### Backend

* Node.js
* Express.js
* Socket.io
* Mongoose

### Database

* MongoDB Atlas

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

## Project Structure

   text
Chat   bit/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   ├── .env.example
│   └── package.json
│
└── README.md
   

## Local Setup

### 1. Clone the repository

   bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Chat   bit
   

## Backend Setup

Navigate to the backend:

   bash
cd backend
   

Install dependencies:

   bash
npm install
   

Create a    .env    file:

   env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
   

Start the backend in development mode:

   bash
npm run dev
   

The backend should run on:

   text
http://localhost:5000
   

## Frontend Setup

Open another terminal and navigate to the frontend:

   bash
cd frontend
   

Install dependencies:

   bash
npm install
   

Create a    .env    file:

   env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
   

Start the frontend:

   bash
npm run dev
   

The frontend will normally be available at:

   text
http://localhost:5173
   

## Environment Variables

### Backend

       PORT               Port used by the Node.js server             
       MONGODB_URI        MongoDB connection string                   
       CLIENT_URL         Frontend URL used for CORS and Socket.io    

### Frontend

    Variable              Description                     
                                                                                                                                                    
       VITE_API_URL           Backend REST API URL            
       VITE_SOCKET_URL        Backend Socket.io server URL    

Never commit the actual    .env    files containing credentials.

## REST APIs

### Send Message

   text
POST /api/messages
   

Used to create and store a new chat message.

### Fetch Chat History

   text
GET /api/messages
   

Returns previously stored messages from MongoDB.

### Health Check

   text
GET /api/health
   

Used to verify that the backend is running and the database connection is available.

## Socket.io Events

The application uses Socket.io for real   time communication.

Important events include:

   text
connection
disconnect
send_message
new_message
message_delivered
message_read
typing
stop_typing
   

The exact event names correspond to the implementation in the application.

## Message Status

Messages use the following status flow:

   text
sent
  ↓
delivered
  ↓
read
   

### Sent

The message has been created/sent by the sender.

### Delivered

The receiver's connected client has received the message.

### Read

The receiver has the message visible in the active chat and the client reports it as read.

## Design Decisions

### Socket.io for Real   Time Messaging

Socket.io was selected because real   time communication is a mandatory requirement of the assignment.

It allows the server to broadcast new messages to connected users without requiring page refreshes or polling.

### MongoDB for Persistence

MongoDB is used to store messages so that chat history remains available after refreshing the application.

### REST + Socket.io

REST APIs are used for persistent operations such as fetching chat history, while Socket.io handles real   time communication.

This separates historical data retrieval from real   time events.

### localStorage for Dummy Authentication

The assignment allows username   based dummy authentication as an optional feature.

The username is stored in browser localStorage so that refreshing the application does not require the user to enter the username again.

This is not intended to be production   grade authentication.

## Assumptions

* Username   based authentication is dummy authentication and does not use passwords or JWT.
* Users are identified by their entered usernames.
* The application is designed primarily for a simple real   time chat use case.
* MongoDB is responsible for persistent message storage.
* Socket.io is required for real   time message delivery.
* A connected user is considered online while their Socket.io connection is active.
* Message read status is updated when the message is received and visible in the active chat.

## Error Handling

The application handles common API and Socket.io errors and displays connection status to the user.

The backend also verifies its MongoDB connection during startup.

## Deployment

### Frontend

The React frontend is deployed using Vercel.

   text
YOUR_FRONTEND_URL
   

### Backend

The Node.js/Express backend is deployed using Render.

   text
YOUR_BACKEND_URL
   

### Database

MongoDB Atlas is used for production database storage.

 

## Submission

### GitHub Repository

   text
YOUR_GITHUB_REPOSITORY_URL
   

### Live Frontend

   text
YOUR_FRONTEND_URL
   

### Live Backend

   text
YOUR_BACKEND_URL
   

### Screen Recording

   text
YOUR_GOOGLE_DRIVE_RECORDING_URL
   
 
