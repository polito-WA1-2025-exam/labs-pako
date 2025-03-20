import express from 'express'
import morgan from 'morgan'

const app = express()
app.use(morgan('dev'))
app.use(express.static('public'))
app.use(express.json())

app.listen(3000, [morgan('tiny')], ()=>{console.log('Application started')})