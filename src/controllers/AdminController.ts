import { Request, Response } from "express"
import Admin from "../models/Admin"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const criarAdmin = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha } = req.body

    const existe = await Admin.findOne({ email })
    if (existe) return res.status(400).json({ message: "Email já cadastrado" })

    const hash = await bcrypt.hash(senha, 10)
    const admin = await Admin.create({ nome, email, senha: hash })

    return res.status(201).json({ _id: admin._id, nome: admin.nome, email: admin.email })
  } catch (err) {
    console.error("Erro ao criar admin:", err)
    return res.status(500).json({ message: "Erro interno" })
  }
}

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body
    const admin = await Admin.findOne({ email })
    if (!admin) return res.status(404).json({ message: "Admin não encontrado" })

    const match = await bcrypt.compare(senha, admin.senha)
    if (!match) return res.status(401).json({ message: "Senha incorreta" })

    const token = jwt.sign(
      { id: admin._id, tipo: "admin" }, 
      process.env.JWT_SECRET!,
      { expiresIn: "2h" }
    )

    return res.json({ token, admin: { _id: admin._id, nome: admin.nome, email: admin.email } })
  } catch (err) {
    console.error("Erro ao fazer login:", err)
    return res.status(500).json({ message: "Erro interno" })
  }
}
