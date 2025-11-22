import { Router } from "express";
import { getDB } from "../mongo";
import { ObjectId } from "mongodb";
import dotenv from "dotenv"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

dotenv.config()
const router = Router()

const SECRET=process.env.SECRET



type User = {
  _id?: ObjectId;//cuando hago el post no es obligatorio
  name: string;
  password: string;
};

type JwtPayload = {
  id: string;
  name: string;
};


const coleccion = () => getDB().collection<User>("users")


router.get("/", async (req, res) => {
    res.send("Se ha conectado a la ruta de auth correctamente");
});


router.post("/register", async (req, res) => {
    try {
        const {name,password}=req.body as User //{name:string,password:string} //Coge las variables del body directamente

        const users= await coleccion();
        /*const existing=  await users.findOne({name:name})
        if(existing){
           return  res.status(404).json({message:"Ya existe una persona con dicho nombre"})
        }*/


        const passToENcripts=await bcrypt.hash(password,10)
        await users.insertOne({name,password:passToENcripts})

        res.status(201).json({message:"Usuario creaoooo"})
    } catch (error) {
        res.status(500).json({ message: error });
    }
})

router.post("/login", async (req, res) => {
    try {

        const {name, password}= req.body as User
        const users= await coleccion();

        const exitsUser= await users.findOne({name})
        if(!exitsUser){
           return res.status(404).json({message:"No existe nadie con ese nombre"})
        }

        const passEncriptarYSinEncriptarIguales=await bcrypt.compare(password,exitsUser.password)

        if(!passEncriptarYSinEncriptarIguales) return res.status(401).json({message:"Contraseña Incorrecta"})


        const token=jwt.sign({id:exitsUser._id?.toString(),name:exitsUser.name} as JwtPayload,SECRET as string,{
            expiresIn:"1h"
        })

        res.json(
            {message:"Logeao",
             token: "Bearer " + token,//La palabra Bearer significa: "Este token lo manda el cliente para demostrar que está autenticado".
        })


    } catch (error) {
        res.status(500).json({ message: error });
    }
})




export default router