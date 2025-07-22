// src/routes/pagamentoRoutes.ts
import { Router } from "express"
import {
  criarCobranca,
  verificarPagamento
} from "../controllers/PagamentoController"

const router = Router()

// ✅ Criar cobrança via Pix
router.post("/pagamento/pix", criarCobranca)

// ✅ Verificar status do pagamento
router.get("/pagamento/verificar/:id", verificarPagamento)

export default router
  