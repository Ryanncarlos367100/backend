import mongoose from "mongoose"

const comprovanteSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nomeArquivo: String,
  urlArquivo: String,
  enviadoEm: { type: Date, default: Date.now },
})

export default mongoose.model("Comprovante", comprovanteSchema)
