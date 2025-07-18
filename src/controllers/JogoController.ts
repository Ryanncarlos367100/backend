import { Request, Response } from "express"
import Jogo from "../models/Jogo"
import Time from "../models/Time"

// Criar novo jogo
export const criarJogo = async (req: Request, res: Response) => {
  try {
    const { timeA, timeB, data } = req.body

    if (!timeA || !timeB || !data) {
      return res.status(400).json({ message: "Dados incompletos." })
    }

    const jogo = await Jogo.create({ timeA, timeB, data })
    return res.status(201).json(jogo)
  } catch (error) {
    return res.status(500).json({ message: "Erro ao criar jogo", error })
  }
}

// Listar todos os jogos com nomes e escudos dos times
export const listarJogos = async (_req: Request, res: Response) => {
  try {
    const jogos = await Jogo.find()
      .populate("timeA")
      .populate("timeB")
      .sort({ data: 1 })

    return res.json(jogos)
  } catch (error) {
    return res.status(500).json({ message: "Erro ao listar jogos", error })
  }
}

// Atualizar placar do jogo
export const atualizarResultado = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { placar } = req.body

    const jogo = await Jogo.findByIdAndUpdate(id, { placar }, { new: true })
    return res.json(jogo)
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar resultado", error })
  }
}
