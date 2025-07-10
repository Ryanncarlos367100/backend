import { Router } from "express"
import multer from "multer"
import path from "path"
import { enviarComprovante } from "../controllers/PagamentoController"

const router = Router()

// 🗂️ Configuração do destino e nome do arquivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/comprovantes")
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`
    cb(null, uniqueName)
  },
})

// 📄 Tipos de arquivos permitidos
const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
  "image/heic", // opcional pra iOS
]

// 📥 Configuração do multer
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // ✅ 15MB
  fileFilter: (req, file, cb) => {
    console.log("📎 Tipo recebido:", file.mimetype)
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      console.warn("❌ Tipo não aceito:", file.mimetype)
      cb(new Error("Tipo de arquivo inválido. Envie JPG, PNG ou PDF."))
    }
  },
})

// 🚀 Rota de envio
router.post("/pagamento", upload.single("comprovante"), enviarComprovante)

export default router
