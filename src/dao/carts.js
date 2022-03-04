import mongoose from 'mongoose'
const { Schema } = mongoose
import Container from "../containers/Container.js";

export default class CartContainer extends Container{
    constructor(){
        super(
            'carritos',
            {
                products:[{
                    type:Schema.Types.ObjectId,
                    ref:'products',
                }]                
            },{ timestamps:true }
        )
    }

    async createCart(){
        try{
            let newCart = await this.collection.create({products:[]})
            return {status:"succes", messagge:'Nuevo carrito credo', payload:newCart}
        }catch(err){
            return {status:"error", error:err.message}
        }
    }

    async addProduct(idNumber, productId){
        try{
            let result = await this.collection.updateOne({_id:idNumber},{$push:{products:productId}})
            return {status:"success", payload:result}
        }catch(err){
            console.log(err)
            return {status:"error", message:`Error al agregar el  producto ${productId} en el Carrito ${idNumber}: ${err}`}
            
        }
    }

    async getProductsByCartId(idNumber){
        try{
            const cart = await this.collection.findById(idNumber)
            const products = cart.products
            return {status:"success", payload:products}
        }catch(err){
            return {status:"error", message:err}
        }
    }

    async deleteProduct(idNumber, productId){
        try{
            let result = await this.collection.updateOne({_id:idNumber},{$pull:{products:productId}})
            return {status:"success", message:`Producto eliminado del carrito ${idNumber}`, payload:result}
        }catch(err){
            console.log(err)
            return {status:"error", message:`Error al eliminar el producto ${productId} en el Carrito ${idNumber}: ${err}`}
            
        }
    }

}