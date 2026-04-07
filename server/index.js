import "dotenv/config";
import express from "express";
const app = express();
import http from "http";
import cors from "cors";
import { startSocket } from "./Socket/socket.js";
import telemetryRoute from "./src/Telemetry/routes/telemetry.js";
import aquariumRoutes from "./src/routes/aquariumRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

app.use(cors());
app.use(express.json());
const server = http.createServer(app);

//Start socket server for working with endpoints and arduino data
startSocket(server);

app.use("/api/telemetry", telemetryRoute);
app.use("/api/auth", authRoutes);
app.use("/api/aquarium", aquariumRoutes);

const PORT = process.env.PORT;

server.listen(PORT, () => console.log(`Server běží na portu ${PORT}`));
