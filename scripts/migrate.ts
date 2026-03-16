import { db } from "@/db";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "path";

async function main() {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  console.log("Migrations complete!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
