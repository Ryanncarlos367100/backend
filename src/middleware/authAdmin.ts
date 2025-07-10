import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export function autenticaAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    
    // Verifica se o tipo do token é admin
    if (typeof decoded === "object" && decoded.tipo !== "admin") {
      return res.status(403).json({ message: "Acesso negado" })
    }

    // @ts-ignore (se quiser usar depois: req.admin = decoded)
    req.admin = decoded

    next()
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" })
  }
}
