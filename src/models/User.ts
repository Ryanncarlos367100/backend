import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  telefone: { type: String, required: true, unique: true },
  criadoEm: { type: Date, default: Date.now }
})

export default mongoose.model("User", userSchema)