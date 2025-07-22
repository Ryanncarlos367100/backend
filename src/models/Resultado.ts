import mongoose from "mongoose"

const resultadoSchema = new mongoose.Schema({
  corinthians: { type: Number, required: true },
  cruzeiro: { type: Number, required: true },
  criadoEm: { type: Date, default: Date.now },
})

export default mongoose.model("Resultado", resultadoSchema)