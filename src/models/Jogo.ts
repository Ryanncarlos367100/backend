import mongoose from "mongoose"

const jogoSchema = new mongoose.Schema({
  timeA: { type: mongoose.Schema.Types.ObjectId, ref: "Time", required: true },
  timeB: { type: mongoose.Schema.Types.ObjectId, ref: "Time", required: true },
  data: { type: Date, required: true },
  placar: { type: String, default: "" } // Ex: "2 x 1"
})

export default mongoose.model("Jogo", jogoSchema)
