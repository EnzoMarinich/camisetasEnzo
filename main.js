

const main = document.querySelector(".main")
const temp = main.querySelector("template")
const card = temp.content.querySelector(".card")
const modalCarrito = document.querySelector(".carrito")
const carritoProd = document.querySelector(".carrito__modal")
const botonEliminar = document.querySelector(".botonEliminar")
const iconoCarrito = document.querySelector(".icono__carrito")
const botonSeguirComprando = document.querySelector(".botonSeguirComprando")
const contadorCarrito = document.querySelector(".contador__carrito")
let carrito=[]
let stock=[]
let precioTotal = 0


// traemos los productos del json
async function fetchProd (){
    const resp = await fetch(`./data.json`)
    return await resp.json()
}
fetchProd()
            .then(prod=>{
                stock = prod
                pintarProd()
            })


document.addEventListener("DOMContentLoaded", ()=>{
    if(localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem(`carrito`))
        precioTotal = JSON.parse(localStorage.getItem(`total`))
        actualizarCart()
        contarCarrito()
    }
})



// funcion para pintar los productos en el dom
function pintarProd (){
    stock.forEach((prod)=> {
        let cardClonada = card.cloneNode(true)
        main.appendChild(cardClonada)
        cardClonada.classList.add(`card${prod.id}`)
        cardClonada.querySelector(".card__img").style.backgroundImage = `url(${prod.img})`
        cardClonada.children[1].querySelector(".card__descripcion__nombre").innerText = prod.nombre
        cardClonada.children[1].querySelector(".card__descripcion__precio").innerText = `$${prod.precio}`
        cardClonada.children[2].classList.add(`button${prod.id}`)
        cardClonada.children[3].querySelector(".material-symbols-outlined").classList.add(`info${prod.id}`)

        //agregamos el evento para mostrar info de cada equipo
        const botonInfo = document.querySelector(`.info${prod.id}`)
        botonInfo.addEventListener("click", ()=>{
            Swal.fire(`${prod.equipo}: ${prod.info}`)
        })

        // agregamos el evento al boton de añadir al carrito 
        const ButtonAddToCart = document.querySelector(`.button${prod.id}`) 
        ButtonAddToCart.addEventListener("click", ()=>{
            addToCart(prod.id)
            contarCarrito()
            toast(prod.id)
            guardarLocalStorage()
        })
    });
}

//funcion para sumar los productos al carrito
const addToCart = (prodId)=>{
    let elec = carrito.some(prod=> prod.id === prodId)
    if (elec){
        let elecc = carrito.find(prod=> prod.id === prodId)
        elecc.cantidad++
        precioTotal += elecc.precio
    } else {
        let eleccion = stock.find((prod)=> prod.id === prodId)
        eleccion.cantidad = 1
        carrito.push(eleccion)
        precioTotal += eleccion.precio
    }
}


//funcion para mostrar los productos en el carrito
const actualizarCart = () =>{
    carritoProd.innerHTML =""
    carrito.forEach((prod)=>{
        const div = document.createElement("div")
        div.classList.add("carrito__modal__detalle")
        div.innerHTML = `
            <img src="${prod.img}" alt="">
            <p>${prod.nombre}</p>
            <p>x${prod.cantidad}</p>
            <p>$${prod.precio}</p>
            <button class="botonEliminar" onclick="eliminarDelCarrito(${prod.id})">eliminar</button>
        `
        carritoProd.appendChild(div)
    })
    const total = document.createElement("div")
    total.classList.add("precioTotal")
    total.innerText = `Total: $${precioTotal}`
    carritoProd.appendChild(total)
}

// creamos el precio total 
const total = document.createElement("div")
total.classList.add("total")
total.innerText = `Total: $${precioTotal}`
carritoProd.appendChild(total)


//creamos el boton finalizar compra
const finalizarCompra = document.createElement("button")
finalizarCompra.classList.add("botonFinalizarCompra")
finalizarCompra.innerText = "Finalizar compra"
modalCarrito.appendChild(finalizarCompra)

//evento a finalizar compra
finalizarCompra.addEventListener("click", async()=>{
    const { value: email } = await Swal.fire({
        title: 'Finalizando Compra',
        input: 'email',
        inputLabel: 'Ingrese su email',
        inputPlaceholder: ''
    })
    if (email) {
        Swal.fire(`Nos estaremos comunicando a ${email} para finalizar con alguno detalles de la compra. Muchas Gracias!`)
    }
})


//creamos el boton vaciar carritos
const vaciarCarito = document.createElement("button")
vaciarCarito.classList.add("vaciarCarrito")
vaciarCarito.innerText ="Vaciar carrito"
modalCarrito.appendChild(vaciarCarito)

//evento para vaciar carrito
vaciarCarito.addEventListener("click", ()=>{
    carrito = []
    precioTotal = 0
    modalCarrito.style.display = "none"
    contarCarrito()
    guardarLocalStorage()
})


//evento para seguir comprando
botonSeguirComprando.addEventListener("click", ()=>{
    modalCarrito.style.display = "none"
    guardarLocalStorage()
})

//evento para mostrar el carrito
iconoCarrito.addEventListener("click", ()=>{
    modalCarrito.style.display = "flex"
    actualizarCart()
})


// funcion para contador del carrito
function contarCarrito(){
    contadorCarrito.innerText = carrito.length
}

//funcion para eliminar del carrito un prod
const eliminarDelCarrito = (prodID)=>{
    let item = carrito.find(prod=> prod.id == prodID)
    item.cantidad--
    if(item.cantidad == 0){
        let indice = carrito.indexOf(item)
        carrito.splice(indice , 1)
    }
    precioTotal -= item.precio   
    contarCarrito()
    actualizarCart()
    guardarLocalStorage()
}

// funcion para mostrar toast
const toast = (prodID)=>{
    const x = stock.find((prod)=>prod.id === prodID)
    Toastify({
        text: `Has agregado la ${x.nombre} al carrito `,
        duration: 1500,
        }).showToast();

}


const guardarLocalStorage = ()=>{
    localStorage.setItem("carrito", JSON.stringify(carrito))
    localStorage.setItem("total", JSON.stringify(precioTotal))
}

const portadas = [ "img/portada-puma.png",  "img/portada-adidas.png" ,"img/portada-nike.png", "img/portada-puma2.png"  ]

const publicidad = document.querySelector(".publicidad")
const nextPublicidad = document.querySelector(".publicidad__next")
const backPublicidad = document.querySelector(".publicidad__back")
let contador = 0


nextPublicidad.addEventListener("click", ()=>{
    contador++
    if(contador == 4){
        contador = 0
    }
    publicidad.style.backgroundImage = `url(${portadas[contador]})`
})

backPublicidad.addEventListener("click", ()=>{
    contador--
    if(contador == -1){
        contador = 3
    }
    publicidad.style.backgroundImage = `url(${portadas[contador]})`
})






const filtro = document.querySelector(".filtro")

const filtrar = ()=>{
    let filtrado = filtro.value.toLowerCase()

    stock.forEach((prod)=>{
        let nombre = prod.equipo.toLowerCase()

        if( nombre.indexOf(filtrado) == -1 ){
            document.querySelector(`.card${prod.id}`).style.display="none"
        } else{
            document.querySelector(`.card${prod.id}`).style.display="block"
        }
    })
}

filtro.addEventListener("keyup", filtrar)