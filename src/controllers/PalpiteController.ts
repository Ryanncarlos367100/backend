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

    const palpitesExistentes = await Palpite.find({ userId, pagamentoId })
    if (palpitesExistentes.length > 0) {
      return res.status(400).json({ message: "Palpites já enviados para esse pagamento" })
    }

    const palpitesComInfo = palpites.map((p: any) => ({
      userId,
      pagamentoId,
      corinthians: p.corinthians,
      cruzeiro: p.cruzeiro,
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
    const palpites = await Palpite.find().populate("userId").sort({ criadoEm: 1 })

    const mapa = new Map<string, any>()

    palpites.forEach((p) => {
      const user = p.userId as any
      const userId = user?._id?.toString()
      if (!userId) return

      if (!mapa.has(userId)) {
        mapa.set(userId, {
          _id: userId,
          nome: user.nome,
          email: user.email,
          telefone: user.telefone,
          criadoEm: p.criadoEm,
          palpite: [],
          acertou: false
        })
      }

      const participante = mapa.get(userId)
      participante.palpite.push({
        corinthians: p.corinthians,
        cruzeiro: p.cruzeiro
      })

      if (p.acertou) {
        participante.acertou = true
      }
    })

    return res.json(Array.from(mapa.values()))
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
