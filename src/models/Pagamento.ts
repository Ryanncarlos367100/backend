import mongoose from "mongoose"

const pagamentoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  nomeArquivo: String,
  urlArquivo: String,
  enviadoEm: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Pagamento", pagamentoSchema)
