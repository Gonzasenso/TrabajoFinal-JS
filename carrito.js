// Base de datos simulada (por defecto)
let products = [
    { id: 1, name: "Placa de Video", price: 1500 },
    { id: 2, name: "Mouse", price: 200 },
    { id: 3, name: "Teclado", price: 250 },
    { id: 4, name: "Camara", price: 400 },
    { id: 5, name: "Monitor", price: 1000 },
    { id: 6, name: "Escritorio", price: 1200 },
];

// Obtener el carrito desde el almacenamiento local
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Evento para cargar productos en la lista
window.addEventListener('DOMContentLoaded', () => {
    // Llamamos a la función para cargar datos locales
    loadLocalData();
    displayCart();
});

// Función para cargar datos desde un archivo JSON local usando fetch
function loadLocalData() {
    fetch('./json/productos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo JSON.');
            }
            return response.json();
        })
        .then(data => {
            products = data; // Reemplazar la lista de productos con los datos cargados
            displayProducts(products); // Mostrar los productos en la página
        })
        .catch(error => {
            console.error(error);
        });
}

        // Función para mostrar productos en la lista
        function displayProducts(products) {
            const productList = document.getElementById('productList');
            productList.innerHTML = '';

            products.forEach(product => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${product.name} - $${product.price}
                    <button data-productid="${product.id}" class="addToCartButton">Agregar al carrito</button>
                `;
                productList.appendChild(li);
            });

            // Asignar evento al botón de búsqueda
            const searchButton = document.getElementById('searchButton');
            searchButton.addEventListener('click', searchProduct);

            // Asignar eventos a los botones del carrito
            const addToCartButtons = document.querySelectorAll('.addToCartButton');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const productId = parseInt(button.getAttribute('data-productid'));
                    addToCart(productId);
                });
            });

            const clearCartButton = document.getElementById('clearCartButton');
            clearCartButton.addEventListener('click', clearCart);

            const buyButton = document.getElementById('buyButton');
            
        }

        // Función para agregar productos al carrito
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);

            if (product) {
                cart.push(product);
                updateCart();
            }
            Toastify({
                text: `Se ha añadido ${product.name} al carrito`,
                gravity:`bottom`,
                position:`center`,
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
                }).showToast();
        }

        // Función para actualizar el carrito en el DOM y en el almacenamiento local
        function updateCart() {
            const cartList = document.getElementById('cart');
            cartList.innerHTML = '';

            let totalPrice = 0;

            cart.forEach((product, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${product.name} - $${product.price}
                    <button data-index="${index}" class="removeFromCartButton">Quitar</button>
                `;
                cartList.appendChild(li);
                totalPrice += product.price;
            });

            // Actualizar el precio total
            document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);

            // Guardar el carrito en el almacenamiento local
            localStorage.setItem('cart', JSON.stringify(cart));

            // Asignar eventos a los botones de quitar
            const removeFromCartButtons = document.querySelectorAll('.removeFromCartButton');
            removeFromCartButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const index = parseInt(button.getAttribute('data-index'));
                    removeFromCart(index);
                });
            });
        }

        // Función para mostrar el carrito al cargar la página
        function displayCart() {
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = storedCart;
            updateCart();
        }

        // Función para buscar productos
        function searchProduct() {
            const searchInput = document.getElementById('searchInput');
            const searchTerm = searchInput.value.toLowerCase();

            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm)
            );

            displayProducts(filteredProducts);
        }

        // Función para listar los productos en el carrito
        function listCartItems() {
            alert("Productos en el carrito:\n\n" + cart.map(product => product.name).join("\n"));
        }

        // Función para vaciar el carrito
        function clearCart() {
            cart = [];
            updateCart();
        }

        // Función para quitar un producto del carrito
        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCart();
        }

// Botón comprar
botonComprar.addEventListener("click", (event) => {
    event.preventDefault();

    Swal.fire({
        title: "¿Seguro que desea comprar los productos?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, seguro",
        cancelButtonText: "No, no quiero",
    }).then((result) => {
        if (result.isConfirmed) {
            clearCart();
            Swal.fire({
                title: "¡Compra realizada!",
                icon: "success",
                text: "Su compra fue realizada con éxito.",
                timer: 1500,
            });
        }
    });
});