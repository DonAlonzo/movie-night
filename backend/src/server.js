import express from "express";
import { connectToDatabase } from "./db";

export default async config => {
  const mongo = await connectToDatabase(config); 

  const app = express();

  app.listen(80, () => console.log(`🚀 Server listening on 80`));
};