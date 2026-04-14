import "dotenv/config";
import express from "express";
const app = express();
import http from "http";
import cors from "cors";
import { startSocket } from "./Socket/socket.js";
import telemetryRoute from "./src/Telemetry/routes/telemetryRoutes.js";
import metricsRoutes from "./src/Metrics/routes/metricsRoutes.js";
import authRoutes from "./src/User/routes/authRoutes.js";
import aquariumRoutes from "./src/Aquarium/routes/aquariumRoutes.js";
import biotopeRoutes from "./src/Biotopes/routes/biotopeRoutes.js";

app.use(cors());
app.use(express.json());
const server = http.createServer(app);

//Start socket server for working with endpoints and arduino data
startSocket(server);

app.use("/api/biotopes", biotopeRoutes);
app.use("/api/aquarium", aquariumRoutes);

app.use("/api/telemetry", telemetryRoute);
app.use("/api/auth", authRoutes);
app.use("/api/metrics", metricsRoutes);



const PORT = process.env.PORT;

server.listen(PORT, () => console.log(`Server běží na portu ${PORT}`));
