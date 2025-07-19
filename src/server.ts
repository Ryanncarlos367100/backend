import { dbConnect } from "./config/dbConnect"
import app from "./app"
import dotenv from "dotenv"
dotenv.config()

const PORT = Number(process.env.PORT) || 80 // 👈 Porta 80

dbConnect().then(() => {
  app.listen(PORT, '0.0.0.0', () => { // 👈 Ouve todas as interfaces (não só localhost)
    console.log(`🚀 Servidor rodando em http://0.0.0.0:${PORT}`)
  })
})
