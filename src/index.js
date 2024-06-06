import mongoose from 'mongoose'
import app from './app.js'
import logger from './config/loggrer.config.js'


const { DATEABSE_URL } = process.env

const PORT = process.env.PORT || 8000

mongoose.connection.on('error', (error) => {
    logger.error(`Mongodb connection error:- ${error}`)
    process.exit(1)
})

mongoose.connect(DATEABSE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    logger.info('Connected to Mongodb')
})
let server;

server = app.listen(PORT, () => {
    logger.info(`server is lisening on ${PORT}`)
})

const exitHandler = () => {
    if (server) {
        logger.info("Server closed")
        process.exit(1)
    } else {
        process.exit(1)
    }
}
const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler()
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);