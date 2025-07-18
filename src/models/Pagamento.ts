import mongoose from "mongoose"

const pagamentoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  paymentId: String,
  status: String,
  valor: Number,
  quantidade: { type: Number, default: 1 },
  enviadoEm: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Pagamento", pagamentoSchema)
