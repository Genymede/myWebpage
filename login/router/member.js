const express = require('express')
const router = express.Router()
const mysql = require('mysql2')
const bdyParser = require('body-parser')
const path = require('path')
const cookie = require('cookie-parser')
const md5 = require('md5')
const fs = require("fs");
const multer = require("multer");

console.log(getTime())

const handleError = (err, res) => {
res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

require('dotenv').config({path: __dirname + "/.env"})  

const upload = multer({
    dest: "/path/to/temporary/directory/to/store/uploaded/files"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

router.use(cookie())

const pool = mysql.createPool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 3306,
})  

admin_name = ''
pool.query('SELECT username FROM users WHERE userID = 1',(err,results)=>{
    if(err)
        console.log(err)
    else{
        admin_name = results[0].username
    }  
})

const checkUserImage = 'SELECT * FROM users'
pool.query(checkUserImage,(err,results)=>{
    if(err)
        console.log(err)
    else{
        for (let i = 0; i < results.length; i++) {
            //console.log(results[i].userImage)
            if(!(fs.existsSync('static/' + results[i].userImage))){
                console.log('image not found')
                pool.query('UPDATE users SET userImage = ? WHERE userID = ?',['userProfile/prof2.jpg',results[i].userID],(err,imgresult) =>{
                    if(err)
                        console.log(err)
                })
            }
        }
    }
})

pool.query('SELECT * FROM user_info',(err,results)=>{
    if(err)
        console.log(err)
    else{
        for (let i = 0; i < results.length; i++) {
            if(!(fs.existsSync('static/' + results[i].image))){
                console.log('image not found')
                pool.query('UPDATE user_info SET image = ? WHERE dataID = ?',['img/white_bg.jpg',results[i].dataID],(err,imgresult) =>{
                    if(err)
                        console.log(err)
                })
            }
        }
    }
})

router.use(bdyParser.urlencoded({extended:true}))
router.use(bdyParser.json())

router.get('/',(req,res) => {
    res.redirect('/g65102/login')
    // res.send('Location Route')
    // res.end()
})

router.get('/login',(req,res) => {
    const username = req.cookies.username
    if(username){
        res.redirect('/g65102/admin')
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

router.post('/signup',upload.single("profile"),(req,res) => {
    const {profile,username,email,studentid,firstname,lastname,password,confirmpassword,faculty,major,phonenumber,facebook,instagram,x} = req.body
    
    // const tempPath = req.file.path;
    
    if(password == confirmpassword){
        if(req.file){
            const tempPath = req.file.path
            const thispath = tempPath.split('\\path\\to\\temporary\\directory\\to\\store\\uploaded\\files\\')[1]
            
            const targetPath = path.join("static", "./userProfile/" + username + thispath + ".jpg");
            const userImage = targetPath.split('static\\')
            if ((path.extname(req.file.originalname).toLowerCase() === ".png")||(path.extname(req.file.originalname).toLowerCase() === ".jpg")) {
                fs.rename(tempPath, targetPath, err => {
                    if (err)
                        return handleError(err, res);
                    const sql = 'INSERT INTO users(userImage,username,email,studentID,firstname,lastname,password,faculty,major,phonenumber,facebook,instagram,x) VALUE(?, ? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? )' //for sql USE `user`;
                    pool.query(sql, [userImage[1].replace(' ',''),username,email,studentid,firstname,lastname,md5(password),faculty,major,phonenumber,facebook,instagram,x], (error, results) =>{
                        if(error){
                            console.log(err);
                            //res.render('member/register', {msg:'Username or Password is used please change!'})  
                        }
                        else
                            res.redirect('/g65102/member')
                    })
                });
            }
            else {
                fs.unlink(tempPath, err => {
                    if (err) return handleError(err, res);
                    res.render('member/register', {msg:'Only .png or .jpg files are allowed!'})
                });
            }
        }
        else{
            const sql = 'INSERT INTO users(userImage,username,email,studentID,firstname,lastname,password,faculty,major,phonenumber,facebook,instagram,x) VALUE(?, ? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? )' //for sql USE `user`;
            pool.query(sql, ['img/prof2.jpg',username,email,studentid,firstname,lastname,md5(password),faculty,major,phonenumber,facebook,instagram,x], (error, results) =>{
                if(error){
                    console.log(error);
                    //res.render('member/register', {msg:'Username or Password is used please change!'})  
                }
                else
                    res.redirect('/g65102/member')
            })
        }
    }
    else{       
        res.render('member/register', {msg:'Please confirm your password again!'})
    }
})

router.get('/member',(req,res) => {
    const username = req.cookies.username;
    if(username){
        
        //res.render('member/member',{username:username})
        pool.query("SELECT * FROM user_info INNER JOIN users ON user_info.userID = users.userID WHERE users.username = ?  ORDER BY dataID desc",[username], function(err, rows, fields) {
            var results = []
            rows.forEach(function(row) {
                results.push(row)
            });
            if(results.length == 0){
                //res.render('member/member', {'username':username})
                pool.query('SELECT * FROM users WHERE username = ?',[username],(thiserror,thisresult)=>{
                    if(thiserror){
                        console.log(thiserror)
                    }
                    else{
                        //thisresult.userImage
                        res.render('member/member', {'user':thisresult})
                    }
                })
            }
            else{
                //res.render('member/member', {'username':username,'results':results})
                pool.query('SELECT * FROM users WHERE username = ?',[username],(thiserror,thisresult)=>{
                    if(thiserror){s
                        console.log(thiserror)
                    }
                    else{
                        //thisresult.userImage
                        if(username == admin_name)
                            res.render('member/memberAdmin', {'username':username,'results':results,'user':thisresult})
                        else
                            res.render('member/member', {'username':username,'results':results,'user':thisresult})
                    }
                })
            }
        });
    }
    else
        res.redirect('/g65102/login')
    
})

router.get('/main',(req,res) => {
    const username = req.cookies.username;
    if(username){
        const sql = "SELECT * FROM user_info INNER JOIN users ON user_info.userID = users.userID WHERE details is not null ORDER BY detail_time DESC"
        //res.render('member/member',{username:username})
        pool.query(sql,function(err, rows, fields) {
                var results = []  
                rows.forEach(function(row) {
                    results.push(row)
                });
                if(results.length == 0){
                    pool.query('SELECT userImage FROM users WHERE username = ?',[username],(thiserror,thisresult)=>{
                        if(thiserror){
                            console.log(thiserror)
                        }
                        else{
                            if(username == admin_name)
                                res.render('member/mainAdmin', {'username':username,'results':results,'userImage':thisresult[0].userImage})
                            else
                                res.render('member/main', {'username':username,'results':results,'userImage':thisresult[0].userImage})
                        }
                    })
                }
                else{
                    pool.query('SELECT userImage FROM users WHERE username = ?',[username],(thiserror,thisresult)=>{
                        if(thiserror){
                            console.log(thiserror)
                        }
                        else{
                            if(username == admin_name)
                                res.render('member/mainAdmin', {'username':username,'results':results,'userImage':thisresult[0].userImage})
                            else
                                res.render('member/main', {'username':username,'results':results,'userImage':thisresult[0].userImage})
                        }
                    })
                }
        });
    }
    else
        res.redirect('/g65102/login')
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
                if(results.length == 0){
                    res.render('member/login', {msg:'Wrong Username or Password'})
                }
                else{
                    pool.query('SELECT * FROM users WHERE username = ?',[username],(err,results)=>{
                        if(err)
                            console.log(err)
                        else{
                            if(results[0].userID == 1 ){
                                //admin_name = results[0].username
                                admin_name = results[0].username
                                console.log('welcome admin')
                                res.cookie('username',admin_name,{maxAge:900000})
                                res.redirect('/g65102/admin')
                            }
                            else{
                                admin_name = ''
                                console.log('welcome user')
                                res.cookie('username',username,{maxAge:900000})
                                res.redirect('/g65102/main')
                            }
                        }
                    })
                    tracking(username,'Login')
                }
            }
        })
        
    }
    else
        res.redirect('/g65102/login')
})

