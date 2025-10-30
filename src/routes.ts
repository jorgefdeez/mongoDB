import {Router} from "express"
import {getDB} from "./mongo"

const router = Router()
const colection = ()=> getDB().collection("b1")

router.get("/", async (req,res) =>{
    try{
            const cosas = await colection().find().toArray()
            res.json(cosas)
    }catch(err){
        res.status(404).json({error : "No hay mani"})
    }
})

export default router