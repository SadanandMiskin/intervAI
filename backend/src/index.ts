import express, { Express, NextFunction, Request, Response } from "express";
import http from 'http'
import cors from 'cors'
import { Server } from "socket.io";

import interviewRoutes from './routes/interview'

const app: Express = express();
const server = http.createServer(app)

const io = new Server(server , {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET' , 'POST']
  }
})

io.on('connection' , (socket) => {
  console.log('USer connected' , socket.id)

  socket.on('sendjd' , (data) => {
    console.log(data)
  })

  socket.on('disconnect', ()=>{
    console.log('disconnect' , socket.id)
  })
})

const port = process.env.PORT || 3000;
app.use(express.json())

app.use('/api/v1/interview' , interviewRoutes)


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});