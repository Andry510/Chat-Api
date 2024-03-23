//Dependencias de node (express, passport, helmet, http, socket)
import express from "express"
import passport from "passport"
import helmet from "helmet"
import { createServer } from "http"
import { Server } from "socket.io";

//Variables de entorno
import { PORT } from "./config/config.js"

//Rutas
import PictureRouters from "./routes/v1/picture.routes.js"
import userRouters from "./routes/v1/user.routes.js"
import channelRouters from './routes/v1/channel.routes.js'
import routersError from "./middlewares/errors/routeError.js"

//Importaciones 
import connectionDB from "./connections/database.js"
import { loggerRouter } from "./utils/logs/loggers.js"
import ipControlMiddleware from "./middlewares/security/ipControl.js";
import fileUploadMiddleware from "./utils/validations/fileValidations.js"


//Importacion de la logia de token y local
import "./utils/authentication/jwtStrategy.js"
import "./utils/authentication/localStrategy.js"


//Socket
import initializeSocket from "./socket/socket_io.js";

//Error
import errorHandler from "./middlewares/errors/errorMiddleware.js"

//Initialize
const app = express()
const server = createServer(app)
export const io = new Server(server, { logLevel: 2 })
connectionDB();
initializeSocket(io)

//Configuration 
app.set('port', PORT)
app.set('trust proxy', true);

//Configuration
app.use(express.json())
app.use(passport.initialize())
app.use(ipControlMiddleware)
app.use(helmet({
    xssFilter: true,
    noSniff: true,
}))

//Logger
app.use(loggerRouter)



//Routers
app.use('/api/users', ipControlMiddleware, userRouters)
app.use('/api/channels', ipControlMiddleware, channelRouters)
app.use('/api/picture', ipControlMiddleware, fileUploadMiddleware.single('picture'), PictureRouters)


//Error
app.use('*', routersError)
app.use(errorHandler)

export { app, server }

