import express from "express"
import cors from "cors"
import path from "path"
import userRoutes from "./routes/userRoutes"
import adminRoutes from "./routes/adminRoutes"
import palpiteRoutes from "./routes/palpiteRoutes"
import resultadoRoutes from "./routes/resultadoRoutes"
import smsRoutes from "./routes/smsRoutes"
import publicRoutes from "./routes/publicRoutes"
import pagamentoRoutes from "./routes/pagamentoRoutes"
import pixRoutes from "./routes/pixRoutes"
import mercadoPagoRoutes from "./routes/mercadoPagoRoutes"
import timeRoutes from "./routes/timeRoutes"
import jogoRoutes from "./routes/jogoRoutes"

const app = express()

app.use(cors({
  origin: [
    "http://localhost:3000", // testes locais
    "https://bolaoja.vercel.app", // seu frontend na Vercel
    "https://bolãojacobina.com", // domínio com acento
    "https://xn--bolojacobina-4bb.com", // versão codificada (punycode)
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}))


app.use(express.json())
app.use("/uploads", express.static(path.resolve("uploads")))

app.use("/api", userRoutes)
app.use("/api", adminRoutes)
app.use("/api", palpiteRoutes)
app.use("/api", resultadoRoutes)
app.use("/api", smsRoutes)
app.use("/api/public", publicRoutes)
app.use("/api", pagamentoRoutes)
app.use("/api/pix", pixRoutes)
app.use("/api/mercadopago", mercadoPagoRoutes)
app.use("/api", timeRoutes)
app.use("/api", jogoRoutes)

app.get("/", (req, res) => {
  res.send("🎉 API do Bolão Jacobina está rodando!")
})

export default app

