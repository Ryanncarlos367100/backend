// backend/src/controllers/ResultadoController.ts
import { Request, Response } from "express"
import Resultado from "../models/Resultado"
import Palpite from "../models/Palpite"

export const registrarResultado = async (req: Request, res: Response) => {
  try {
    const { corinthians, palmeiras } = req.body
    if (corinthians == null || palmeiras == null) {
      return res.status(400).json({ message: "Campos obrigatórios" }) 
    }

    // Salva o resultado
    const resultado = await Resultado.create({ corinthians, palmeiras })

    // Zera todos os palpites anteriores
    await Palpite.updateMany({}, { acertou: false })

    // Busca os primeiros 4 palpites corretos (por ordem de criação)
    const palpitesVencedores = await Palpite.find({ corinthians, palmeiras })
      .sort({ criadoEm: 1 }) // Mais antigos primeiro
      .limit(4)

    // Pega os IDs desses palpites
    const idsVencedores = palpitesVencedores.map((p) => p._id)

    // Marca esses como acertou: true
    await Palpite.updateMany({ _id: { $in: idsVencedores } }, { acertou: true })

    return res.status(201).json({ message: "Resultado registrado com até 4 ganhadores" })
  } catch (err) {
    console.error("Erro ao registrar resultado:", err)
    return res.status(500).json({ message: "Erro interno" })
  }
}


export const buscarResultado = async (req: Request, res: Response) => {
  try {
    const resultado = await Resultado.findOne().sort({ criadoEm: -1 })
    if (!resultado) {
      return res.status(200).json({ resultado: null, totalGanhadores: 0, vencedores: [] })
    }

    const vencedores = await Palpite.find({ acertou: true }).populate("userId", "nome")
    const lista = vencedores.map((p) => ({ nome: (p.userId as any)?.nome || "Participante" }))

    return res.json({
      resultado: { corinthians: resultado.corinthians, palmeiras: resultado.palmeiras },
      totalGanhadores: lista.length,
      vencedores: lista,
    })
  } catch (err) {
    console.error("Erro ao buscar resultado:", err)
    return res.status(500).json({ message: "Erro interno" })
  }
}

export const deletarUltimoResultado = async (req: Request, res: Response) => {
  try {
    const ultimo = await Resultado.findOne().sort({ criadoEm: -1 })
    if (!ultimo) return res.status(404).json({ message: "Nenhum resultado encontrado" })

    await Resultado.deleteOne({ _id: ultimo._id })
    await Palpite.updateMany({}, { acertou: false })

    return res.json({ message: "Resultado removido" })
  } catch (err) {
    console.error("Erro ao deletar resultado:", err)
    return res.status(500).json({ message: "Erro interno" })
  }
}
