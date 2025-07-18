import { Router } from "express"
import { receberNotificacao } from "../controllers/PagamentoController"

const router = Router()

// Endpoint que o Mercado Pago vai chamar
router.post("/webhook", receberNotificacao)

export default router
