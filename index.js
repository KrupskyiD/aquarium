import "dotenv/config";
import express from "express";
import aquariumRoutes from "./src/routes/aquariumRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/aquarium", aquariumRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server běží na portu ${PORT}`));
