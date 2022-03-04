import dotenv from 'dotenv'
import mongoose from "mongoose";
dotenv.config()

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser:true,
    useUnifiedTopology:true
})

export default class MongoContainer{
    constructor(collection, schema, timestamps){
        this.collection = mongoose.model(collection, new mongoose.Schema(schema, timestamps))
    }

    getAll = async() => {
        try{
            let documents = await this.collection.find()
            return {status:"success", payload:documents}
        }catch(err){
            return {status:"error", error:err}
        }
    }

    async getById(idNumber){
        try{
            let document = await this.collection.findById(idNumber)
            
            if(document){
                return {status:"success", payload: document}
            }else{
                console.log(null)
                return {status:"error", error: 'Objeco no Encontrado'}
            }
            
        }
        catch(err){
            return{status:"error", error:`No se puedo encontrar el objeto con el id:${id} en ${this.url} - ${err}`}
        }
    }

    async deleteById(idNumber){
        try{
            await this.collection.deleteOne({"_id": idNumber})
            return{status:"success", mesagge:`Objetcto con id:${idNumber} fue eliminado`}
        }
        catch(err){
            return{status:"error", mesagge:`Objetcto con id:${idNumber} no fue eliminado - ${err}`}
        }
    }

    async deleteAll(){
        try{
            const result = await this.collection.deleteMany({})
            return{status:"success", mesagge:`Todos los objetos fueron eliminados`}
        }
        catch(err){
            return{status:"error", mesagge:`No se pueden eliminar todo los objetos ${err}`}
        }
    }
}