// Runner simples de migrações: aplica os .sql de db/ no Postgres do Supabase.
// Uso: node db/migrate.mjs  (lê POSTGRES_URL_NON_POOLING do .env.local)
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Carrega .env.local (sem dependência externa)
for (const line of readFileSync(join(__dirname, "..", ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)="?([^"]*)"?$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const conn = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
if (!conn) throw new Error("POSTGRES_URL_NON_POOLING não encontrado no .env.local");

const client = new pg.Client({ connectionString: conn, ssl: { rejectUnauthorized: false } });
await client.connect();

const files = readdirSync(__dirname).filter((f) => f.endsWith(".sql")).sort();
for (const f of files) {
  process.stdout.write(`aplicando ${f} ... `);
  await client.query(readFileSync(join(__dirname, f), "utf8"));
  console.log("ok");
}

await client.end();
console.log("migrações concluídas.");
