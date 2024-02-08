const express = require('express')
const router = express.Router()
const mysql = require('mysql2')
const bdyParser = require('body-parser')
const path = require('path')
const cookie = require('cookie-parser')
const md5 = require('md5')
const fs = require("fs");
const multer = require("multer");

const handleError = (err, res) => {
res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

require('dotenv').config()  

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
    console.log(results)
    if(err)
        console.log(err)
    else{
        admin_name = results[0].username
        console.log('admin is: ' + admin_name)
    }  
})

//pool.query('SELECT * FROM users')

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
        res.redirect('/member/admin')
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
    console.log(profile)
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

    // const tempPath = req.file.path;
    
    if(password == confirmpassword){
        if(req.file){
            const tempPath = req.file.path

            console.log(tempPath)
            const thispath = tempPath.split('\\path\\to\\temporary\\directory\\to\\store\\uploaded\\files\\')[1]
            console.log(thispath)
            
            const targetPath = path.join("static", "./userProfile/" + username + thispath + ".jpg");
            console.log(targetPath)
            const userImage = targetPath.split('static\\')
            console.log(userImage[1])

            if ((path.extname(req.file.originalname).toLowerCase() === ".png")||(path.extname(req.file.originalname).toLowerCase() === ".jpg")) {
                fs.rename(tempPath, targetPath, err => {
                    if (err)
                        return handleError(err, res);
                    const sql = 'INSERT INTO users(userImage,username,email,studentID,firstname,lastname,password,faculty,major,phonenumber,facebook,instagram,x) VALUE(?, ? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? )' //for sql USE `user`;
                    pool.query(sql, [userImage[1].replace(' ',''),username,email,studentid,firstname,lastname,md5(password),faculty,major,phonenumber,facebook,instagram,x], (error, results) =>{
                        if(error){
                            console.log('somethings wrong');
                            //res.render('member/register', {msg:'Username or Password is used please change!'})  
                        }
                        else
                            res.redirect('/member/member')
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
                    console.log('somethings wrong');
                    //res.render('member/register', {msg:'Username or Password is used please change!'})  
                }
                else
                    res.redirect('/member/member')
            })
        }
    }
    else{       
        res.render('member/register', {msg:'Please confirm your password again!'})
    }
})

router.get('/member',(req,res) => {
    
    console.log('reload');
    //console.log('username')
    const username = req.cookies.username;
    if(username){
        
        //res.render('member/member',{username:username})
        pool.query("SELECT * FROM user_info INNER JOIN users ON user_info.userID = users.userID WHERE users.username = ?  ORDER BY dataID desc",[username], function(err, rows, fields) {
            var results = []
            console.log(results.length)
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
                console.log('1 ' + username)
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
                console.log('2 ' + username)
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
                    pool.query('SELECT userImage FROM users WHERE username = ?',[username],(thiserror,thisresult)=>{
                        if(thiserror){
                            console.log(thiserror)
                        }
                        else{
                            //thisresult.userImage
                            console.log(thisresult[0].userImage)
                            if(username == admin_name)
                                res.render('member/mainAdmin', {'username':username,'results':results,'userImage':thisresult[0].userImage})
                            else
                                res.render('member/main', {'username':username,'results':results,'userImage':thisresult[0].userImage})
                        }
                    })
                    //console.log('1 ' + username)
                }
                else{
                    //console.log(results)
                    pool.query('SELECT userImage FROM users WHERE username = ?',[username],(thiserror,thisresult)=>{
                        if(thiserror){
                            console.log(thiserror)
                        }
                        else{
                            //thisresult.userImage
                            console.log(thisresult[0].userImage)
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
        res.redirect('/member/login')
})

router.post('/verify', (req,res) => {
    const {username,password} = req.body   
    const user_cookie = req.cookies.username
    console.log(md5(password))
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
                    pool.query('SELECT * FROM users WHERE username = ?',[username],(err,results)=>{
                        if(err)
                            console.log(err)
                        else{
                            console.log(results[0].userID)
                            if(results[0].userID == 1 ){
                                //admin_name = results[0].username
                                admin_name = results[0].username
                                console.log(admin_name)
                                console.log(results[0].username)
                                console.log('welcome admin')
                                res.cookie('username',admin_name,{maxAge:900000})
                                res.redirect('/member/admin')
                            }
                            else{
                                admin_name = ''
                                console.log('welcome user')
                                res.cookie('username',username,{maxAge:900000})
                                res.redirect('/member/main')
                            }
                        }
                    })
                    
                }
            }
        })
    }
    else
        res.redirect('/member/login')
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
                            console.log('err')
                        }
                        else{
                            res.render('member/admin',{'admin':userResult,'results':results})
                        }
                    })
                    
                }
            })
        }
        else{
            res.redirect('/member/member')
        }
    }
    else{
        res.redirect('/member/login')
    }
})

