import "dotenv/config";
import express from "express";
const app = express();
import http from "http";
import cors from "cors";
//import socket Server
import { startSocket } from "./Socket/socket.js";
//import endpoint's routes
import telemetryRoute from "./src/Telemetry/routes/telemetryRoutes.js";
import metricsRoutes from "./src/Metrics/routes/metricsRoutes.js";
// import authRoutes from "./src/User/routes/authRoutes.js";
//middlewares

//import error middleware
import { globalErrorHandler } from "./src/ErrorHandlers/errorController.js";
import { customError } from "./src/ErrorHandlers/customError.js";

app.use(cors());
app.use(express.json());
const server = http.createServer(app);

//Start socket server for working with endpoints and arduino data
startSocket(server);

//  ENDPOINTS
//get data from gateway, send them to client, and saved them to db 
app.use("/api/telemetry", telemetryRoute);

//user
// app.use("/api/auth", authRoutes);

//send metrics
app.use("/api/aquarium", metricsRoutes);

//Error handling bad url-adrreses 
app.use((req, res, next) =>{
    const err = new customError(`Can't find ${req.originalUrl} . Please check your URL-adress`, 404);
    next(err);
})

//global error handling
app.use(globalErrorHandler);

const PORT = process.env.PORT;

server.listen(PORT, () => console.log(`Server běží na portu ${PORT}`));
