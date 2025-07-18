import { Request, Response } from "express"
import Time from "../models/Time"

// Criar time
export const criarTime = async (req: Request, res: Response) => {
  try {
    const { nome, escudoUrl } = req.body

    if (!nome || !escudoUrl) {
      return res.status(400).json({ message: "Nome e escudo são obrigatórios." })
    }

    const time = await Time.create({ nome, escudoUrl })
    return res.status(201).json(time)
  } catch (error) {
    return res.status(500).json({ message: "Erro ao criar time", error })
  }
}

// Listar todos os times
export const listarTimes = async (_req: Request, res: Response) => {
  try {
    const times = await Time.find()
    return res.json(times)
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar times", error })
  }
}
