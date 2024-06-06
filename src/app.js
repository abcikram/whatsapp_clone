import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from 'cors'
import createHttpError from "http-errors";
import routes from './routes/index.js'


//dotenv config
dotenv.config()
const app = express();


//morgan
if (process.env.NODE_ENV !== 'prdoction') {
    app.use(morgan('dev'))
}

//helmet
app.use(helmet());

//parse json request url
app.use(express.urlencoded({ extended: true }))


//parse json request body
app.use(express.json())

//sanitize request data
app.use(mongoSanitize());

//enable cookie parser
app.use(cookieParser());

//gzip compression
app.use(compression());

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));


app.use(cors({
    origin:'http://localhost:3000'
}))

app.use('/api/v1', routes)

app.post('/test', (req, res) => {
    res.status(409).json({message:"their is a conflict"})
})
app.use(async (req, res, next) => {
    next(createHttpError.NotFound("This route does not exist."));
});

app.use(async(err, req, res, next) =>{
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message:err.message
        }
    })
})



export default app