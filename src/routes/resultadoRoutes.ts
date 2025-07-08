import { Router } from "express"
import { registrarResultado, buscarResultado, deletarUltimoResultado } from "../controllers/ResultadoController"

const router = Router()

router.post("/resultado", registrarResultado)
router.get("/resultado", buscarResultado)
router.delete("/resultado", deletarUltimoResultado)

export default router