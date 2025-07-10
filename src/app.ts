// backend/src/app.ts
import express from "express"
import cors from "cors"
import path from "path"
import userRoutes from "./routes/userRoutes"
import adminRoutes from "./routes/adminRoutes"
import palpiteRoutes from "./routes/palpiteRoutes"
import resultadoRoutes from "./routes/resultadoRoutes"
//adicionei isso 
import smsRoutes from "./routes/smsRoutes"
import publicRoutes from "./routes/publicRoutes"
import pagamentoRoutes from "./routes/pagamentoRoutes"

const app = express()

app.use(cors({
  origin: [
    "http://localhost:3000", // para testes locais
    "https://bolao-frontend-j4i4lgrvy-ryanncarlos367100s-projects.vercel.app", // Vercel
    "https://xn--bolojacobina-4bb.com", // domínio HTTPS com Punycode
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
// adicionei isso
app.use("/api", smsRoutes)
app.use("/api/public", publicRoutes)
app.use("/api", pagamentoRoutes)

// ✅ Rota da home (http://localhost:3333/)
app.get("/", (req, res) => {
  res.send("🎉 API do Bolão Jacobina está rodando!")
})

export default app
