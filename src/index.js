import dotenv from 'dotenv'
import {app} from './app.js'
import DBconnect from './db/index.js'

dotenv.config({
  "path":"./src/.env"
})
const PORT  = process.env.PORT||8000

DBconnect()
  .then(()=>{
    app.listen(PORT,()=>{
      console.log(`Server is running at port : ${PORT}`)
    })
  })
  .catch((err)=>{
    console.log("MONGODB connection error",err)
  })