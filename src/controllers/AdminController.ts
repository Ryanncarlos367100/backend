import { Request, Response } from "express"
import Admin from "../models/Admin"
import User from "../models/User"
import Palpite from "../models/Palpite"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Criar novo admin
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

// Login do admin
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

// Listar todos os usuários (clientes)
export const listarUsuarios = async (_req: Request, res: Response) => {
  try {
    const usuarios = await User.find().sort({ nome: 1 })
    return res.json(usuarios)
  } catch (err) {
    console.error("Erro ao listar usuários:", err)
    return res.status(500).json({ message: "Erro interno ao listar usuários" })
  }
}

// Excluir usuário + palpites
export const excluirUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const usuario = await User.findById(id)
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" })
    }

    await Palpite.deleteMany({ userId: id })
    await User.findByIdAndDelete(id)

    return res.json({ message: "Usuário e palpites excluídos com sucesso" })
  } catch (err) {
    console.error("Erro ao excluir usuário:", err)
    return res.status(500).json({ message: "Erro interno ao excluir" })
  }
}

// Cadastrar usuário (cliente) pelo admin
export const cadastrarUsuario = async (req: Request, res: Response) => {
  try {
    const { nome, email, telefone, senha } = req.body

    if (!nome || !email || !telefone || !senha) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios" })
    }

    const telefoneLimpo = telefone.replace(/\D/g, "")
    const existe = await User.findOne({ $or: [{ email }, { telefone: telefoneLimpo }] })
    if (existe) {
      return res.status(400).json({ message: "E-mail ou telefone já cadastrado" })
    }

    const senhaHash = await bcrypt.hash(senha, 10)
    const novoUsuario = await User.create({
      nome,
      email,
      telefone: telefoneLimpo,
      senha: senhaHash
    })

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso",
      usuario: {
        _id: novoUsuario._id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        telefone: novoUsuario.telefone
      }
    })
  } catch (err) {
    console.error("Erro ao cadastrar usuário:", err)
    return res.status(500).json({ message: "Erro interno ao cadastrar usuário" })
  }
}
