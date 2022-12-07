const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const id = urlParams.get("id")

if (id != null) {
    // troix variables à utliser dans cart.js
    let itemPrice = 0
    let img_Url, alt_Text, articleName
}

fetch(`http://localhost:3000/api/products/${id}`)
.then (reponse => reponse.json())
.then((res) => handleData(res))


function handleData(canape) {

const {altTxt, colors, description, imageUrl, name,price}  = canape
itemPrice = price
img_Url = imageUrl
alt_Text = altTxt
articleName = name
makeImage(imageUrl, altTxt)
makeTitle(name)
makePrice(price)
makeDescription(description)
makecolors(colors)

}

function makeImage(imageUrl, altTxt) {
const image = document.createElement("img")
image.src = imageUrl
image.alt = altTxt
const parent = document.querySelector(".item__img")

if (parent != null) parent.appendChild(image)

}

function makeTitle(name) {

   const h1 =  document.querySelector("#title")
   if (h1 != null) h1.textContent = name
}

function makePrice(price) {

    const span = document.querySelector("#price")
    if (span != null) span.textContent = price
}

function makeDescription(description) {
    const p = document.querySelector("#description")

    if (p != null) p.textContent = description
}

function makecolors(colors) {

    const colorSelect = document.querySelector("#colors")

    if (colorSelect != null){
     colors.forEach(color => {
        
        const option = document.createElement("option")
        option.value = color
        option.textContent =color
        
        colorSelect.appendChild(option)
     })

    }

}

const button = document.querySelector("#addToCart")

if (button != null){
   button.addEventListener("click", handleClick)
}


function handleClick() {

    const color = document.querySelector("#colors").value
    const quantity = document.querySelector("#quantity").value
 
    if (IsOrderInvalid(color,quantity)) return
    saveOrder(color,quantity)
    redirectToCarte()
 
}

function saveOrder(color, quantity) {
const key = `${id}-${color}`
    const data = {
        // 
        id :id,
        color :color,
        quantity : Number(quantity),
        price : itemPrice,
        imageUrl : img_Url,
        altTxt : alt_Text,
        name : articleName
       }
       localStorage.setItem(key,JSON.stringify(data))
              
}

function IsOrderInvalid(color, quantity){
    if (color == null || color == "" || quantity == null || quantity == 0) {

        alert ("Veuillez selectionner une couleur et une quantity")
        return true
       }

}

function redirectToCarte() {

    window.location.href = "index.html" // revenir à la page d'accueil
}