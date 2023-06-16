// URL base 
const baseUrl = "https://ecommercebackend.fundamentos-29.repl.co/";
// Dibujar productos en la web
const productsList = document.querySelector('#products_container');

// Mostrar y ocultar carrito
const navToggle =  document.querySelector(".nav__button--toggle");
const navCar = document.querySelector(".nav__car");
// Carrito de compras
const car = document.querySelector("#car");
const carList = document.querySelector("#car__list");
//Varicar carrito
const emptyCarButton = document.querySelector("#empty__car");

// Array carrito
/*Necesitamos tener un array que reciba los elementos que debo introducir
en el carrito de compra*/
let carProducts = [];
// Ventana modal
const modalContainer = document.querySelector("#modal-container");
const modalElement =document.querySelector("#modal-element");
let modalDetails = [];

navToggle.addEventListener("click", () => {
    navCar.classList.toggle("nav__car--visible")
})

eventListenersLoder()

function eventListenersLoder() {
    //Cuando se presione el boton "Add to car"
    productsList.addEventListener("click", addProduct)
    //Cuando se precione el boton "Delete"
    car.addEventListener("click", deleteProduct);
    //Cuando se de click al botton empty car
    emptyCarButton.addEventListener("click", emptyCar)
    //Listener modal, cuando se de click al boton de ver detalle
    productsList.addEventListener("click", modalProduct)
    //Cuando se de click de cerrar detalles
    modalContainer.addEventListener("click", closeModal)
    //Se ejecute cuando carga la pagina
    document.addEventListener("DOMContentLoaded", () => {
        /* Si el localStorage tiene info entonces, igualamos carProducts
        con la info del localStorage. Pero si el localStorage esta vacio,
        entonces, carProducts es igual a un array vacio*/
        carProducts = JSON.parse(localStorage.getItem("car")) || [];
        carElementsHTML()
    })
}



/* Hacer peticiones a la API de prodcutos
    1- Crear una funcion con la peticion
*/

function getProducts() {
    axios.get(baseUrl)
        .then((response) => {
            const products = response.data
            printProducts(products)
        })
        .catch((error) => {
            console.log(error)
        })
}
getProducts()

/*
    2- Renderizar los productos capturados de la API en mi html.
*/

function printProducts(products) {
    let html = '';
    for(let product of products) {
        html += `
            <div class="products_element">
                <img src="${product.image}" alt="product_image" class="products__img">
                <p class="products__name">${product.name}</p>
                <div class="products__div">
                    <p class="products__price">USD ${product.price.toFixed(2)}</p>
                </div>
                <div class="products__div div__button">
                    <button data-id="${product.id}" class="products__button add_car">
                        Add to car
                    </button>
                    <button class="product_details" data-description="${product.description}">
                    <ion-icon name="search-outline" class="div__icon"></ion-icon>
                    </button>
                </div>
            </div>
            `
    }
    productsList.innerHTML = html
}

// Agregar los productos al carrito
// 1- Capturar la informacion del producto al que se le de click.

function addProduct(event){
    // Metodo contains => valida si existe un elemento dentro de la clase
    if(event.target.classList.contains("add_car")){
        const product = event.target.parentElement.parentElement
        /* parentElement => nos ayuda a acceder al padre inmediatamente
        superior del elemento */
        carProductsElements(product)
    }
}

// 2- Debemos transformar la infromacion HTML a una array de objetos.
/* 2.1 - Debo validar si el elemento seleccionado ya se encuentra dentro 
del array del carrito (carProducts). si existe, le debo sumar una unidad
para que no se repita*/
function carProductsElements(product){
    const infoProduct = {
        id: product.querySelector("button").getAttribute("data-id"),
        image: product.querySelector("img").src,
        name: product.querySelector("p").textContent,
        price: product.querySelector(".products__div p").textContent,
        quantity: 1
        // textContent nos permite pedir el texto que contiene un elemento
    }
    /*Agregar el objeto de infoProduct al array de carProduct, pero hay que validar 
    si el elemento existe o no */
    /*El primer if valida si por lo menos un elemento que se encuentre en
    carProducts es igual al que quiero enviarle en infoProduct*/ 
    if ( carProducts.some( product => product.id === infoProduct.id ) ){ //True or false
        const productIncrement = carProducts.map(product => {
            if(product.id === infoProduct.id){
                product.quantity++
                return product
            }else {
                return product
            }
        })
        carProducts = [ ...productIncrement ]
    }else {
        carProducts = [ ...carProducts, infoProduct ]
    }
    carElementsHTML()
}

function carElementsHTML () {
    let carHTML = '';
    for (let product of carProducts){
        carHTML += `
        <div class="car__product">
        <div class="car__product__image">
          <img src="${product.image}">
        </div>
        <div class="car__product__description">
          <p>${product.name}</p>
          <p>Precio: ${product.price}</p>
          <p>Cantidad: ${product.quantity}</p>
        </div>
        <div class="car__product__button">
            <button class="delete__product" data-id="${product.id}">
                Delete
            </button>
        </div>
    </div>
    <hr>
    `
    }
    carList.innerHTML = carHTML;

    productStorage()
}

//Local Storage
function productStorage(){
    localStorage.setItem("car", JSON.stringify(carProducts))
}

// Eliminar productos del carrito 
function deleteProduct(event) {
    if(event.target.classList.contains('delete__product')){
        const productId = event.target.getAttribute('data-id')
        carProducts = carProducts.filter(product => product.id != productId)
        carElementsHTML()
    }    
}

//Vaciar carrito
function emptyCar() {
    carProducts = [];
    carElementsHTML()
}

//Ventana modal
// 1- Crear funcion que escuche el boton del producto.
function modalProduct(event) {
    if(event.target.classList.contains("div__icon")){
        modalContainer.classList.add("show__modal")
        const product = event.target.parentElement.parentElement.parentElement
        modalDetailsElement(product)
    }
}
// 2- Crear funcion que escuche el boton de cierre.
function closeModal(event){
    if(event.target.classList.contains("modal__icon")){
        modalContainer.classList.remove("show__modal")
    }
}
//3- Crear funcion que convierta la info HTML en objeto.
function modalDetailsElement(product){
    const infoDetails = {
        id: product.querySelector("button").getAttribute("data-id"),
        image: product.querySelector("img").src,
        name: product.querySelector("p").textContent,
        price: product.querySelector(".products__div p").textContent,
        description: product.querySelector("button").getAttribute("data-description")
    }
    modalDetails = [ ...modalDetails, infoDetails]
    modalHTML()
}
//4- Dibujar producto dentro del modal
function modalHTML(){
    let detailsHTML = ""
    for(let element of modalDetails) {
        detailsHTML = `
        <div class="div__details">
            <img src="${element.image}" class="img__modal">
            <div class="element__modal">
                <p>${element.name}</p>
                <p>Precio: ${element.price}</p>
            </div>
        </div>
        `
    }
    modalElement.innerHTML = detailsHTML
}

//Local Storage
/* Es una base del navegador que nos permite almacenar informacion 
para hacerla recurrente dentro de nuestra pagina */

//Guardando un valor en el local storage => setItem("key", "value")
//localStorage.setItem("name", "Lucas")

// Obtener info desde localStorage => getItem
//localStorage.getItem("name")

//const user = {name: "Lucas", lastName: "Barcelo"}

// convertir el user(objeto) en JSON
//localStorage.setItem("user", JSON.stringify(user))

//Obtener la info y convertir de JSON a JavaScript
//const userLocal = localStorage.getItem("user")
//JSON.parse(userLocal)
