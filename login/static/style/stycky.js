// const stick1 = document.getElementById('stick1')
// stick1.style.backgroundColor = "rgb(255, 48, 48)"
// stick1.innerHTML = "<h1>Sticky</h1><h6>Note</h6>"

// message = document.getElementById('message')
// console.log(message)
// message[0].style.display = "None"


// var mysql = require('mysql2')

// require('dotenv').config()

// var pool = mysql.createConnection({
//     user: 'root',  
//     host: 'localhost',
//     database: 'user',
//     password: "1234",
//     port: 3306,
// });


// router.get('/member',(req,res) =>{

// pool.connect((err)=>{
//     if(err) throw err
// let dataEX
//     console.log('Connected')
//     const sql = 'SELECT * FROM users'
//     pool.query(sql,(err,results,field)=>{
//         if(err){
//             console.log('can not query')
//         }
//         else{
//             pool.query('SELECT COUNT(details) AS cnt FROM user_info WHERE userID = 5',(err,count_results,field)=>{
                
//                 console.log(count_results)
//                 var data = JSON.parse(count_results[0].cnt)
//                 dataEX = JSON.stringify(data);
//                 console.log(dataEX)
//                 // n = parseInt(count_results[0].cnt)
//                 // console.log(count_results[0].cnt)
//                 // count_results.forEach(function (elem) { 
//                 //     console.log(elem.TITLE + ' ' + elem.AUTHOR);
//                 // });
//                 // const data = JSON.parse(pool.json(count_results))
//                 // console.log(data[0])

                
//             })
//             //console.log(results)
//         }
//     })
// //})
// //})
// console.log('data = ')

var data = JSON.parse(results)

function addBox() {
    //show-info
    const text = 555
    console.log('addddddd')
    const box = document.createElement("div")
    box.setAttribute("id", "stick3")
    
    const info = document.createTextNode(data)
    box.appendChild(info)

    const newNote = document.getElementById('show-info')
    console.log(newNote)
    const adder = document.getElementById('adder')
    newNote.insertBefore(box,adder)
    stickElement = document.querySelectorAll("#stick1,#stick2,#stick3")
    stickElement.forEach(element => {
        //element.style.backgroundColor = "#F00"
        element.style.color = "#000"
        element.style.fontSize = "1em"
    })
}

// function addBox(){
//     //show-info
//     console.log('addddddd')
//     const box = document.createElement("div")
//     box.setAttribute("id", "stick3");

//     const info = document.createTextNode("Noteeee")
//     box.appendChild(info)

//     const newNote = document.getElementById('show-info')
//     console.log(newNote)
//     const adder = document.getElementById('adder')
//     newNote.insertBefore(box,adder)
//     stickElement = document.querySelectorAll("#stick1,#stick2,#stick3")
//     stickElement.forEach(element => {
//         //element.style.backgroundColor = "#F00"
//         element.style.color = "#000"
//         element.style.fontSize = "1em"
//     })
// }