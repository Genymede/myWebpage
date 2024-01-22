const express = require('express')
const bdyParser = require('body-parser')
const path = require('path')
const mustacheEx = require('mustache-express')
const exp = require('constants')

const app = express()
const port = 3000

app.set('views', `${__dirname}/static`)
app.set('view engine', 'mustache')
app.engine('mustache', mustacheEx())

require('dotenv').config()

app.use(bdyParser.urlencoded({ extended:true}))
app.use(bdyParser.json())

let root_path = path.resolve(__dirname, 'static')
app.use(express.static(root_path))

const locationRoptes = require('./router/location')
const manufactureRoutes = require('./router/manufacture')

app.use('location', locationRoptes)
app.use('/manufacture', manufactureRoutes)

app.listen(3000, 'localhost', ()=> {
    console.log(`Server is running on http://localhost:${port}`)
    console.log("http://localhost:3000/simple")
    console.log("http://localhost:3000/txt/1,+,1")
    console.log("http://localhost:3000/cal/1+1")
})

app.get('/simple',(req,res) =>{
    a = 2 
    b = 3
    operator = '+'
    c = a+b
    res.render('simple',{a,b,operator,c})
})

app.get('/txt/:cal',(req,res) =>{
    cal = req.params['cal'].split(',')
    a = cal[0]
    b = cal[2]
    operator = cal[1]
    c= calculator(a,b,operator)
    operator = operator == 'r'? '/':operator
    res.render('simple',{a,b,operator,c})
})

app.get('/cal/:cal',(req,res) =>{
    const operRegEX = /[+\-*r]/;
    cal = req.params['cal'].split(operRegEX)
    a = cal[0]
    b = cal[1]
    operator = req.params['cal'].replace(a,'').replace(b,'')
    c = calculator(a,b,operator)
    operator = operator == 'r'?'/':operator
    res.render('simple',{a,b,operator,c})
})

calculator = (a,b,operator) => {
    a = parseFloat(a)
    b = parseFloat(b)

    switch(operator){
        case '+' : 
            return a+b
        case '-' : 
            return a-b
        case '*' : 
            return a*b    
        case 'r':
            return a/b
    }
}