import { Pool } from "pg";

export const db = new Pool({
  user: "neondb_owner",
  host: "ep-curly-sound-ahcrxe5b-pooler.c-3.us-east-1.aws.neon.tech",
  database: "neondb",
  password: "npg_WUmQdXwNZ2f6",
  port: 5432,
  ssl: { rejectUnauthorized: false },
});


// JAVA -> JPA, JDBC -> POO -> String connection
// Express de Node.js
//    -> Controlador cómo 'pg' para pegarnos a una base de datos PostgreSQL
//    -> Controlador cómo 'mssql' para pegarnos a una base de datos Sql Server