router.get('/admin',(req,res)=>{
    const username = req.cookies.username
    if(username){
        if(username == admin_name){
            
            pool.query('SELECT * FROM users',(err,results)=>{
                if(err){
                    console.log(err)
                }
                else{
                    pool.query('SELECT * FROM users WHERE username = ?',[username],(err,userResult)=>{
                        if(err){
                            console.log(err)
                        }
                        else{
                            res.render('member/admin',{'admin':userResult,'results':results})
                        }
                    })
                    
                }
            })
        }
        else{
            res.redirect('/g65102/member')
        }
    }
    else{
        res.redirect('/g65102/login')
    }
})

router.get('/userActivity',(req,res)=>{
    const username = req.cookies.username
    if(username){
        if(username == admin_name){
            pool.query('SELECT * FROM user_act ORDER BY actiontime DESC',(err,results)=>{
                if(err){
                    console.log(err)
                }
                else{
                    pool.query('SELECT * FROM users WHERE username = ?',[username],(err,userResult)=>{
                        if(err){
                            console.log('err')
                        }
                        else{
                            res.render('member/action',{'admin':userResult,'results':results})
                        }
                    })
                    
                }
            })
        }
        else{
            res.redirect('/g65102/member')
        }
    }
    else{
        res.redirect('/g65102/login')
    }
})

