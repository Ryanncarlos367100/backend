import { Router } from "express"
import { loginUser, registerUser, recuperarSenha } from "../controllers/UserController"

const router = Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/recuperar-senha", recuperarSenha)

export default router