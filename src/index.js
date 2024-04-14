import dotenv from 'dotenv'
import app from './app.js'

//dotenv config
dotenv.config()

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`server is lisening on ${PORT}`)
})
