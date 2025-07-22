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
        statement_descriptor: "BolaoJacobina"
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

// 🔍 Verificar status do pagamento Pix
export const verificarPagamento = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    console.log("🔍 Verificando pagamento ID:", id)

    const pagamentoDB = await Pagamento.findById(id)
    if (!pagamentoDB) {
      console.warn("⚠️ Pagamento não encontrado no banco de dados")
      return res.status(404).json({ message: "Pagamento não encontrado." })
    }

    console.log("📄 Pagamento no banco:", pagamentoDB)

    if (!pagamentoDB.paymentId) {
      console.warn("⚠️ paymentId ausente no banco de dados")
      return res.status(400).json({ message: "paymentId inválido ou ausente." })
    }

    const pagamentoMP = await new Payment(mercadopago).get({ id: pagamentoDB.paymentId })
    console.log("📦 Dados do Mercado Pago:", pagamentoMP)

    const status = pagamentoMP.status
    const valor = Number(pagamentoMP.transaction_amount || 0)

    if (pagamentoDB.status !== status) {
      pagamentoDB.status = status
      await pagamentoDB.save()
      console.log("✅ Status atualizado para:", status)
    }

    let pago = false
    if (status === "approved" && typeof pagamentoDB.valor === "number") {
      pago = valor >= pagamentoDB.valor
    }

    console.log("💸 Resultado final:", { pago, status, valor })
    return res.json({ pago, status, valor })
  } catch (error) {
    console.error("❌ Erro ao verificar pagamento:", error)
    return res.status(500).json({ message: "Erro ao verificar pagamento." })
  }
}

// 📬 Webhook para atualizar o pagamento
export const receberNotificacao = async (req: Request, res: Response) => {
  try {
    console.log("🔔 Notificação recebida:", req.body)

    const paymentId = req.body.data?.id
    if (!paymentId) {
      return res.sendStatus(400)
    }

    const pagamentoInfo = await new Payment(mercadopago).get({ id: paymentId })

    await Pagamento.findOneAndUpdate(
      { paymentId },
      { status: pagamentoInfo.status }
    )

    console.log("✅ Pagamento atualizado:", pagamentoInfo.status)
    res.sendStatus(200)
  } catch (error) {
    console.error("Erro ao processar notificação:", error)
    res.status(500).json({ message: "Erro no webhook." })
  }
}
