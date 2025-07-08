import { Router } from "express"
import twilio from "twilio"

const router = Router()

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!)
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID!

// ✅ Enviar código
router.post("/enviar-codigo", async (req, res) => {
  const { telefone } = req.body

  try {
    await client.verify.v2.services(serviceSid).verifications.create({
      to: telefone,
      channel: "sms",
    })

    res.status(200).json({ message: "Código enviado com sucesso" })
  } catch (err) {
    console.error("Erro ao enviar SMS:", err)
    res.status(500).json({ message: "Erro ao enviar SMS" })
  }
})

// ✅ Verificar código
router.post("/verificar-codigo", async (req, res) => {
  const { telefone, codigo } = req.body

  try {
    const result = await client.verify.v2.services(serviceSid).verificationChecks.create({
      to: telefone,
      code: codigo,
    })

    if (result.status === "approved") {
      return res.json({ verificado: true })
    }

    res.json({ verificado: false })
  } catch (err) {
    console.error("Erro ao verificar código:", err)
    res.status(500).json({ message: "Erro ao verificar código" })
  }
})


export default router
