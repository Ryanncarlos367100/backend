import mongoose from "mongoose"

const resultadoSchema = new mongoose.Schema({
  river: { type: Number, required: true },
  gremio: { type: Number, required: true },
  criadoEm: { type: Date, default: Date.now },
})

export default mongoose.model("Resultado", resultadoSchema)