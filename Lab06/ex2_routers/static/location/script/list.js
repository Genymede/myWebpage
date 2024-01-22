// const express = require('express')
// const router = express.Router()
// const mysql = require('mysql2')
// const bdyParser = require('body-parser')
// const path = require('path')

// require('dotenv').config()

// const pool = mysql.createPool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: 3306,
// })

// router.use(bdyParser.urlencoded({extended:true}))
// router.use(bdyParser.json())

function myFunction() {
       console.log("show table")
       var table = document.getElementById("myTable")
//     const {location_name,location_id} = req.body
//     const sql = 'SELECT * FROM location'

//     pool.query(sql, [location_name,location_id], (error, results) =>{
//         if(error){
//             return res.status(500).json({error: error.message})
//         }   
//         else{
            var row = table.insertRow(1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);  
            cell1.innerHTML = "1";
            cell2.innerHTML = "2";
//         }
//     })
}

