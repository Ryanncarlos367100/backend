import { Router } from "express"
import { criarAdmin, loginAdmin, listarUsuarios, excluirUsuario, cadastrarUsuario } from "../controllers/AdminController"
import { autenticaAdmin } from "../middleware/authAdmin"

const router = Router()

// Admin
router.post("/admin/cadastrar", criarAdmin)
router.post("/admin/login", loginAdmin)

// Protegida
router.get("/admin/verifica", autenticaAdmin, (_req, res) => {
  return res.status(200).json({ ok: true })
})

// Usuários
router.get("/usuarios", autenticaAdmin, listarUsuarios)
router.post("/admin/usuarios", autenticaAdmin, cadastrarUsuario)
router.delete("/admin/usuarios/:id", autenticaAdmin, excluirUsuario)

export default router
