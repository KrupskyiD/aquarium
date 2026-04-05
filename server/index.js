import "dotenv/config";
import express from "express";
const app = express();
import aquariumRoutes from "./src/routes/aquariumRoutes.js";
import cors from 'cors'
import {Server} from 'socket.io'
import http from 'http'
import telemetryRoute from './src/Telemetry/routes/telemetry.js'

app.use(cors());
app.use(express.json());
const server = http.createServer(app);

export const io = new Server(server,{
    cors:{
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'UPDATE', 'DELETE'],
    },
});

io.on('connection', (socket) => {
        
    })

app.use('/api/telemetry', telemetryRoute);



app.use("/api/aquarium", aquariumRoutes);

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server běží na portu ${PORT}`));
