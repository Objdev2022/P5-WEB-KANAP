fetch("http://localhost:3000/api/products")
.then((resp) => resp.json())
.then((canapes) => addProduct(canapes))


/*altTxt: 
"Photo d'un canapé bleu, deux places"
colors:: 
(3) ['Blue', 'White', 'Black']
description: 
"Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
imageUrl: 
"http://localhost:3000/images/kanap01.jpeg"
name: "Kanap Sinopé"
price:1849
_id:"107fb5b75607497b96722bda5b504926"*/

function addProduct(canapes){
// récupération des données //
	
	//const _id = data[0]._id
	//const imageUrl = data[0].imageUrl
	//const altTxt = data[0].altTxt
	//const name = data[0].name
	//const description = data[0].description
    

	
	canapes.forEach(canape => {
		
		const { _id , imageUrl, altTxt, name, description} = canape
		
		// construction des éléments html //
		const h3 = makeH3(name)
		const anchor = makeAnchor(_id)
		const article = document.createElement("article")	  ///makeArticle()
		const p = makeParagraphe(description)
		
		const image = makeImage(imageUrl,altTxt)
		
		
		appendElementToArticle(article,[image,h3,p])
		
		appendArticleToAnchor(anchor,article)
		
		
		
	})
}

function appendElementToArticle(article,array) {

	array.forEach((item) => {
		article.appendChild(item)
	})
	
		
}

function makeAnchor(id) {

	const anchor = document.createElement("a")
	anchor.href = "./product.html?id="+ id 
	// va vers la page descriptive du produit //
	
	return anchor
}

function appendArticleToAnchor(anchor,article) {
	const items = document.querySelector("#items")
	if (items != null ){
		items.appendChild(anchor)
		anchor.appendChild(article)
		}
	}


function makeImage(imageUrl, altTxt){
	const image = document.createElement("img")
    image.src = imageUrl
	image.alt= altTxt

	return image

}

function makeH3(name) {
 const h3 = document.createElement("h3")
 h3.textContent = name
 h3.classList.add("productName")
 return h3

}

function makeParagraphe(description){
	const p = document.createElement("p")
	p.textContent = description
	p.classList.add("productDescription")
    return p

}