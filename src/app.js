
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.jon())

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BitLatch API is running",
  });
});

export default app;
