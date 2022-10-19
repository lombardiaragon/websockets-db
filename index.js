const express = require("express");
const { Server: HTTPServer } = require("http");
const { Server: SocketServer } = require("socket.io");
const {mysqlConfig}=require('./mysql/mysqlConfig.js')
const {sqliteConfig}=require('./sqliteConfig.js')

const handlebars=require('express-handlebars')

const {DBcontainer}=require('./DBcontainer.js')
const dbProds=new DBcontainer(mysqlConfig, "productos")
const dbMsg=new DBcontainer(sqliteConfig, "mensajes")


const app=express()
const httpServer=new HTTPServer(app)
const io=new SocketServer(httpServer)

app.use(express.json())
app.use(express.urlencoded({extended:true}))


// configuracion handlebar
app.use(express.static(__dirname + '/public'))

app.engine('hbs', handlebars.engine({
    extname:'hbs',
    layoutDir:__dirname + './public/layouts',
    defaultLayout:'index'
}))

app.set('views','./public')
app.set('view engine', 'hbs')

// conexión socket.io
io.on("connection", async(socket) => {       //establece la conexión con el socket del front
    const Productos= await dbProds.getAll()
    const Mensajes= await dbMsg.getAll()
    console.log(`conectado: ${socket.id}`);
    socket.emit("listProds", Productos);    //cada vez que alguien se conecta le enviamos una copia de los productos cargados al momento
    socket.emit("listMsg", Mensajes);    //cada vez que alguien se conecta le enviamos una copia de los mensajes cargados al momento
    
    // * Escuchar los productos nuevos
    socket.on("newProd", async(data) => {
        await dbProds.insertData(data)
       const Productos= await dbProds.getAll()
      io.sockets.emit("listProds", Productos);  //para enviar mensajes globales a todos los clientes conectados
    });
    // * Escuchar los mensajes nuevos
    socket.on("newMsg", async(data) => {      
        await dbMsg.insertData(data)
        const Mensajes= await dbMsg.getAll()
      io.sockets.emit("listMsg", Mensajes);
    });
});


app.get('/', async(req,res)=>{   
    const Productos=await dbProds.getAll()   
    res.render('main', {layout:'index', productos:Productos})
})



httpServer.listen(8080,()=>{
    try{
        console.log('iniciado!')
    }
    catch(e){
        console.log('error de inicio')
    }
})