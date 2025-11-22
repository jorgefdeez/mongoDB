import {connectToMongoDb} from "./mongo"
import express from "express"
import rutas from "./routes/rutas"
import dotenv from "dotenv"
import rutasAuth from "./routes/auth"

dotenv.config()

connectToMongoDb()
const app = express()
app.use(express.json())

app.use("/api/albums", rutas)
app.use("/auth", rutasAuth)

app.listen(3000, ()=> console.log("conectado al puerto 3000"))