# IntervAI

### AI interview prep platform with real-time Q&A, feedback via WebSockets, and detailed session reports.

#### Features
- AI-generated interview questions based on job descriptions.
- Real-time Q&A and feedback using WebSockets.
- AI-powered answer evaluation with ratings and improvements.
- Detailed interview feedback reports on the dashboard.

### Working
![image](https://github.com/user-attachments/assets/84054ff7-5d91-424d-8b10-7a94d0d84754)
![output-onlinepngtools](https://github.com/user-attachments/assets/2ef6c63a-7fa0-4f10-85b4-360428b608f0)


### Setup
- Install Docker
- Run `git clone https://github.com/SadanandMiskin/intervAI`
- `cd intervAI`
- `cd backend`
- In `backend` folder create `.env` file using the existing `.env.example` contents
  ```bash
  FIREWORKS_API_KEY=  # Get from fireworks AI
  MONGODB=mongodb://localhost:27017
  JWT_SECRET=your_jwt_secret  # Change this (optional)
  GOOGLE_CLIENT_ID= # Get this from google console
  FRONTEND_URL=http://localhost:5173
  ```
- In the root folder of app `intervAI`, Start the containers as:
```
  docker-compose up
  ```
- frontend is running on `localhost:5173`
- backend running on `localhost:3000`
- Stop the containers:
```
  docker-compose down
```

### ScreenShot
![Screenshot from 2025-03-22 00-13-24](https://github.com/user-attachments/assets/72a79b74-4b5a-4182-863c-7e4bf8bf7a98)
![image](https://github.com/user-attachments/assets/fb21cba2-68c3-4765-9506-0ac76facd489)

![image](https://github.com/user-attachments/assets/6cfdfef8-1d59-488f-8855-4229f902b232)

