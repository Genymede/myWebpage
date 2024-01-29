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
    res.redirect('/member/login')
    // res.send('Location Route')
    // res.end()
})

router.get('/login',(req,res) => {
    const username = req.cookies.username
    console.log('username: ' + username)
    if(username){
        res.redirect('/member/member')
    }
    else
        res.render('member/login')  
})

router.get('/register',(req,res) => {
    res.render('member/register')
})

router.get('/add',(req,res) => {
    const username = req.cookies.username;
    if(username)
        res.render('member/add',{'username':username})
    else
        res.render('member/login')
})

// router.post('/send',(req,res) => {
//     const {details,time,image} = req.body
//     const sql = 'INSERT INTO user_info (details,password) VALUE( ?, ?)'
//     res.render('member/member')
// })

router.post('/signup',(req,res) => {
    const {username,email,studentid,firstname,lastname,password,confirmpassword,faculty,major,phonenumber,facebook,instagram,x} = req.body
    console.log(username)
    console.log(email)
    console.log(studentid)
    console.log(firstname)
    console.log(lastname)
    console.log(password)
    console.log(faculty)
    console.log(major)
    console.log(phonenumber)
    console.log(facebook)
    console.log(instagram)
    console.log(x)
    if(password == confirmpassword){
        const sql = 'INSERT INTO users(username,email,studentID,firstname,lastname,password,faculty,major,phonenumber,facebook,instagram,x) VALUE(? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? )' //for sql USE `user`;
        pool.query(sql, [username,email,studentid,firstname,lastname,md5(password),faculty,major,phonenumber,facebook,instagram,x], (error, results) =>{
            if(error){
                console.log('somethings wrong');
                //res.render('member/register', {msg:'Username or Password is used please change!'})  
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
    //console.log('username')
    const username = req.cookies.username;
    if(username){
        
        //res.render('member/member',{username:username})
        pool.query("SELECT * FROM user_info INNER JOIN users on user_info.userID = users.userID WHERE users.username = ?  ORDER BY dataID desc",[username], function(err, rows, fields) {
            var results = [] 
            console.log(results.length)
            rows.forEach(function(row) {
                results.push(row)
            });
            if(results.length == 0){
                res.render('member/member', {'username':username})
                //console.log('1 ' + username)
            }
            else{
                res.render('member/member', {'username':username,'results':results})
                //console.log('2 ' + username)
            }
            //console.log(results)
          });
    }
    else
        res.redirect('/member/login')
    
})

router.get('/main',(req,res) => {
    //console.log('reload');
    //console.log('username')
    const username = req.cookies.username;  
    if(username){
        const sql = "SELECT * FROM user_info INNER JOIN users ON user_info.userID = users.userID WHERE details is not null ORDER BY detail_time DESC"
        //res.render('member/member',{username:username})
        pool.query(sql,function(err, rows, fields) {
            var results = []  
            console.log(results.length)
            rows.forEach(function(row) {
                results.push(row)
            });
            if(results.length == 0){    
                res.render('member/main', {'username':username})
                //console.log('1 ' + username)
            }
            else{
                res.render('member/main', {'username':username,'results':results})
                //console.log('2 ' + username)
                //console.log('2 ' + results[0].userName)
            }
            //console.log(results)
          });
    }
    else
        res.redirect('/member/login')
    
})

router.post('/verify', (req,res) => {
    const {username,password} = req.body    
    const user_cookie = req.cookies.username
    if(!user_cookie){
        const sql = 'SELECT * FROM  users WHERE username = ? and password = ?' //for sql USE `user`;
        pool.query(sql, [username,md5(password)], (error, results) =>{
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
                    res.redirect('/member/main')
                }
            }
        })
    }
    else
        res.redirect('/member/login')
})

router.post('/send', (req,res) => {
    const {userID,details,detail_time} = req.body
    const user_cookie = req.cookies.username
    //console.log(res.cookie('username'))
    console.log('0000')
    if(user_cookie){
        const sql = 'SELECT userID AS ID FROM users WHERE username = ?' //for sql USE `user`;
        pool.query(sql,[user_cookie], (error, results) => {
            console.log('222222')
            console.log(results[0].ID)
            const insert = 'INSERT INTO user_info(userID,details,detail_time) VALUE (? ,?, ?)'
            pool.query(insert,[results[0].ID,details,detail_time],(err,reslt) => {
                if(err){
                    console.log('Insert ERROR')
                    res.redirect('/member/member')
                }
                else{
                    console.log('Insert success')
                    res.redirect('/member/member')
                }
            })
        })
    }
    else
        res.redirect('/member/login')
})

router.post('/delete', (req,res) => {
    const {dataID} = req.body
    const user_cookie = req.cookies.username
    //console.log(res.cookie('username'))
    console.log(dataID)
    console.log('0000')
    if(user_cookie){
        const sql = 'DELETE FROM user_info WHERE dataID = ?' //for sql USE `user`;
        pool.query(sql,[dataID], (error, results) => {
            if(error){
                console.log('cannot delete')
            }
            else{
                console.log('deleted')
                res.redirect('/member/member')
            }       
        })
    }
    else
        res.redirect('/member/login')
})

router.post('/update', (req,res) => {
    const {dataID,details,status} = req.body
    const user_cookie = req.cookies.username
    //console.log(res.cookie('username'))
    console.log(parseInt(dataID))
    console.log('0000')
    if(user_cookie){
        const sql = 'UPDATE user_info SET details = ? , status = ? WHERE dataID = ?' //for sql USE `user`;
        pool.query(sql,[details,status,dataID], (error, results) => {
            if(error){
                console.log('cannot update')
            }
            else{
                console.log('updated')
                res.redirect('/member/member')
            }       
        })
    }
    else
        res.redirect('/member/login')
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
    console.log('llllll')
    if(username){
            res.clearCookie('username')  
            //res.cookie('username')
            
    }
    res.redirect('/member/login')
})

module.exports = router

