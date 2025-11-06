import {Router} from "express"
import {getDB} from "./mongo"
import { Collection, ObjectId } from "mongodb"

const router = Router()
const coleccion = ()=> getDB().collection("b1")

router.get("/", async (req,res) =>{
    try{

        //const queryYear = req.query?.year   // lo de detras del year es el nombre que utlizo como variable en el postman
        //const albums = await coleccion().find(queryYear ? {year :{$gt: queryYear}}:{}).toArray()

        const publicationCountry = req.query?.country
        const albums = await coleccion().find(publicationCountry ? {country : {$in:[publicationCountry]}}:{}).toArray()

        res.json(albums)
    }catch(err){
        res.status(404).json({error : "No hay nada"})
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


//clase 6 noviembre 2025
router.post("/many",async(req, res)=>{
    try{
        const result = await coleccion().insertMany(req.body.b1)
        res.status(201).json(result)
    }catch(err){
        res.status(404).json({error:"No has creado nada"})
    }
})

export default router
