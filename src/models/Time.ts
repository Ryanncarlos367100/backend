import mongoose from "mongoose"

const timeSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  escudoUrl: { type: String, required: true },
})

export default mongoose.model("Time", timeSchema)
