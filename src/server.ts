// backend/src/server.ts
import { dbConnect } from "./config/dbConnect"
import app from "./app"
import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.PORT || 3333

dbConnect().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
  })
})
