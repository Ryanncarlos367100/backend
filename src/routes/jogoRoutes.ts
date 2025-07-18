import { Router } from "express"
import {criarJogo, listarJogos, atualizarResultado} from "../controllers/JogoController"
import { autenticaAdmin } from "../middleware/authAdmin"

const router = Router()

// Apenas admin pode criar jogos
router.post("/admin/jogos", autenticaAdmin, criarJogo)

// Apenas admin pode atualizar placar
router.put("/admin/jogos/:id", autenticaAdmin, atualizarResultado)

// Todos podem ver os jogos e confrontos
router.get("/jogos", listarJogos)

export default router
