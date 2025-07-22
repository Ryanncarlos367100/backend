import { Router } from "express"
import Palpite from "../models/Palpite"

const router = Router()

router.get("/estatisticas", async (req, res) => {
  try {
    const totalPalpites = await Palpite.countDocuments()
    const totalParticipantes = await Palpite.distinct("userId").then(ids => ids.length)

    const valorPorPalpite = 15
    const totalArrecadado = totalPalpites * valorPorPalpite
    const comissao = totalArrecadado * 0.3
    const premio = totalArrecadado * 0.7

    res.json({
      participantes: totalParticipantes,
      totalPalpites,
      totalArrecadado,
      comissao,
      premio
    })
  } catch (err) {
    console.error("Erro ao buscar estatísticas:", err)
    res.status(500).json({ message: "Erro interno" })
  }
})

export default router