router.post('/send',upload.single("dataImage"), (req,res) => {
    const {userID,dataImage,details,detail_time} = req.body
    const user_cookie = req.cookies.username
    if(user_cookie){
        if(req.file){
            const tempPath = req.file.path
            const thispath = tempPath.split('\\path\\to\\temporary\\directory\\to\\store\\uploaded\\files\\')[1]
            
            const targetPath = path.join("static", "./img/" + user_cookie + thispath + ".jpg");
            const userImage = targetPath.split('static\\')
    
            if ((path.extname(req.file.originalname).toLowerCase() === ".png")||(path.extname(req.file.originalname).toLowerCase() === ".jpg")) {
                fs.rename(tempPath, targetPath.replace(' ',''), err => {
                    if (err)
                        return handleError(err, res);
                        const sql = 'SELECT userID AS ID FROM users WHERE username = ?' //for sql USE `user`;
                        pool.query(sql,[user_cookie], (error, results) => {
                            const insert = 'INSERT INTO user_info(image,userID,details,detail_time) VALUE (?, ? ,?, ?)'
                            pool.query(insert,[userImage[1].replace(' ',''),results[0].ID,details,detail_time],(err,reslt) => {
                                if(err){
                                    console.log(err)
                                    res.redirect('/g65102/member')
                                }
                                else{
                                    res.redirect('/g65102/member')
                                }
                            })
                        })
                });
            }
            else {
                fs.unlink(tempPath, err => {
                    if (err) return handleError(err, res);
                    
                });
            }
        }
        else{
            const sql = 'SELECT userID AS ID FROM users WHERE username = ?' //for sql USE `user`;
            pool.query(sql,[user_cookie], (error, results) => {
                const insert = 'INSERT INTO user_info(userID,details,detail_time) VALUE (? ,?, ?)'
                pool.query(insert,[results[0].ID,details,detail_time],(err,reslt) => {
                    if(err){
                        console.log(err)
                        res.redirect('/g65102/member')
                    }
                    else{
                        res.redirect('/g65102/member')
                    }
                })
            })
        }
        tracking(user_cookie,'Add post')
    }
    else
        res.redirect('/g65102/login')
})

router.post('/seepost',(req,res)=> {
    const {dataID} = req.body
    const user_cookie = req.cookies.username
    if(user_cookie){
        const sql = 'SELECT * FROM user_info INNER JOIN users ON user_info.userID = users.userID  WHERE dataID = ?' 
        pool.query(sql,[dataID],(err,results)=>{
            if(err)
                console.log(err)
            else{
                const userSql = 'SELECT * FROM users WHERE username = ?'
                pool.query(userSql,[user_cookie],(err,userResult)=>{
                    if(err)
                        console.log(err)
                    else
                        res.render('member/post',{'user':userResult,'results':results})
                })
            }
        })
    }
    else{
        res.redirect('/g65102/login')
    }
})

