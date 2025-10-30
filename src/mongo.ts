import {Db, MongoClient} from "mongodb"

let client : MongoClient
let db : Db

export const  connectToMongoDb = async() : Promise<void> =>{
    try{
        const urlMongo = "mongodb+srv://jfernandezg20_db_user:Y276ARj5@cluster0.zolqtad.mongodb.net/?appName=Cluster0"
        client = new MongoClient(urlMongo)
        await client.connect();
        db = client.db("ejercicio_clase1");
        console.log("conectado a mongo")

    }catch(err){
        console.error("Error al conectar a Mongo")
        process.exit(1)
    }
    
}

export const getDB = () : Db => db;