import { Router } from "express"
import multer from "multer"
import path from "path"
import { enviarComprovante } from "../controllers/PagamentoController"

const router = Router()

const storage = multer.diskStorage({
  destination: "uploads/comprovantes",
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`
    cb(null, uniqueName)
  },
})

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/heic", // iPhone
  "application/pdf",
]

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (req, file, cb) => {
    console.log("📎 Tipo de arquivo:", file.mimetype)

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      console.warn("❌ Tipo inválido:", file.mimetype)
      cb(new Error("Tipo de arquivo inválido. Envie imagem ou PDF."))
    }
  },
})

router.post("/pagamento", upload.single("comprovante"), enviarComprovante)

export default router
