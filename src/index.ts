import {connectToMongoDb} from "./mongo"
import express from "express"
import rutas from "./routes"
import dotenv from "dotenv"

dotenv.config()

connectToMongoDb()
const app = express()
app.use(express.json())

app.use("/api/albums", rutas)


app.listen(3000, ()=> console.log("conectado al puerto 3000"))