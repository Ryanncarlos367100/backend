import { Request, Response } from "express"
import Pagamento from "../models/Pagamento"
import path from "path"
import nodemailer from "nodemailer"
import User from "../models/User"

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export const enviarComprovante = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body
    const arquivo = req.file

    if (!userId || !arquivo) {
      return res.status(400).json({ message: "Dados incompletos" })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" })
    }

    const pagamento = await Pagamento.create({
      userId,
      nomeArquivo: arquivo.filename,
      urlArquivo: `/uploads/comprovantes/${arquivo.filename}`,
    })

    const filePath = path.resolve("uploads/comprovantes", arquivo.filename)

    await transporter.sendMail({
      from: `"Bolão Jacobina" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "📎 Novo Comprovante Recebido",
      text: `📨 Novo comprovante enviado por:\n\nNome: ${user.nome}\nEmail: ${user.email}\nTelefone: ${user.telefone}`,
      attachments: [
        {
          filename: arquivo.originalname,
          path: filePath,
        },
      ],
    })

    return res.status(201).json({ message: "Comprovante enviado com sucesso", pagamento })
  } catch (err) {
    console.error("Erro ao enviar comprovante:", err)
    return res.status(500).json({ message: "Erro interno" })
  }
}