router.post('/users',(req,res)=>{
    const {userID,username} = req.body
    const user_cookie = req.cookies.username
    if(user_cookie){
        if(username == user_cookie){
            res.redirect('/g65102/member')
        }
        else{
            const sql = 'SELECT * FROM users WHERE userID = ?'
            pool.query(sql,[userID],(err,userResults)=>{
                if(err){
                    console.log(err)
                }
                else{
                    const sql = 'SELECT * FROM user_info WHERE userID = ? ORDER BY detail_time DESC'
                    pool.query(sql,[userID],(err,infoResults)=>{
                        if(err)
                            console.log(err)
                        else{
                            const watcherSql = 'SELECT * FROM users WHERE username = ?'
                            pool.query(watcherSql,[user_cookie],(err,watcherResults)=>{
                                if(err)
                                    console.log(err)
                                else
                                    res.render('member/user',{'user':userResults,'results':infoResults,'watcher':watcherResults})
                            })
                            
                        }
                    })
                    
                }
            })
        }
    }
    else
        res.redirect('/g65102/login')
})

router.post('/delete', (req,res) => {
    const {dataID} = req.body
    const user_cookie = req.cookies.username
    if(user_cookie){
        const sql = 'DELETE FROM user_info WHERE dataID = ?' //for sql USE `user`;
        pool.query(sql,[dataID], (error, results) => {
            if(error){
                console.log('cannot delete')
            }
            else{
                console.log('deleted')
                res.redirect('/g65102/member')
            }
        })
        tracking(user_cookie,'Delete post ID:  '+dataID)
    }
    else
        res.redirect('/g65102/login')
})

router.post('/deleteUser',(req,res)=>{
    const {userID} = req.body
    const user_cookie = req.cookies.username
    if(user_cookie){
        if(user_cookie == admin_name){
            const sql = 'DELETE FROM users WHERE userID = ?'
            pool.query(sql,[userID],(err,results)=>{
                if(err){
                    console.log(err)
                }
                else{
                    res.redirect('/g65102/admin')
                }
            })
            tracking('Admin','Delete user ID : '+userID)
        }
        else
            res.redirect('/g65102/main')
    }
    else
        res.redirect('/g65102/login')

})

router.post('/editUser',(req,res)=>{
    const {userID} = req.body
    const user_cookie = req.cookies.username
    if(user_cookie){
        if(user_cookie == admin_name){
            const sql = 'SELECT * FROM users WHERE userID = ?'
            pool.query(sql,[userID],(err,userResults)=>{
                if(err){
                    console.log(err)
                }
                else{
                    const sql = 'SELECT * FROM user_info WHERE userID = ? ORDER BY detail_time DESC'
                    pool.query(sql,[userID],(err,infoResults)=>{
                        if(err)
                            console.log(err)
                        else{
                            res.render('member/memberForUpdate',{'user':userResults,'results':infoResults})
                        }
                    })
                }
            })
        }
        else
            res.redirect('/g65102/main')
    }
    else
        res.redirect('/g65102/login')
})

router.post('/score',(req,res)=>{
    const {userID,score,reviewerID} = req.body
    const user_cookie = req.cookies.username
    if(user_cookie){
        const select = 'SELECT * FROM credit WHERE userID LIKE ? AND reviewerID LIKE ? AND reviewerName LIKE ?'
        pool.query(select,[userID,reviewerID,user_cookie],(err,results)=>{
            if(err)
                console.log(err)
            else{
                if(results[0] == null){
                    const sql = 'INSERT INTO credit (userID,score,reviewerID,reviewerName) VALUES(?, ?, ?, ?)'
                    pool.query(sql,[userID,score,reviewerID,user_cookie],(err,reviewerResult)=>{
                        if(err)
                            console.log(err)
                    })
                }
                else{
                    const sql = 'UPDATE credit SET score = ? WHERE userID = ? AND reviewerID = ? AND reviewerName = ?'
                    pool.query(sql,[score,userID,reviewerID,user_cookie],(err,scoreResults)=>{
                        if(err)
                            console.log(err)
                    })
                }
                const sql = 'SELECT AVG(score) AS avgScore  FROM credit WHERE userID = ?'
                pool.query(sql,[userID],(err,infoResults)=>{
                    if(err)
                        console.log(err)
                    else{
                        console.log(infoResults[0].avgScore)
                        const updateAVG = 'UPDATE users SET avgScore = ? WHERE userID = ?'
                        pool.query(updateAVG,[infoResults[0].avgScore,userID],(err,updateResult)=>{
                            if(err)
                                console.log(err)
                        })
                        res.redirect('/g65102/main')
                        //res.render('member/memberForUpdate',{'user':userResults,'results':infoResults})
                    }
                })
            }
        })
    }
    else
        res.redirect('/g65102/login')
})

