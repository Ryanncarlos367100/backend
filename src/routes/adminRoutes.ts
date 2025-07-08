import { Router } from "express"
import { criarAdmin, loginAdmin } from "../controllers/AdminController"

const router = Router()

router.post("/admin/cadastrar", criarAdmin)
router.post("/admin/login", loginAdmin)

export default router