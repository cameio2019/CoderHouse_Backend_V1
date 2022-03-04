import express from 'express'
import cors from 'cors'
import upload from './services/upload.js'
import __dirname from './utils.js'
import productsRouter from './routes/productsRoute.js'
import cartsRouter from './routes/cartsRoute.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'

const app = express()
const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => {
    console.log(`Server Listening on Port ${PORT}`)
})

export const io = new Server(server)

app.engine('handlebars', engine())
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')

const admin = true

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({extended:true}))

app.use((req,res,next)=>{
    console.log(new Date().toTimeString().split(" ")[0], req.method, req.url)
    req.auth = admin
    next()
})

app.use(express.static(__dirname+'/public'))
app.use('/images', express.static(__dirname+'/public'))

app.use('/api/products', productsRouter)
app.use('/api/cart', cartsRouter)

app.use(upload.single('image'))

app.post('/api/uploadImage', upload.single('image'), (req,res) => {
    const image = req.file
    if(!image || image.length === 0){
        res.status(500).send({message:"No se subió la imagen"})
    }
    res.send(image)
})

app.get('/views/products', (req,res)=>{
    products.getAll()
    .then(result => {
        let preparedObj ={
            products : result
        }
        // console.log(preparedObj.products.payload)
        res.render('products', preparedObj)
    })
})

//-------------------- socket ----------------//
io.on('connection', async socket => {
    console.log(`the socket ${socket.id} is connected`)
    let allProducts = await products.getAll()
    
    socket.emit('deliverProducts', allProducts.payload)
    chats.getAll()
    socket.emit('messagelog', await chats.getAll())

    socket.on('message', async data => {
        await chats.saveChat(data)
        io.emit('messagelog', await chats.getAll())
    })
})


//------------------ end----------------//

app.use('/*', (req,res)=> res.send({
    error:-2,
    description: `Path ${req.originalUrl} and method ${req.method} aren't implemented`
}))