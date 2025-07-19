import { dbConnect } from "./config/dbConnect"
import app from "./app"
import dotenv from "dotenv"
dotenv.config()

const PORT = Number(process.env.PORT) || 3333 // 👈 Usa porta do .env ou 3333

dbConnect().then(() => {
  app.listen(PORT, '0.0.0.0', () => { // 👈 Escuta em todas as interfaces (ex: IP público)
    console.log(`🚀 Servidor rodando em http://0.0.0.0:${PORT}`)
  })
})
