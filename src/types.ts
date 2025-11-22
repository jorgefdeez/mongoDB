import { ObjectId } from "mongodb"

export type Album={
    id?: ObjectId,
    name : string,
    canciones: number,
    year : string,
    country : string[],
    userId : string
}