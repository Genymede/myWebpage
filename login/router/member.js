
const express = require('express')
const router = express.Router()
const mysql = require('mysql2')
const bdyParser = require('body-parser')
const path = require('path')
const cookie = require('cookie-parser')
const md5 = require('md5')

require('dotenv').config()  

router.use(cookie())

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

router.get('/login',(req,res) => {
    res.render('member/login')
})

router.get('/register',(req,res) => {
    res.render('member/register')
})

router.post('/signup',(req,res) => {
    const {username,password,confirmpassword} = req.body
    if(password == confirmpassword){
        const sql = 'INSERT INTO users(username,password) VALUE( ?, ?)' //for sql USE `user`;
        pool.query(sql, [username,md5(password)], (error, results) =>{
            if(error){
                res.render('member/register', {msg:'Username or Password is used please change!'})
            }
            else
                res.redirect('/member/member')
        })
    }
    else{
        res.render('member/register', {msg:'Please coonfirm your password again!'})
    }
})

router.get('/member',(req,res) => {
    console.log('reload');
    const username = req.cookies.username;
    if(username){
        res.render('member/member',{username:username})
    }
    else
        res.redirect('/member/login')
})

router.post('/verify', (req,res) => {
    const {username,password} = req.body
    const sql = 'SELECT * FROM  users WHERE username = ? and password = ?' //for sql USE `user`;
    pool.query(sql, [username,md5(password)], (error, results) =>{
        console.error(password)
        console.error(md5(password))
        if(error){
            console.error(error)
            res.render('member/login')
        }
        else{
            console.log('login success')
            if(results.length == 0){
                res.render('member/login', {msg:'Wrong Username or Password'})
            }
            else{
                res.cookie('username',username,{maxAge:900000})
                res.redirect('/member/member')
            }
        }
    })
})

router.get('/all',(req,res) =>{
    const sql = 'SELECT * FROM users'
    pool.query(sql,(error, results,field) =>{
        if(error){
            console.error(error)
        }
        else{
           res.json(results)
        }
    })
})

router.get('/logout',(req,res) =>{
    const username = req.cookies.username;
    if(username){
        res.clearCookie('username')   
    }
    res.redirect('/member/login')
})

module.exports = router

