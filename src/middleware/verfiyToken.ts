import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";


dotenv.config();
const SECRET=process.env.SECRET



export interface AuthRequest extends Request{
    userJwt?:jwt.JwtPayload |string

}


export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {

    const headerToken=req.headers["authorization"]
    const token= headerToken && headerToken.split(" ")[1]//Ver solo el valor del token 
    if(!token){
        return res.status(401).json({message:"No hay token"})
    }
    jwt.verify(token,SECRET as string,(err,decoded)=>{
        if(err){
         return res.status(401).json({message:"Token no valido"})
        }

        req.userJwt=decoded 
        next()//Si NO pones next(), 
             // Express se queda parado y la ruta nunca se ejecuta.
    })


}