// Récupérer les informations de localstorage //

const cartes = []
itemsFromcache()

const orderButton = document.querySelector("#order")
orderButton.addEventListener("click", (e) => submitform(e))

cartes.forEach((item ) => displayItem(item))

function itemsFromcache () {
    const numberOfItems = localStorage.length
    for (let i = 0; i< numberOfItems; i++){
        const item = localStorage.getItem(localStorage.key(i))
       
        const itemObj = JSON.parse(item)   // en faire un object
        cartes.push(itemObj)

           
    
    }
   // cartes.sort()

   cartes.sort(function id(a, b) {
    if (a.id > b.id)
        return 1;
    if (a.id < b.id)
        return -1;
    return 0
})

}

function displayItem(item) {
        
        const article = makeArticle(item)
       
        const Imgdiv = makeImageDiv(item)
        
        article.appendChild(Imgdiv)
        
        //////
        
        const cartItemContent = makeCartItemContent(item)

        //const cartItemSetting = makeSetting(item)

        article.appendChild(cartItemContent)
        //article.appendChild(cartItemSetting)
        
        displayArticle(article)
        displayTotalQuantity(item)
        displayTotalPrice(item)

        
    }

function makeImageDiv(item){
    const div = document.createElement("div")
    div.classList.add("cart__item__img")
    const image = document.createElement("img")
    image.src = item.imageUrl
    image.alt = item.altTxt

    div.appendChild(image)

    return div
   
}

function makeArticle(item) {

    const article = document.createElement("article")
    article.classList.add("#cart__items")
    article.dataset.id = item.id
    article.dataset.color = item.color
    return article
}

function displayArticle(article) {

    document.querySelector("#cart__items").appendChild(article)

}

function makeCartItemContent(item) {

    const div  = document.createElement("div")
    div.classList.add("cart__item__content")

    // première div ....Description //
    const description1 = makeDescription(item)

    // deuxième div setting ... contient deux div //
    const settings = makeSetting(item)
    
    
    div.appendChild(description1)
    div.appendChild(settings)
   
    return div
}

function makeDescription(item) {
   
    // premiére div ....make descrition //
    const description = document.createElement("div")
    description.classList.add("cart__item__content__description")

    const h2 = document.createElement("h2")
    h2.textContent = item.name

    const p = document.createElement("p")
    p.textContent = item.color

    const p1 = document.createElement("p")
    p1.textContent = item.price +" €"  // alt+0128

    description.appendChild(h2)
    description.appendChild(p)
    description.appendChild(p1)
    
   
    return description
}

function makeSetting(item) {
 // deuxième div contient deux autres div 

    const div = document.createElement("div")
    div.classList.add("cart__item__content__settings")

        const div1 = document.createElement("div")
         div1.classList.add("cart__item__content__settings__quantity") 
            
            const p = document.createElement("p")
            p.textContent = "Qté :"

            const input = document.createElement("input")
            input.classList.add("itemQuantity")
            input.type ="number"
            input.name ="itemQuantity"
            input.min ="1"
            input.max ="100"
            input.value = item.quantity
            input.addEventListener("input",() => UpdatePriceQte(item.id, input.value,item)) 
                 
            div1.appendChild(p)
            div1.appendChild(input)
 

        const div2 = document.createElement("div")
            div2.classList.add("cart__item__content__settings__delete")
            
            const p1 = document.createElement("p")
            p1.classList.add("deleteItem")
            p1.textContent = "Supprimer"
            p1.addEventListener("click",() => DeleteItem(item)) 
        
            div2.appendChild(p1)

    div.appendChild(div1)
    div.appendChild(div2)


    return div
            
}

function displayTotalQuantity(){

    const TotalQuantity = document.querySelector("#totalQuantity")
    
    let TotalQte = 0 

    cartes.forEach(item => {
     const TotalQuantiteElt = item.quantity
     
     TotalQte += TotalQuantiteElt

    })

    // autre manière pour éviter la boucle //
    // const TotalPrice = cartes.reduce((TotalPrice,item) =>TotalPrice + item.price * item.quantity,0)
    
    TotalQuantity.textContent = TotalQte  
    
}

