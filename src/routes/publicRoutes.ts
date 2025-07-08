import { Router } from "express"
import Pagamento from "../models/Pagamento"

const router = Router()

router.get("/estatisticas", async (req, res) => {
  try {
    const totalParticipantes = await Pagamento.countDocuments()
    const totalArrecadado = totalParticipantes * 15
    const premio = totalArrecadado * 0.7

    res.json({
      participantes: totalParticipantes,
      totalArrecadado,
      premio,
    })
  } catch (err) {
    console.error("Erro ao buscar estatísticas:", err)
    res.status(500).json({ message: "Erro interno" })
  }
})

export default router
