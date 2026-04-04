import "dotenv/config";
import express from "express";
import aquariumRoutes from "./src/routes/aquariumRoutes.js";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import authRoutes from "./src/routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/aquarium", aquariumRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "UPDATE", "DELETE"],
  },
});

io.on("connection", (socket) => {});

const PORT = process.env.PORT;

server.listen(PORT, () => console.log(`Server běží na portu ${PORT}`));