function displayTotalPrice() {

    const TotalQuantityPrice = document.querySelector("#totalPrice")
    const TotalPrice = cartes.reduce((TotalPrice,item) =>TotalPrice + item.price * item.quantity,0)
    TotalQuantityPrice.textContent = TotalPrice
       
   
}

function UpdatePriceQte(id,newValue,item) {
//input.addEventListener("input",() => UpdatePriceQte(item.id, input.value)) 
//`${id}-${color}`
    const ItempToUpdate = cartes.find((item) => item.id === id)
    //const ItempToUpdate = cartes.find((item) => item.id === `${id}-${color}`)

    ItempToUpdate.quantity = Number(newValue)
    item.quantity = ItempToUpdate.quantity
    displayTotalQuantity()
    displayTotalPrice()
    SaveToCache(item)
    

}

function SaveToCache(item) {
// sauvegarde en cas de modif quantite dans le panier //
    const data = JSON.stringify(item)
  
    const key = `${item.id}-${item.color}`
    localStorage.setItem(key,data) 
    
    
    
}

function DeleteItem(item) {
 
 const ItemToDelete = cartes.findIndex( 
    (product) => product.id === item.id && product.color === item.color
 )
     
    // reste à supprimer l'item de cartes //
     cartes.splice(ItemToDelete)
     
     displayTotalPrice()
     displayTotalQuantity()
     DeleteToCache(item) 
     DeleteArticleFromPage(item)
   
}

function DeleteToCache(item) {

    const key = `${item.id}-${item.color}`
    localStorage.removeItem(key)
}

function DeleteArticleFromPage(item) {
   const articleToDelete = document.querySelector(
    `article[data-id="${item.id}"][data-color="${item.color}"]`
   )

  
   articleToDelete.remove()

}

function submitform(e){
    //alert("Formulaire envoyé avec succés")
    e.preventDefault() // ne pas rafraichir le formulaire //

    if (cartes.length === 0 ) {
        alert ("votre panier est vide")
        return
    }
    if (isFormValide()) return 
    if (isEmailInvalid()) return

    //const form = document.querySelector(".cart__order__form")
    
    const body = makeRequestBody()
    // pour un post fetch recoit deux argument , le deuxième un objet
    
    fetch("http://localhost:3000/api/products/order", 
    {
      method:"post",
      body  : JSON.stringify(body),
      headers :{
        "Content-Type" :"application/json",
      }

    })
    
    .then ((resp) => resp.json())
    .then ((data) => {
       const orderId = data.orderId
       window.location.href = ("confirmation.html" + "?orderId=" + orderId)
       
    })
    .catch((err) => console.error(err))  // le message s'affiche ne rouge
    
    // aprés avoir valider la commande , il faut revenir à l'acceuil
}

function makeRequestBody() {
 const form = document.querySelector(".cart__order__form")
 const firstName = form.elements.firstName.value
 const lastName = form.elements.lastName.value
 const address  = form.elements.address.value
 const city     = form.elements.city.value
 const email    = form.elements.email.value

 const body = {
    contact: {
    firstName: firstName,
    lastName: lastName,
    address: address,
    city: city,
    email: email
  },
  products:getIdsFromCache() 

 }

 return body
}

function getIdsFromCache() {
// on pouvait utiliser cartes[]
    const nbrOfProducts = localStorage.length
    const ids = []
    for (let i=0; i < nbrOfProducts;i++) {

        const key = localStorage.key(i)
       
        const id = key.split("-")[0]
        ids.push(id)
    }
    return ids
   
}

function isFormValide() {

     const form = document.querySelector(".cart__order__form")
     const inputs = document.querySelectorAll("input")
     //querySelectorAll retourne une liste d'élément //
     // queryselector retourn un seule élément//
     
     inputs.forEach((input) => {
            if (input.value === "") 
            {
            alert ("Veuillez remplir le champs vide")
            return true
            }
        return false
     })
}

function isEmailInvalid() {
 const email = document.querySelector("#email").value
 const regex = /^[A-Za-z0-9+_.-]+@(.+)$/
 if (regex.test(email) === false) {
    alert("Veuillez entrer une adresse mail correcte") 
    return true
}
   return false
}
