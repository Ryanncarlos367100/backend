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

    // ✅ Logs para depuração
    console.log("📥 Recebido envio de comprovante")
    console.log("🧾 userId:", userId)
    console.log("📁 Arquivo recebido:", arquivo)

    // ✅ Verificação de campos obrigatórios
    if (!userId) {
      console.warn("⚠️ userId não fornecido")
      return res.status(400).json({ message: "ID do usuário não fornecido." })
    }

    if (!arquivo) {
      console.warn("⚠️ Nenhum arquivo foi enviado")
      return res.status(400).json({ message: "Nenhum arquivo foi enviado." })
    }

    // ✅ Verifica se o usuário existe
    const user = await User.findById(userId)
    if (!user) {
      console.warn("❌ Usuário não encontrado:", userId)
      return res.status(404).json({ message: "Usuário não encontrado" })
    }

    // ✅ Salva o pagamento no banco
    const pagamento = await Pagamento.create({
      userId,
      nomeArquivo: arquivo.filename,
      urlArquivo: `/uploads/comprovantes/${arquivo.filename}`,
    })

    const filePath = path.resolve("uploads/comprovantes", arquivo.filename)

    // ✅ Envia o comprovante por e-mail com anexo
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

    // ✅ Resposta final
    return res.status(201).json({
      message: "Comprovante enviado com sucesso",
      pagamento,
    })
  } catch (err) {
    console.error("❌ Erro ao enviar comprovante:", err)
    return res.status(500).json({ message: "Erro interno ao processar o comprovante." })
  }
}
