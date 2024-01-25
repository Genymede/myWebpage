const express = require('express')
const bdyParser = require('body-parser')
const path = require('path')
const mustacheEx = require('mustache-express')

const app = express()
const port = 3000

app.set('views', `${__dirname}/static`)
app.set('view engine', 'mustache')
app.engine('mustache', mustacheEx())

require('dotenv').config()

app.use(bdyParser.urlencoded({extended:true}))
app.use(bdyParser.json())

let root_path = path.resolve(__dirname, 'static')
app.use(express.static(root_path))

const locationRoutes = require('./router/member')
//const manufactureRoutes = require('./static/style/stycky')
//const manufactureRoutes = require('./router/manufacture')

app.use('/member', locationRoutes)
//app.use('/member', manufactureRoutes) 
//app.use('manufacture', manufactureRoutes)
app.get('/',(req,res) =>{   
    res.send("HHHHH")
    res.end()
})
app.listen(port,'0.0.0.0', ()=> {
    console.log(`Server is running on http://localhost:${port}/member/login`)
})
