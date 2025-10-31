import {Router} from "express"
import {getDB} from "./mongo"
import { ObjectId } from "mongodb"

const router = Router()
const coleccion = ()=> getDB().collection("b1")

router.get("/", async (req,res) =>{
    try{
        const cosas = await coleccion().find().toArray()
        res.json(cosas)
    }catch(err){
        res.status(404).json({error : "No hay mani"})
    }
})

router.post("/", async (req, res)=>{
    try{
        const result = await coleccion().insertOne(req.body)
        const idCreado = result.insertedId
        const resultObjects = await coleccion().findOne({_id : idCreado})
        res.status(201).json({
            mongoAck : result,
            mongoObject : resultObjects
        })
    }catch(err){
        res.status(404).json({err: "No encontrado"})
    }
})

router.get("/:id", async (req,res) =>{
    try{
        const album = await coleccion().findOne({_id : new ObjectId(req.params.id)})
        album ? res.json(album) : res.status(404).json({message: "No existe album para ese id"})
    }catch(err){
        res.status(404).json({err: "Algo ha fallado"})
    }
})

router.put("/:id", async(req, res) =>{
    try{
        const result = await coleccion().updateOne(
            {_id : new ObjectId(req.params.id)},
            {$set: req.body}

        )
        res.json(result)
    }catch(err){
        res.status(404).json({error: "No se ha actualizado nada"})
    }
})

router.delete("/:id", async(req, res) =>{
    try{
        const result = await coleccion().deleteOne({
            _id : new ObjectId(req.params.id)
        })
        result && res.status(204).json({message: "objeto con id" + req.params.id + "eliminado"})

    }catch(err){
        res.status(404).json({error : "No se elimino el album"})
    }

})

export default router
