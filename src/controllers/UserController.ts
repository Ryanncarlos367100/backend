// backend/src/controllers/UserController.ts
import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import User from "../models/User"

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, telefone } = req.body
    const telefoneLimpo = telefone.replace(/\D/g, "")

    const jaExiste = await User.findOne({ $or: [{ email }, { telefone: telefoneLimpo }] })
    if (jaExiste) {
      return res.status(400).json({ message: "Email ou telefone já cadastrado" })
    }

    const hash = await bcrypt.hash(senha, 10)
    const user = await User.create({ nome, email, senha: hash, telefone: telefoneLimpo })

    return res.status(201).json({
      _id: user._id,
      nome: user.nome,
      email: user.email,
      telefone: user.telefone
    })
  } catch (err) {
    console.error("Erro ao cadastrar usuário:", err)
    return res.status(500).json({ message: "Erro interno" })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" })

    const match = await bcrypt.compare(senha, user.senha)
    if (!match) return res.status(401).json({ message: "Senha incorreta" })

    return res.status(200).json({
      _id: user._id,
      nome: user.nome,
      email: user.email,
      telefone: user.telefone
    })
  } catch (err) {
    console.error("Erro ao fazer login:", err)
    return res.status(500).json({ message: "Erro interno" })
  }
}

export const recuperarSenha = async (req: Request, res: Response) => {
  try {
    const { telefone, novaSenha } = req.body
    const telefoneLimpo = telefone.replace(/\D/g, "")

    const user = await User.findOne({ telefone: telefoneLimpo })
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" })

    const hash = await bcrypt.hash(novaSenha, 10)
    user.senha = hash
    await user.save()

    return res.status(200).json({ message: "Senha atualizada com sucesso" })
  } catch (err) {
    console.error("Erro ao redefinir senha:", err)
    return res.status(500).json({ message: "Erro interno" })
  }
}
