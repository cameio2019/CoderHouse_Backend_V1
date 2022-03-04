import Container from "../containers/Container.js";

export default class Chat extends Container{
    constructor(){
        super(
            'chats',
            
        )
    }

    getAllNormalizedChats = async() => {
        try{
            let documents = await this.collection.find()
            let chats = {id:'chats', chats:documents}
            console.log(chats)
            return {status:"success", payload:chats}
        }catch(err){
            return {status:"error", error:err}
        }
    }


    async saveChat(chat){
        try{
            let result = await this.collection.create(chat)
            return {status: "success", payload:result}
        }catch(err){
            console.log(`No se pudo escribir el chat ${err}`)
            return {status:"error", message:"Error al agregar chat "+err}
        }
    }

}