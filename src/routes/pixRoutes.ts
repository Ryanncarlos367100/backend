// src/routes/pagamentoRoutes.ts
import { Router } from "express"
import { criarCobranca, verificarPagamento } from "../controllers/PagamentoController"

const router = Router()

router.post("/pagamento/pix", criarCobranca)
router.get("/pagamento/verificar/:id", verificarPagamento)

export default router
