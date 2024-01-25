const express = require('express')
const router = express.Router()
const mysql = require('mysql2')
const bdyParser = require('body-parser')
const path = require('path')

require('dotenv').config()

const pool = mysql.createPool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 3306,
})

router.use(bdyParser.urlencoded({extended:true}))
router.use(bdyParser.json())

router.get('/',(req,res) => {
    res.send('Location Route')
    res.end()
})

// router.get('/list',(req,res) => {
//     pool.query('SELECT * FROM location', (error, results, fields) =>{
//         if(error){
//             console.error(error)
//             res.status(500).send('Error retrieving data from the database')
//         }
//         else
//             res.json(results)
//     })
// })

router.get('/list',(req,res) => {
    pool.query('SELECT * FROM location', (error, results, fields) =>{
        if(error){
            console.error(error)
            res.status(500).send('Error retrieving data from the database')
        }
        else
            res.render('Location/list',{'location_id': location_id, 'location_name': location_name})
    })
})

router.get('/json/:id', (req,res) => {
    var sql = 'SELECT * FROM  location WHERE location_id = ' + req.params['id'] 
    pool.query(sql, (error, results, fields) =>{
        if(error){
            console.error(error)
            res.status(500).send('Error retrieving data from the database'  + sql)
        }
        else{
            res.json(results)
            res.end
        }
    })
})

router.get('/:id(\\d+)', (req,res) =>{ 
    var sql = 'SELECT * FROM location WHERE location_id = ' + req.params['id']
    console.log(sql)
    pool.query(sql, (error, results, fields) =>{
        if(error){
            console.error(error)
            res.status(500).send('Error retrieving data from the database\n' + sql)
        }
        if(results.length == 0){
            res.status(404).send('no locatoin_id = ' + req.params['id'])
        }
        else{
            location_id = results[0].location_id
            location_name = results[0].location_name
            res.render('Location/index',{'location_id': location_id, 'location_name': location_name})
        }
    })
})

router.post('/delete',(req,res) => {
    const {location_id} = req.body

    const sql = 'DELETE FROM location WHERE location_id=(?)'

    pool.query(sql, [location_id],(error, results) =>{
        if(error){
            res.status(500).json({error: error.message})
        }
        res.json({'delete': 'completed'})
    }) 
})

router.get('/update/:id',(req,res) => {
    var sql = 'SELECT * FROM location WHERE location_id = ' + req.params['id']

    pool.query(sql, (error, results, fields) =>{
        if(error){
            console.error(error)
            res.status(500).send('Error retrieving data from the database' + sql)
        }
        if(results.length == 0){
            res.status(404).send('no locatoin_id = ' + req.params['id'])
        }
        else{
            location_id = results[0].location_id
            location_name = results[0].location_name
            res.render('Location/update',{'location_id': location_id, 'location_name':location_name})
        }
    }) 
})

router.post('/update', (req,res) => {
    const {location_id, location_name} = req.body

    const sql  ='UPDATE location SET location_name = ? WHERE location_id = ?'

    pool.query(sql, [location_name, location_id], (error,results) =>{
        if(error){
            return res.status(500).json({error: error.message})
        }
        res.redirect(location_id)
    })
})

router.get('/add', (req,res) => {
    var sql = 'SELECT * FROM location ORDER BY location_id DESC'
    pool.query(sql, (error, results, fields) =>{
        if(error){
            console.error(error)
            res.status(500).send('Error retrieving data from the database')
        }
        else
            location_id = parseInt(results[0].location_id) +1
            res.render('location/add',{location_id})
    }) 
})

router.post('/add', (req,res) => {
    const {location_name,location_id} = req.body
    const sql = 'INSERT INTO  location (location_name) VALUES (?)'

    pool.query(sql, [location_name,location_id], (error, results) =>{
        if(error){
            return res.status(500).json({error: error.message})
        }   
        res.redirect('/location/' + results.insertId)
    })
})

module.exports = router