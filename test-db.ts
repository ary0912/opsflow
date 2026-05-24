import { Pool } from "pg"

const connectionString = "postgresql://postgres:AryL%401209011@db.jvjqywetktiygzhkgjrk.supabase.co:5432/postgres"

const pool = new Pool({
  connectionString,
  max: 5,
  min: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: { rejectUnauthorized: false }
})

async function test() {
  try {
    const client = await pool.connect()
    console.log("Connected successfully!")
    const res = await client.query('SELECT NOW()')
    console.log("Query result:", res.rows)
    client.release()
  } catch (err) {
    console.error("Connection error:", err)
  } finally {
    pool.end()
  }
}

test()
