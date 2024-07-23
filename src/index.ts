import express, { Express, Request, Response } from "express";
import "dotenv/config";
import apiRoutes from "./api/api.router";
import dbConnect from "./shared/db/conn";

const app: Express = express();
const port = process.env.PORT || 3000;

dbConnect();
app.use(express.json());


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`[Server]: Server is running at http://localhost:${port}`);
});