router.post('/editProfileForAdmin',upload.single("profile"), (req,res)=>{
    const {userID,profile,username,email,studentid,firstname,lastname,faculty,major,phonenumber,facebook,instagram,x} = req.body
    const user_cookie = req.cookies.username
    console.log('==========================================Edit Profile (Admin)===========================================')
    if(user_cookie){
        if(user_cookie == admin_name){
            if(req.file){
                const tempPath = req.file.path

                const thispath = tempPath.split('\\path\\to\\temporary\\directory\\to\\store\\uploaded\\files\\')[1]

                const targetPath = path.join("static", "./userProfile/" + user_cookie + thispath + ".jpg");
                const userImage = targetPath.split('static\\')

                if ((path.extname(req.file.originalname).toLowerCase() === ".png")||(path.extname(req.file.originalname).toLowerCase() === ".jpg")) {
                    fs.rename(tempPath, targetPath, err => {
                        if (err)
                            return handleError(err, res);
                        else{
                            const sql = 'UPDATE users SET userImage = ?, username = ?, email = ?, studentID = ?, firstname = ?, lastname = ?, faculty = ?, major = ?, phonenumber = ?, facebook = ?, instagram = ?, x = ? WHERE userID = ?'                    
                            pool.query(sql, [userImage[1].replace(' ',''),username,email,studentid,firstname,lastname,faculty,major,phonenumber,facebook,instagram,x,userID], (error, results) =>{
                                if(error){
                                    console.log(error);
                                    //res.render('member/register', {msg:'Username or Password is used please change!'})  
                                }
                                else{
                                    res.clearCookie('username')
                                    res.cookie('username',admin_name,{maxAge:900000})
                                    res.redirect('/g65102/admin')
                                }
                                    
                            })
                        }
                        
                    });
                }
                else {
                    fs.unlink(tempPath, err => {
                        if (err) return handleError(err, res);
                        res.render('member/member')
                    });
                }
            }
            else{
                const sql = 'UPDATE users SET  username = ?, email = ?, studentID = ?, firstname = ?, lastname = ?, faculty = ?, major = ?, phonenumber = ?, facebook = ?, instagram = ?, x = ? WHERE userID = ?'                    
                pool.query(sql, [username,email,studentid,firstname,lastname,faculty,major,phonenumber,facebook,instagram,x,userID], (error, results) =>{
                    if(error){
                        console.log(error);
                        //res.render('member/register', {msg:'Username or Password is used please change!'})  
                    }
                    else{
                        res.clearCookie('username')
                        res.cookie('username',admin_name,{maxAge:900000})
                        res.redirect('/g65102/admin')
                    }
                })
            }
            tracking('Admin','Admin edit user profile ID: '+userID)
        }
        else{
            res.redirect('/g65102/member')
        }
        
    }
    else
        res.redirect('/g65102/login')
})

