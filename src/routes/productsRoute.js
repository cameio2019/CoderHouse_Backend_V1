import express from 'express'
const router = express.Router()
import upload from '../services/upload.js'
import { io } from '../app.js'
import { authMiddleware } from '../utils.js'
import ProductContainer from '../dao/products.js'

const productsContainer = new ProductContainer()

//GETS
router.get('/', async (req, res) => {
    productsContainer.getAll()
    .then(result => {
        res.send(result)
    })
})

router.get('/:pid', (req, res) => {
    let id = req.params.pid
    productsContainer.getById(id)
    .then(result=>{
        res.send(result)
    })
})


//POSTS
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
    let file = req.file
    let product = req.body
    product.thumbnail = req.protocol+"://"+req.hostname+":8080"+'/images/'+file.filename
    productsContainer.addProduct(product)
    .then(result => {
        res.send(result)
        productsContainer.getAll().then(result => {
            io.emit('deliverProducts', result)
        })
    })
})

//PUTS
router.put('/:pid', authMiddleware, (req,res) => {
    let body = req.body;
    let id = req.params.pid
    productsContainer.updateProduct(id,body).then(result=>{
        res.send(result);
    })
})

//DELETES
router.delete('/:pid', authMiddleware, (req,res) => {
    let id = req.params.pid
    productsContainer.deleteById(id).then(result => {
        res.send(result)
    })
})

router.delete('/', authMiddleware, (req,res) => {
    productsContainer.deleteAll().then(result => {
        res.send(result)
    })
})


export default router