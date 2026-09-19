import { seedDatabase } from "./seed";
import { pool } from "./index";

async function run() {
  try {
    await seedDatabase();
    console.log("Seed execution finished.");
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

run();
