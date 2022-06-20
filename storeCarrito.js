const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const finalizar = document.getElementById('btn-finalizar')
const contenedorCarrito = document.getElementById('contenedor-carrito').content
const contenedorCard = document.getElementById('contenedor-card').content
const contenedorFooter = document.getElementById('contenedor-footer').content
const fragment = document.createDocumentFragment()
let carrito = {}

/*Eventos*/
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
});
cards.addEventListener('click', e => {
    addCarrito(e)
});
items.addEventListener('click', e => { btnAumentarDisminuir(e) });

/*Jalar desde Json los Items (productos del ecommerce)*/ 
const fetchData = async () => {
    const res = await fetch('items.json');
    const data = await res.json()
    pintarCards(data)
}

/*Pintar productos*/ 
const pintarCards = data => {
    data.forEach(item => {
        contenedorCard.querySelector("h5").textContent = item.nombre
        contenedorCard.querySelector("h6").textContent = item.detalle
        contenedorCard.querySelector('p span').textContent = item.precio
        contenedorCard.querySelector('img').setAttribute("src", item.imagen)
        contenedorCard.querySelector('button').dataset.id = item.id
        const clone = contenedorCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

/*Agregar al carrito*/ 
const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        Toastify({
            text: "You added an item to your bag!",
            duration: 2000,
            position: "center",
            gravity: "bottom",
            style: {
                background: "#345267"
            }

        }).showToast()
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation() /*x sia para detener otro evento*/
}

const setCarrito = item => {
    const producto = {
        nombre: item.querySelector('h5').textContent,
        precio: item.querySelector('span').textContent,
        id: item.querySelector('button').dataset.id,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = { ...producto }

    pintarCarrito()
}

const pintarCarrito = () => {
    items.innerHTML = ''

    Object.values(carrito).forEach(producto => {
        contenedorCarrito.querySelectorAll('td')[0].textContent = producto.nombre
        contenedorCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        contenedorCarrito.querySelector('span').textContent = producto.precio * producto.cantidad

        /*Los botones*/
        contenedorCarrito.querySelector('.btn-sumar').dataset.id = producto.id
        contenedorCarrito.querySelector('.btn-quitar').dataset.id = producto.id

        const clone = contenedorCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = ''

    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <h3 class="text-center mt-0 mb-0"></h3>
        `
        return
    }

    /*sumas de productos y precios*/ 
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)

    contenedorFooter.querySelectorAll('td')[0].textContent = nCantidad
    contenedorFooter.querySelector('span').textContent = nPrecio

    const clone = contenedorFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        Swal.fire({
            type: 'info',
            title: 'Oops...',
            text: 'You removed items from your bag!',
            showConfirmButton: false,
            timer: 2000,
        })
        carrito = {}
        pintarCarrito()
    })

    const botonDos = document.querySelector('#finalizar')
    botonDos.addEventListener('click', () => {
        Swal.fire({
            title: 'Checkout',
            showDenyButton: true,
            confirmButtonText: 'Confirm',
            confirmButtonColor: '#7066e0',
            denyButtonColor: '#000000',
            denyButtonText: `Cancel`
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Great!', 'Your purchase was successful', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Now your bag is empty!', '', 'info')
            }
        })

        carrito = {}
        pintarCarrito()

    })

}

const btnAumentarDisminuir = e => {
    if (e.target.classList.contains('btn-sumar')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        pintarCarrito()
    }

    if (e.target.classList.contains('btn-quitar')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = { ...producto }
        }
        pintarCarrito()
    }
    e.stopPropagation()
}