router.post('/send',upload.single("dataImage"), (req,res) => {
    const {userID,dataImage,details,detail_time} = req.body
    const user_cookie = req.cookies.username
    //console.log(res.cookie('username'))
    console.log(userID)
    console.log('0000')
    console.log(detail_time)
    if(user_cookie){
        if(req.file){
            const tempPath = req.file.path
            console.log(tempPath)
            const thispath = tempPath.split('\\path\\to\\temporary\\directory\\to\\store\\uploaded\\files\\')[1]
            console.log(thispath)
            
            const targetPath = path.join("static", "./img/" + user_cookie + thispath + ".jpg");
            console.log(targetPath)
            const userImage = targetPath.split('static\\')
            console.log(userImage[1])
    
            if ((path.extname(req.file.originalname).toLowerCase() === ".png")||(path.extname(req.file.originalname).toLowerCase() === ".jpg")) {
                fs.rename(tempPath, targetPath.replace(' ',''), err => {
                    if (err)
                        return handleError(err, res);
                        const sql = 'SELECT userID AS ID FROM users WHERE username = ?' //for sql USE `user`;
                        pool.query(sql,[user_cookie], (error, results) => {
                            console.log('222222')
                            console.log(results[0].ID)
                            const insert = 'INSERT INTO user_info(image,userID,details,detail_time) VALUE (?, ? ,?, ?)'
                            pool.query(insert,[userImage[1].replace(' ',''),results[0].ID,details,detail_time],(err,reslt) => {
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
        
    }
    else
        res.redirect('/member/login')
})

router.post('/seepost',(req,res)=> {
    const {dataID} = req.body
    const user_cookie = req.cookies.username
    if(user_cookie){
        const sql = 'SELECT * FROM user_info INNER JOIN users ON user_info.userID = users.userID  WHERE dataID = ?' 
        pool.query(sql,[dataID],(err,results)=>{
            if(err)
                console.log('Cannot see this post')
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
        res.redirect('/member/login')
    }
})

router.post('/users',(req,res)=>{
    const {userID,username} = req.body
    const user_cookie = req.cookies.username
    console.log(username)
    console.log(userID)
    if(user_cookie){
        if(username == user_cookie){
            res.redirect('/member/member')
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

router.post('/deleteUser',(req,res)=>{
    const {userID} = req.body
    console.log('id: ' + userID)
    const user_cookie = req.cookies.username
    if(user_cookie){
        if(user_cookie == admin_name){
            const sql = 'DELETE FROM users WHERE userID = ?'
            pool.query(sql,[userID],(err,results)=>{
                if(err){
                    console.log(err)
                }
                else{
                    res.redirect('/member/admin')
                }
            })
        }
        else
            res.redirect('/member/main')
    }
    else
        res.redirect('/member/login')

})

router.post('/editUser',(req,res)=>{
    const {userID} = req.body
    const user_cookie = req.cookies.username
    console.log(admin_name)
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
            res.redirect('/member/main')
    }
    else
        res.redirect('/member/login')
})

router.post('/score',(req,res)=>{
    const {userID,score,reviewerID} = req.body
    console.log('userID:'+userID)
    console.log('score: '+score)
    console.log('reviewerID: '+reviewerID)
    const user_cookie = req.cookies.username
    //console.log(admin_name)
    if(user_cookie){
        const select = 'SELECT * FROM credit WHERE userID LIKE ? AND reviewerID LIKE ? AND reviewerName LIKE ?'
        pool.query(select,[userID,reviewerID,user_cookie],(err,results)=>{
            if(err)
                console.log(err)
            else{
                if(results[0] == null){
                    console.log(results[0])
                    const sql = 'INSERT INTO credit (userID,score,reviewerID,reviewerName) VALUES(?, ?, ?, ?)'
                    pool.query(sql,[userID,score,reviewerID,user_cookie],(err,reviewerResult)=>{
                        if(err)
                            console.log(err)
                    })
                }
                else{
                    console.log(results[0])
                    console.log('Bruh')
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
                        res.redirect('/member/main')
                        //res.render('member/memberForUpdate',{'user':userResults,'results':infoResults})
                    }
                })
            }
        })
    }
    else
        res.redirect('/member/login')
})

router.post('/editProfileForAdmin',upload.single("profile"), (req,res)=>{
    const {userID,profile,username,email,studentid,firstname,lastname,faculty,major,phonenumber,facebook,instagram,x} = req.body
    const user_cookie = req.cookies.username
    console.log('==========================================Edit Profile (Admin)===========================================')
    console.log(userID)
    console.log(profile)
    console.log(username)
    console.log(email)
    console.log(studentid)
    console.log(firstname)  
    console.log(lastname)
    console.log(faculty)
    console.log(major)
    console.log(phonenumber)
    console.log(facebook)
    console.log(instagram)
    console.log(x)
    console.log('heyy')
    if(user_cookie){
        if(user_cookie == admin_name){
            console.log('have usercookie')
            if(req.file){
                console.log('have image')
                const tempPath = req.file.path

                console.log(tempPath)
                const thispath = tempPath.split('\\path\\to\\temporary\\directory\\to\\store\\uploaded\\files\\')[1]
                console.log(thispath)

                const targetPath = path.join("static", "./userProfile/" + user_cookie + thispath + ".jpg");
                console.log(targetPath)
                const userImage = targetPath.split('static\\')
                console.log(userImage[1])

                if ((path.extname(req.file.originalname).toLowerCase() === ".png")||(path.extname(req.file.originalname).toLowerCase() === ".jpg")) {
                    fs.rename(tempPath, targetPath, err => {
                        if (err)
                            return handleError(err, res);
                        else{
                            const sql = 'UPDATE users SET userImage = ?, username = ?, email = ?, studentID = ?, firstname = ?, lastname = ?, faculty = ?, major = ?, phonenumber = ?, facebook = ?, instagram = ?, x = ? WHERE userID = ?'                    
                            console.log('update user and image')
                            pool.query(sql, [userImage[1].replace(' ',''),username,email,studentid,firstname,lastname,faculty,major,phonenumber,facebook,instagram,x,userID], (error, results) =>{
                                if(error){
                                    console.log('somethings wrong');
                                    //res.render('member/register', {msg:'Username or Password is used please change!'})  
                                }
                                else{
                                    console.log('welcome admin')
                                    res.clearCookie('username')
                                    res.cookie('username',admin_name,{maxAge:900000})
                                    res.redirect('/member/admin')
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
                console.log('update no image')
                const sql = 'UPDATE users SET  username = ?, email = ?, studentID = ?, firstname = ?, lastname = ?, faculty = ?, major = ?, phonenumber = ?, facebook = ?, instagram = ?, x = ? WHERE userID = ?'                    
                pool.query(sql, [username,email,studentid,firstname,lastname,faculty,major,phonenumber,facebook,instagram,x,userID], (error, results) =>{
                    if(error){
                        console.log(error);
                        //res.render('member/register', {msg:'Username or Password is used please change!'})  
                    }
                    else{
                        console.log('welcome admin')
                        res.clearCookie('username')
                        res.cookie('username',admin_name,{maxAge:900000})
                        res.redirect('/member/admin')
                    }
                })
            }
        }
        else{
            res.redirect('/member/member')
        }
        
    }
    else
        res.redirect('/member/login')
})

router.post('/editProfile',upload.single("profile"), (req,res)=>{
    const {userID,profile,username,email,studentid,firstname,lastname,faculty,major,phonenumber,facebook,instagram,x} = req.body
    const user_cookie = req.cookies.username
    console.log('==========================================Edit Profile===========================================')
    console.log(userID)
    console.log(profile)
    console.log(username)
    console.log(email)
    console.log(studentid)
    console.log(firstname)  
    console.log(lastname)
    console.log(faculty)
    console.log(major)
    console.log(phonenumber)
    console.log(facebook)
    console.log(instagram)
    console.log(x)
    console.log('heyy')
    if(user_cookie){
        console.log('have usercookie')
        if(req.file){
            console.log('have image')
            const tempPath = req.file.path

            console.log(tempPath)
            const thispath = tempPath.split('\\path\\to\\temporary\\directory\\to\\store\\uploaded\\files\\')[1]
            console.log(thispath)

            const targetPath = path.join("static", "./userProfile/" + user_cookie + thispath + ".jpg");
            console.log(targetPath)
            const userImage = targetPath.split('static\\')
            console.log(userImage[1])
            console.log(userImage[1].replace(/\s/g, ""))
            if ((path.extname(req.file.originalname).toLowerCase() === ".png")||(path.extname(req.file.originalname).toLowerCase() === ".jpg")) {
                fs.rename(tempPath, targetPath.replace(/\s/g, ""), err => {
                    if (err)
                        return handleError(err, res);
                    else{
                        const sql = 'UPDATE users SET userImage = ?, username = ?, email = ?, studentID = ?, firstname = ?, lastname = ?, faculty = ?, major = ?, phonenumber = ?, facebook = ?, instagram = ?, x = ? WHERE userID = ?'                    
                        console.log('update user and image')
                        pool.query(sql, [userImage[1].replace(/\s/g, ""),username,email,studentid,firstname,lastname,faculty,major,phonenumber,facebook,instagram,x,userID], (error, results) =>{
                            if(error){
                                console.log('somethings wrong');
                                //res.render('member/register', {msg:'Username or Password is used please change!'})  
                            }
                            else{
                                pool.query('SELECT * FROM users WHERE username = ?',[username],(err,results)=>{
                                    if(err)
                                        console.log(err)
                                    else{
                                        console.log(results[0].userID)
                                        if(results[0].userID == 1 ){
                                            //admin_name = results[0].username
                                            admin_name = results[0].username
                                            console.log(admin_name)
                                            console.log(results[0].username)
                                            console.log('welcome admin')
                                            res.clearCookie('username')
                                            res.cookie('username',admin_name,{maxAge:900000})
                                        }
                                        else{
                                            admin_name = ''
                                            console.log('welcome user')
                                            res.cookie('username',username,{maxAge:900000})
                                        }
                                        res.redirect('/member/member')
                                    }
                                })
                                            // res.cookie('username',username,{maxAge:900000})
                                            // res.redirect('/member/member')
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
            console.log('update no image')
            const sql = 'UPDATE users SET  username = ?, email = ?, studentID = ?, firstname = ?, lastname = ?, faculty = ?, major = ?, phonenumber = ?, facebook = ?, instagram = ?, x = ? WHERE userID = ?'                    
            pool.query(sql, [username,email,studentid,firstname,lastname,faculty,major,phonenumber,facebook,instagram,x,userID], (error, results) =>{
                if(error){
                    console.log(error);
                    //res.render('member/register', {msg:'Username or Password is used please change!'})  
                }
                else{
                    pool.query('SELECT * FROM users WHERE username = ?',[username],(err,results)=>{
                        if(err)
                            console.log(err)
                        else{
                            console.log(results[0].userID)
                            if(results[0].userID == 1 ){
                                //admin_name = results[0].username
                                admin_name = results[0].username
                                console.log(admin_name)
                                console.log(results[0].username)
                                console.log('welcome admin')
                                res.clearCookie('username')
                                res.clearCookie('username')
                                res.cookie('username',admin_name,{maxAge:900000})
                            }
                            else{
                                admin_name = ''
                                console.log('welcome user')
                                res.cookie('username',username,{maxAge:900000})
                                
                            }
                            res.redirect('/member/member')
                        }
                    })
                }
                    
            })
        }
    }
    else
        res.redirect('/member/login')
})

router.post('/updateUser', (req,res) => {
    const {dataID} = req.body
    const user_cookie = req.cookies.username
    //console.log(res.cookie('username'))
    console.log(parseInt(dataID))
    console.log('0000')
    if(user_cookie){
        if(user_cookie == admin_name){
            const sql = 'SELECT * FROM user_info WHERE dataID = ?' //for sql USE `user`;
            pool.query(sql,[dataID], (error, results) => {
                if(error){
                    console.log('cannot update')
                }
                else{
                    console.log(results)
                    console.log('updated')
                    res.render('member/updateUser',{'results':results})
                }
            })
        }
        else{
            res.redirect('/member/main')
        }
    }
    else
        res.redirect('/member/login')
})

router.post('/userInfoUpdate',upload.single("dataImage"),(req,res) => {
    console.log('admin update')
    const {dataImage,username,details,status,dataID} = req.body
    const user_cookie = req.cookies.username
    //console.log(res.cookie('username'))
    console.log(username)
    console.log(details)
    console.log(status)
    console.log(dataImage)
    console.log(dataID)
    if(user_cookie){
        if(user_cookie == admin_name){
            if(req.file){
                console.log('uploaded file')
                console.log(dataImage)
                const tempPath = req.file.path
                console.log(tempPath)
                const thispath = tempPath.split('\\path\\to\\temporary\\directory\\to\\store\\uploaded\\files\\')[1]
                console.log(thispath)
                
                const targetPath = path.join("static", "./img/" + username + thispath + ".jpg");
                console.log(targetPath)
                const userImage = targetPath.split('static\\')
                const imgaddress = userImage[1]
    
                console.log(imgaddress.replace(' ',''))
                if ((path.extname(req.file.originalname).toLowerCase() === ".png")||(path.extname(req.file.originalname).toLowerCase() === ".jpg")) {
                    fs.rename(tempPath, targetPath.replace(' ',''), err => {
                        if (err)
                            return handleError(err, res);
                        else{
                            const sql = 'UPDATE user_info SET image = ? WHERE dataID = ?' //for sql USE `user`;
                            pool.query(sql,[imgaddress.replace(' ',''),dataID], (error, results) =>{
                                if(error){
                                    console.log('somethings wrong');
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
                    console.log('updated')
                    res.redirect('/member/admin')
                }
            })
        }
        else
            res.redirect('member/manin')
    }
    else
        res.redirect('/member/login')
})

router.post('/sendUpdate',upload.single("dataImage"),(req,res) => {
    console.log('image')
    const {dataImage,details,status,dataID} = req.body
    const user_cookie = req.cookies.username
    //console.log(res.cookie('username'))
    console.log(details)
    console.log(status)
    console.log(dataImage)
    console.log(dataID)
    if(user_cookie){
        if(req.file){
            console.log('uploaded file')
            console.log(dataImage)
            const tempPath = req.file.path

            console.log(tempPath)
            const thispath = tempPath.split('\\path\\to\\temporary\\directory\\to\\store\\uploaded\\files\\')[1]
            console.log(thispath)
            
            const targetPath = path.join("static", "./img/" + user_cookie + thispath + ".jpg");
            console.log(targetPath)
            const userImage = targetPath.split('static\\')
            const imgaddress = userImage[1]

            console.log(imgaddress.replace(' ',''))
            if ((path.extname(req.file.originalname).toLowerCase() === ".png")||(path.extname(req.file.originalname).toLowerCase() === ".jpg")) {
                fs.rename(tempPath, targetPath.replace(' ',''), err => {
                    if (err)
                        return handleError(err, res);
                    else{
                        const sql = 'UPDATE user_info SET image = ? WHERE dataID = ?' //for sql USE `user`;
                        pool.query(sql,[imgaddress.replace(' ',''),dataID], (error, results) =>{
                            if(error){
                                console.log('somethings wrong');
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
        console.log('details updated')
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

router.post('/update', (req,res) => {
    const {dataID} = req.body
    const user_cookie = req.cookies.username
    //console.log(res.cookie('username'))
    console.log(parseInt(dataID))
    console.log('0000')
    if(user_cookie){
        const sql = 'SELECT * FROM user_info WHERE dataID = ?' //for sql USE `user`;
        pool.query(sql,[dataID], (error, results) => {
            if(error){
                console.log('cannot update')
            }
            else{
                console.log(results)
                console.log('updated')
                res.render('member/update',{'results':results})
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

router.get('/all_info',(req,res) =>{
    const sql = 'SELECT * FROM user_info'
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

router.post("/upload",
    upload.single("file" /* name attribute of <file> element in your form */),
    (req, res) => {
    const username = req.cookies.username
    const tempPath = req.file.path;     
    console.log(tempPath)
    console.log(tempPath.split('\\path\\to\\temporary\\directory\\to\\store\\uploaded\\files\\')[1])
    const filename = username + tempPath.split('\\path\\to\\temporary\\directory\\to\\store\\uploaded\\files\\')[1]
    filename.split(' ')

    const targetPath = path.join(__dirname, "./uploads/" + md5(filename) + ".jpg");

    if ((path.extname(req.file.originalname).toLowerCase() === ".png")||(path.extname(req.file.originalname).toLowerCase() === ".jpg")) {
        fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);

        res
            .status(200)
            .contentType("text/plain")
            .end("File uploaded!");
        
        });
        
    } else {
        fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);

        res
            .status(403)
            .contentType("text/plain")
            .end("Only .png files are allowed!");
        });
    }
    }
);

module.exports = router