router.post('/editProfile',upload.single("profile"), (req,res)=>{
    const {userID,profile,username,email,studentid,firstname,lastname,faculty,major,phonenumber,facebook,instagram,x} = req.body
    const user_cookie = req.cookies.username
    console.log('==========================================Edit Profile===========================================')
    if(user_cookie){
        console.log('have usercookie')
        if(req.file){
            const tempPath = req.file.path

            const thispath = tempPath.split('\\path\\to\\temporary\\directory\\to\\store\\uploaded\\files\\')[1]

            const targetPath = path.join("static", "./userProfile/" + user_cookie + thispath + ".jpg");
            const userImage = targetPath.split('static\\')
            if ((path.extname(req.file.originalname).toLowerCase() === ".png")||(path.extname(req.file.originalname).toLowerCase() === ".jpg")) {
                fs.rename(tempPath, targetPath.replace(/\s/g, ""), err => {
                    if (err)
                        return handleError(err, res);
                    else{
                        const sql = 'UPDATE users SET userImage = ?, username = ?, email = ?, studentID = ?, firstname = ?, lastname = ?, faculty = ?, major = ?, phonenumber = ?, facebook = ?, instagram = ?, x = ? WHERE userID = ?'                    
                        pool.query(sql, [userImage[1].replace(/\s/g, ""),username,email,studentid,firstname,lastname,faculty,major,phonenumber,facebook,instagram,x,userID], (error, results) =>{
                            if(error){
                                console.log(error);
                                //res.render('member/register', {msg:'Username or Password is used please change!'})  
                            }    
                            else
                                res.redirect('/g65102/member')
                        })
                    }
                    
                });
            }
            else {
                fs.unlink(tempPath, err => {
                    if (err) return handleError(err, res);
                    res.render('member/member')
                });
            }
        }
        else{
            const sql = 'UPDATE users SET  username = ?, email = ?, studentID = ?, firstname = ?, lastname = ?, faculty = ?, major = ?, phonenumber = ?, facebook = ?, instagram = ?, x = ? WHERE userID = ?'                    
            pool.query(sql, [username,email,studentid,firstname,lastname,faculty,major,phonenumber,facebook,instagram,x,userID], (error, results) =>{
                if(error){
                    console.log(error);
                    //res.render('member/register', {msg:'Username or Password is used please change!'})  
                }

                else
                    res.redirect('/g65102/member')
            })
        }
        tracking(user_cookie,'Edit profile')
    }
    else
        res.redirect('/g65102/login')
})

router.post('/updateUser', (req,res) => {
    const {dataID} = req.body
    const user_cookie = req.cookies.username
    if(user_cookie){
        if(user_cookie == admin_name){
            const sql = 'SELECT * FROM user_info WHERE dataID = ?' //for sql USE `user`;
            pool.query(sql,[dataID], (error, results) => {
                if(error){
                    console.log(error)
                }
                else{
                    res.render('member/updateUser',{'results':results})
                }
            })
        }
        else{
            res.redirect('/g65102/main')
        }
    }
    else
        res.redirect('/g65102/login')
})

router.post('/userInfoUpdate',upload.single("dataImage"),(req,res) => {
    const {dataImage,username,details,status,dataID} = req.body
    const user_cookie = req.cookies.username
    if(user_cookie){
        if(user_cookie == admin_name){
            if(req.file){
                const tempPath = req.file.path
                const thispath = tempPath.split('\\path\\to\\temporary\\directory\\to\\store\\uploaded\\files\\')[1]
                
                const targetPath = path.join("static", "./img/" + username + thispath + ".jpg");
                const userImage = targetPath.split('static\\')
                const imgaddress = userImage[1]
    
                if ((path.extname(req.file.originalname).toLowerCase() === ".png")||(path.extname(req.file.originalname).toLowerCase() === ".jpg")) {
                    fs.rename(tempPath, targetPath.replace(' ',''), err => {
                        if (err)
                            return handleError(err, res);
                        else{
                            const sql = 'UPDATE user_info SET image = ? WHERE dataID = ?' //for sql USE `user`;
                            pool.query(sql,[imgaddress.replace(' ',''),dataID], (error, results) =>{
                                if(error){
                                    console.log(error);
                                    //res.render('member/register', {msg:'Username or Password is used please change!'})  
                                }
                                else{
                                    console.log('all updated')
                                }
                            })
                        }
                    });
                } else {
                    fs.unlink(tempPath, err => {
                        if (err) 
                            return handleError(err, res);
                        // res.render('member/register', {msg:'Only .png or .jpg files are allowed!'})
                        else
                            console.log('update fail')
                    });
                }
            }
            else{
                console.log('no file upload')
            }
            console.log('details updated')
            const sql = 'UPDATE user_info SET details = ? , status = ? WHERE dataID = ?' //for sql USE `user`;
            pool.query(sql,[details,status,dataID], (error, results) => {
                if(error){
                    console.log('cannot update')
                }
                else{
                    res.redirect('/g65102/admin')
                }
            })
            tracking('Admin','Admin update user data ID: '+dataID)
        }
        else
            res.redirect('member/manin')
    }
    else
        res.redirect('/g65102/login')
})

