import { Router } from "express"
import { criarTime, listarTimes } from "../controllers/TimeController"
import { autenticaAdmin } from "../middleware/authAdmin"

const router = Router()

// Apenas administradores podem cadastrar times
router.post("/admin/times", autenticaAdmin, criarTime)

// Todos podem visualizar os times
router.get("/times", listarTimes)

export default router
