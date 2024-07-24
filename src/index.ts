import express, { Express, Request, Response } from "express";
import "dotenv/config";
import apiRoutes from "./api/api.router";
import dbConnect from "./shared/db/conn";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT || 3000;

dbConnect();
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`[Server]: Server is running at http://localhost:${port}`);
});
