import { Request, Response } from "express"
import Pagamento from "../models/Pagamento"
import User from "../models/User"
import { MercadoPagoConfig, Payment } from "mercadopago"

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string,
})

// 💸 Criar cobrança Pix automática
export const criarCobranca = async (req: Request, res: Response) => {
  try {
    const { userId, quantidade } = req.body

    console.log("📥 Requisição recebida:", { userId, quantidade })

    if (!userId || !quantidade) {
      return res.status(400).json({ message: "Dados incompletos." })
    }

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." })

    const valor = quantidade * 15
    console.log("💰 Valor calculado:", valor)

    // LOG EXTRA PRA CONFERIR O ENVIO
    console.log("🧾 Enviando para Mercado Pago:", {
      transaction_amount: valor,
      quantidade,
      userId,
    })

    const pagamento = await new Payment(mercadopago).create({
      body: {
        transaction_amount: valor,
        payment_method_id: "pix",
        notification_url: "https://xn--bolojacobina-4bb.com/api/webhook",
        payer: {
          email: user.email || "comprador@bolao.com",
          first_name: user.nome,
        },
        external_reference: `${userId}-${Date.now()}`,
        description: "Palpite do Bolão Municipal",
        statement_descriptor: "BolaoJacobina",
      },
    })

    const { id, point_of_interaction, status, transaction_amount } = pagamento

    console.log("🧾 Resposta do Mercado Pago:", {
      id,
      status,
      transaction_amount,
    })

    if (
      !point_of_interaction?.transaction_data?.qr_code ||
      !point_of_interaction.transaction_data.qr_code_base64
    ) {
      return res.status(500).json({ message: "QR Code não disponível no pagamento." })
    }

    const qrCode = point_of_interaction.transaction_data.qr_code
    const qrCodeBase64 = point_of_interaction.transaction_data.qr_code_base64

    const novoPagamento = await Pagamento.create({
      userId,
      paymentId: id,
      status,
      valor: transaction_amount,
      quantidade,
    })

    return res.status(201).json({
      message: "Cobrança criada com sucesso.",
      pagamentoId: novoPagamento._id,
      mercadopagoId: id,
      qrCode,
      qrCodeBase64,
    })
  } catch (error) {
    console.error("Erro ao criar cobrança:", error)
    return res.status(500).json({ message: "Erro ao criar cobrança." })
  }
}
