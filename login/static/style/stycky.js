cardTitleCollection = document.getElementsByClassName('status');
stickElement = document.querySelectorAll("#card-status")
stickCard = document.querySelectorAll("#stick2")
img = document.querySelectorAll('#show-image')
var i = 0;
stickElement.forEach(element => {
    var item = cardTitleCollection[i]
    //console.log(item.innerText)
    if (item.innerText == 'Found')
        stickCard[i].style.boxShadow = "5px 10px 10px rgb(255, 48, 48, 0.3)"
    else if (item.innerText == 'Returned')
        stickCard[i].style.boxShadow = "5px 10px 10px rgb(60, 255, 0, 0.3)"
    else if (item.innerText == 'Lost')
        stickCard[i].style.boxShadow = "5px 10px 10px rgb(0, 0, 0, 0.3)"
    src = img[i].getAttribute('src')
    //console.log(src)
    if (src == '/')
        img[i].src = '../img/white_bg.jpg'
    i++
})

function myFunction() {
    var input, filter, card, name, a, i, txtDetail,txtUsername;
    input = document.getElementById("myInput");
    //filter = input.value.toUpperCase();
    //element = document.getElementsByClassName("cardforsearch")
    filter = input.value.toUpperCase();

    getEachCard = document.querySelectorAll("#stick2")
    getUsername = document.getElementsByClassName('username')
    getDetail = document.getElementsByClassName('detail')

    i = 0
    
    getEachCard.forEach(element => {
        for(j=0;j<getDetail[i].innerText.length;j++){
            txtDetail = getDetail[i].textContent || getDetail[i].innerText
            txtUsername = getUsername[i].textContent || getUsername[i].innerText
            if((txtDetail.toUpperCase().indexOf(filter) > -1)|| (txtUsername.toUpperCase().indexOf(filter) > -1)){
                console.log('yaaaaa')
                getEachCard[i].style.display = ""
            }
            else{
                console.log('nnnnnnnn')
                getEachCard[i].style.display = "none"
            }
        }
        i++
    })
    console.log(input.value)
}

