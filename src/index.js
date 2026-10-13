import "dotenv/config";
import app from "./app.js";
import { pool } from "./db/index.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await pool.query("SELECT 1");

    app.listen(PORT, () => {
      console.log(`BitLatch API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start BitLatch:", error.message);
    await pool.end();
    process.exit(1);
  }
}

startServer();
