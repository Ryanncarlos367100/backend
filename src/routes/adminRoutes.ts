import { Router } from "express"
import { criarAdmin, loginAdmin } from "../controllers/AdminController"
import { autenticaAdmin } from "../middleware/authAdmin" // ✅ importe o middleware

const router = Router()

router.post("/admin/cadastrar", criarAdmin)
router.post("/admin/login", loginAdmin)

// ✅ rota protegida para verificar token do admin
router.get("/admin/verifica", autenticaAdmin, (req, res) => {
  return res.status(200).json({ ok: true })
})

export default router
