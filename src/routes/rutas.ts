import { Router } from "express";
import { getDB } from "../mongo";
import { Album } from "../types";
import { Response } from "express";
import { AuthRequest, verifyToken } from "../middleware/verfiyToken";
import { ObjectId } from "mongodb";

const router = Router()
const coleccion = ()=> getDB().collection("b1")

router.get("/", verifyToken ,async (req : AuthRequest,res) =>{
    try{

    //mostrar a paritr del año pedidio. Albums con mas de x años    
        //const queryYear = req.query?.year   // lo de detras del year es el nombre que utlizo como variable en el postman
        //const albums = await coleccion().find(queryYear ? {year :{$gt: queryYear}}:{}).toArray()

    //mostrar los albuns de spain
        //const publicationCountry = req.query?.country
        //const albums = await coleccion().find(publicationCountry ? {country : {$in:[publicationCountry]}}:{}).toArray()

    //mostrar por orden de menos a mas canciones       
        const page = Number(req.query?.page) || 1
        const limit  = Number(req.query?.limit) || 25
        const skip =(page-1) * limit

        const albums = await coleccion().find().sort({year:1}).skip(skip).limit(limit).toArray()
        res.json({
            info:{
                limit : limit,
                page : page
            },
            results : albums,


            user: req.userJwt,
            message: "todo correcto",
        })


    }catch(err){
        res.status(404).json({error : "No hay nada"})
    }
})

router.post("/", verifyToken, async (req : AuthRequest, res)=>{
    try{
        const { name, canciones, year, country } = req.body as Album

        const usercito = req.userJwt as {
            id: string,
            name: string
        }
        const albuns = coleccion()

        const nuevoAlbum : Album ={
            name,
            canciones,
            year,
            country,
            userId : usercito.id
        }


        const result = await albuns.insertOne(nuevoAlbum)

        res.status(201).json({
            message : "se ha creado el album",
            resultado : result.insertedId
        })
    }catch(err){
        res.status(404).json({message : err})
    }
})

router.get("/:id", verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID no válido" });
        }

        const user = req.userJwt as { id: string };

        const album = await coleccion().findOne({
            _id: new ObjectId(id),
            userId: user.id  
        });

        if (!album) {
            return res.status(404).json({ message: "No se encontró el álbum o no pertenece al usuario" });
        }

        res.json(album);

    } catch (err) {
        res.status(500).json({ error: "Algo ha fallado" });
    }
});

router.put("/:id", verifyToken, async (req: AuthRequest, res: Response) => {
    try{
        const { name, canciones, year, country } = req.body as Album

        const usercito = req.userJwt as {
            id: string,
            name: string
        }
        const albuns = coleccion()

        const albumUpdate = await albuns.updateOne(
            { _id: new ObjectId(req.params.id), userId: usercito.id },
            { $set: req.body }
        )

        if (albumUpdate.matchedCount === 0) {
            return res.status(400).json({ message: "No se encontro el album o no pertenece a ese usuario" })
        }
        if (albumUpdate.modifiedCount === 0) {
            return res.status(400).json({ message: "No se ha modificado nada" })
        }


        res.status(200).json({
            IdAlbumActualizado: req.params.id,
            cambios: req.body,
            message: "Album Actualizado",

        })

    }catch(err){
        res.status(404).json({error: "No se ha actualizado nada"})
    }
})

router.delete("/:id", verifyToken, async (req: AuthRequest, res: Response) => {
    try{
        const albuns = coleccion()

        const usercito = req.userJwt as {
            id: string,
            name: string
        }
        
        const id = req.params.id


         if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID no valido" })
        }

        const borrarAlbum = await albuns.deleteOne({
            _id: new ObjectId(id),
            userId: usercito.id
        })

        if (borrarAlbum.deletedCount === 0) {
            return res.status(404).json({
                message: "No se encontro el album"
            })
        }

        res.status(200).json({
            message: "album eliminado",
            idBorrado: id
        })
    }catch(err){
        res.status(404).json({error : "No se elimino el album"})
    }

})

router.post("/many", verifyToken, async (req: AuthRequest, res) => {
  try {
    const albums = req.body as Omit<Album, "userId">[]; // Array de álbumes sin userId

    if (!Array.isArray(albums) || albums.length === 0) {
      return res.status(400).json({ message: "Debes enviar un array de álbumes" });
    }

    const usercito = req.userJwt as {
      id: string,
      name: string
    };

    const albuns = coleccion();

    // Añadimos userId a cada álbum
    const albumsConUser = albums.map(album => ({
      ...album,
      userId: usercito.id
    }));

    const result = await albuns.insertMany(albumsConUser);

    res.status(201).json({
      message: "Se han creado los álbumes",
      resultado: result.insertedIds
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});



export default router
