import { Router } from "express"
import { criarPalpite, listarParticipantes, listarPalpitesPorUsuario } from "../controllers/PalpiteController"

const router = Router()

router.post("/palpites", criarPalpite)
router.get("/participantes", listarParticipantes)
router.get("/palpites/:userId/todos", listarPalpitesPorUsuario)

export default router
