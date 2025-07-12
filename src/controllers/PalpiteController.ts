import { Request, Response } from "express"
import Palpite from "../models/Palpite"
import Resultado from "../models/Resultado"
import mongoose from "mongoose"

export const criarPalpite = async (req: Request, res: Response) => {
  try {
    const { userId, pagamentoId, palpites } = req.body

    if (!userId || !pagamentoId || !Array.isArray(palpites) || palpites.length === 0) {
      return res.status(400).json({ message: "Dados incompletos ou palpites inválidos" })
    }

   const agora = new Date()
   const dataJogo = new Date("2025-07-12T18:00:00-03:00")

   if (agora.getTime() >= dataJogo.getTime()) {
      return res.status(403).json({ message: "Prazo de palpites encerrado" })
    }


    // Verifica se já existem palpites desse pagamento
    const palpitesExistentes = await Palpite.find({ userId, pagamentoId })
    if (palpitesExistentes.length > 0) {
      return res.status(400).json({ message: "Palpites já enviados para esse pagamento" })
    }

    const palpitesComInfo = palpites.map((p: any) => ({
      userId,
      pagamentoId,
      river: p.river,
      gremio: p.gremio,
    }))

    const palpitesSalvos = await Palpite.insertMany(palpitesComInfo)

    return res.status(201).json({ message: "Palpites salvos com sucesso", palpites: palpitesSalvos })
  } catch (err) {
    console.error("Erro ao criar palpites:", err)
    return res.status(500).json({ message: "Erro interno" })
  }
}

export const listarParticipantes = async (req: Request, res: Response) => {
  try {
    const palpites = await Palpite.find().populate("userId").sort({ "userId.nome": 1 })
    const lista = palpites.map((p) => ({
      nome: (p.userId as any)?.nome,
      email: (p.userId as any)?.email,
      telefone: (p.userId as any)?.telefone,
      palpite: { river: p.river, gremio: p.gremio },
      acertou: p.acertou,
      criadoEm: p.criadoEm
    }))
    return res.json(lista)
  } catch (err) {
    console.error("Erro ao listar participantes:", err)
    return res.status(500).json({ message: "Erro ao buscar participantes" })
  }
}

export const listarPalpitesPorUsuario = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID inválido" })
    }
    const palpites = await Palpite.find({ userId }).sort({ criadoEm: -1 })
    return res.json(palpites)
  } catch (err) {
    console.error("Erro ao buscar palpites do usuário:", err)
    return res.status(500).json({ message: "Erro interno" })
  }
}
