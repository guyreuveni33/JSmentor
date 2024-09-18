# Mentor Code Space

Mentor Code Space is an online collaborative coding platform designed to facilitate real-time code collaboration between mentors and students. The platform allows mentors to guide students through coding exercises, providing instant feedback and observing student progress in real time. Students can work on coding blocks, receive feedback, and see when their solution matches the expected output.

## Project Overview

- **Client (Frontend)**: [mentor-code-space.vercel.app](https://mentor-code-space.vercel.app)
- **Server (Backend)**: [mentorcodespace-production.up.railway.app](https://mentorcodespace-production.up.railway.app)
- **GitHub Repository**: [GitHub - MentorCodeSpace](https://github.com/guyreuveni33/MentorCodeSpace.git)

### Features

- **Real-Time Collaboration**: Mentors and students can work on code blocks simultaneously with live updates.
- **Mentor Observation Mode**: Mentors have read-only access to the code while observing the student's progress.
- **Code Validation**: Students' solutions are validated in real-time, mentors and students are notified when the correct solution is submitted.
- **Socket.IO for Real-Time Communication**: Enables real-time updates and collaboration.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Client](#running-the-client)
  - [Running the Server](#running-the-server)
  - [Client and Local Server Configuration](#client-and-local-server-configuration)
 
## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You will need to have the following installed:

- **Node.js** (v14 or above) and **npm**
- **MongoDB** (or MongoDB Atlas for remote database hosting)
- **Git**

### Installation

#### 1. Clone the repository:

```bash
git clone https://github.com/guyreuveni33/MentorCodeSpace.git
cd MentorCodeSpace
```

#### 2. Install Dependencies:

Both the client and server have their own dependencies, so you will need to install them separately.

##### Install client dependencies:

```bash
cd client
npm install
```

##### Install server dependencies:

```bash
cd ../server
npm install
```

### Running the Client

After installing the dependencies, you can start the client using:

```bash
cd client
npm start
```

The client will run on [http://localhost:3000](http://localhost:3000).

### Running the Server

To run the server:

1. Create a `.env` file in the `server` directory with the following content:

   ```
   MONGODB_URI=mongodb+srv://guyhaim55:Uw17m373rAz93CJ8@cluster0.fsmj5.mongodb.net/
   ```

2. Start the server:

```bash
cd server
npm start
```

The server will run on [http://localhost:5000](http://localhost:5000).

## Client and Local Server Configuration

**Important:** The current client is configured to work with the production server (`https://mentorcodespace-production.up.railway.app/`), which is deployed on Railway. If you want to run the client with your local server, you'll need to modify the server URL in the client.

### Steps to modify the client for local server use:

1. Go to the `client/src` folder.
2. Find and open the file where the server URL is being used (typically this will be in API or Socket.IO initialization code).
3. Replace the production URL with the local server URL (`http://localhost:5000`).

For example:

```javascript
// Before
const socket = io('https://mentorcodespace-production.up.railway.app');

// After (for local development)
const socket = io('http://localhost:5000');
```

After making this change, the client will communicate with the local server rather than the production server.

![image](https://github.com/user-attachments/assets/99bf1461-2d9b-4e95-8012-2121e70ebbee)