router.post('/sendUpdate',upload.single("dataImage"),(req,res) => {
    const {dataImage,details,status,dataID} = req.body
    const user_cookie = req.cookies.username
    if(user_cookie){
        if(req.file){
            const tempPath = req.file.path

            const thispath = tempPath.split('\\path\\to\\temporary\\directory\\to\\store\\uploaded\\files\\')[1]
            
            const targetPath = path.join("static", "./img/" + user_cookie + thispath + ".jpg");
            const userImage = targetPath.split('static\\')
            const imgaddress = userImage[1]

            if ((path.extname(req.file.originalname).toLowerCase() === ".png")||(path.extname(req.file.originalname).toLowerCase() === ".jpg")) {
                fs.rename(tempPath, targetPath.replace(' ',''), err => {
                    if (err)
                        return handleError(err, res);
                    else{
                        const sql = 'UPDATE user_info SET image = ? WHERE dataID = ?' //for sql USE `user`;
                        pool.query(sql,[imgaddress.replace(' ',''),dataID], (error, results) =>{
                            if(error){
                                console.log(err);
                                //res.render('member/register', {msg:'Username or Password is used please change!'})
                            }
                            else{
                                console.log('all updated')
                            }
                        })
                    }
                });
            }
            else {
                fs.unlink(tempPath, err => {
                    if (err) 
                        return handleError(err, res);
                    // res.render('member/register', {msg:'Only .png or .jpg files are allowed!'})
                    else
                        console.log('update fail')
                });
            }
        }
        else{
            console.log('no file upload')
        }
        const sql = 'UPDATE user_info SET details = ? , status = ? WHERE dataID = ?' //for sql USE `user`;
        pool.query(sql,[details,status,dataID], (error, results) => {
            if(error){
                console.log(error)
            }
            else{
                res.redirect('/g65102/member')
            }
        })
        tracking(user_cookie,'Update post ID: '+dataID)
    }
    else
        res.redirect('/g65102/login')
    
})

router.post('/update', (req,res) => {
    const {dataID} = req.body
    const user_cookie = req.cookies.username
    if(user_cookie){
        const sql = 'SELECT * FROM user_info WHERE dataID = ?' //for sql USE `user`;
        pool.query(sql,[dataID], (error, results) => {
            if(error){
                console.log(error)
            }
            else{
                res.render('member/update',{'results':results})
            }
        })
    }
    else
        res.redirect('/g65102/login')
})

router.get('/logout',(req,res) =>{
    const username = req.cookies.username;
    if(username){
            tracking(username,'Logout')
            res.clearCookie('username')  
            //res.cookie('username')
            
    }
    res.redirect('/g65102/login')
})

router.get('/contact',(req,res) =>{
    const username = req.cookies.username;
    if(username){
        const sql ='SELECT * FROM users WHERE username = ?'
        pool.query(sql,[username],(err,results)=>{
            if(err)
                console.log(err)
            else
                res.render('member/contact',{'results':results})
        })
        
    }
        
    else
        res.redirect('/g65102/login')
})

module.exports = router

function getTime(){
    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-" + currentdate.getMonth() 
    + "-" + currentdate.getDate() + " " 
    + currentdate.getHours() + ":" 
    + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    return datetime
}

function tracking(username,action){
    var userID
    pool.query('SELECT userID FROM users WHERE username = ?',[username],(err,result)=>{
        if(err)
            console.log(err)
        else{
            if(result.length == 0){
                userID = null
            }
            else{
                userID = result[0].userID
            }
            const sql = 'INSERT INTO user_act(userID,username,action,actiontime) VALUE (?,?,?,?)'
            pool.query(sql,[userID,username,action,getTime()],(err,result)=>{
                if(err)
                    console.log(err)
            })
        }
    })
}