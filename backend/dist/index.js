"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const interview_1 = __importDefault(require("./routes/interview"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});
io.on('connection', (socket) => {
    console.log('USer connected', socket.id);
    socket.on('sendjd', (data) => {
        console.log(data);
    });
    socket.on('disconnect', () => {
        console.log('disconnect', socket.id);
    });
});
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use('/api/v1/interview', interview_1.default);
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
server.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
