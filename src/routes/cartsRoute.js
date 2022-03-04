import express from 'express'
const router = express.Router()
import CartContainer from '../dao/carts.js'

const cartsContainer = new CartContainer()


//POSTS
router.post('/', (req, res) => {
    cartsContainer.createCart()
    .then(result => res.send(result))
    console.log()
})

router.post('/:cid/products', (req, res) => {
    let cartId = req.params.cid
    let productId = req.body.id
    cartsContainer.addProduct(cartId, productId)
    .then(result => res.send(result))
})

//DELETES
router.delete('/:cid', (req, res) => {
    let id = req.params.cid
    cartsContainer.deleteById(id)
    .then(result => res.send(result))
})

router.delete('/:cid/products/:pid', (req, res) => {
    let cartId = req.params.cid
    let productId = req.params.pid
    cartsContainer.deleteProduct(cartId, productId)
    .then(result => res.send(result))
})


//GETS
router.get('/:cid/products', (req, res) => {
    let id = req.params.cid
    cartsContainer.getProductsByCartId(id)
    .then(result => res.send(result))
})

router.get('/', (req,res)=>{
    cartsContainer.getAll().then(result=>{
        res.send(result)
    })
})


export default router