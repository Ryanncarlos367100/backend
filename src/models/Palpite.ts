import mongoose from "mongoose"

const palpiteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  corinthians: { type: Number, required: true },
  cruzeiro: { type: Number, required: true },
  pagamentoId: { type: String, required: true },
  quantidade: { type: Number },
  acertou: { type: Boolean, default: false },
  criadoEm: { type: Date, default: Date.now },
})

export default mongoose.model("Palpite", palpiteSchema)
