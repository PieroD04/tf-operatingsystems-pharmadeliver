import cartInstance from "./cart.js";

// Step 1: Fetch Categories and Products
async function fetchCategoriesAndProducts() {
    const categoriesUrl = 'http://40.121.143.184:5000/categorias';
    const productsUrl = 'http://40.121.143.184:5000/productos';
    const pharmaciesUrl = 'http://40.121.143.184:5000/farmacias';

    try {
        const [categoriesResponse, productsResponse, pharmaciesResponse] = await Promise.all([
            fetch(categoriesUrl),
            fetch(productsUrl),
            fetch(pharmaciesUrl)
        ]);

        const categories = await categoriesResponse.json();
        const products = await productsResponse.json();
        const pharmacies = await pharmaciesResponse.json();

        // Step 2: Organize Products by Category
        const productsByCategory = products.reduce((acc, product) => {
            acc[product.id_categoria] = acc[product.id_categoria] || [];
            acc[product.id_categoria].push(product);
            return acc;
        }, {});

        // Step 3: Generate HTML
        generateHTML(categories, productsByCategory, pharmacies);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function generateHTML(categories, productsByCategory, pharmacies) {
    const mainElement = document.querySelector('catalogo');
    mainElement.innerHTML = '';

    categories.forEach(category => {
        const categorySection = document.createElement('section');
        categorySection.innerHTML = `<h2>${category.nombre}</h2>`;

        const cardsWrapper = document.createElement('div');
        cardsWrapper.className = 'cards';

        (productsByCategory[category.id] || []).forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'card';
            productCard.innerHTML = `
                <h3>${product.nombre}</h3>
                <p>${product.descripcion}</p>
                <p>Farmacia: ${pharmacies.find(pharmacy => pharmacy.id === product.id_farmacia).nombre}</p>
                <p>Precio: S/.${product.precio}</p>
                <img src="${product.imagen}" alt="${product.nombre}">
                <div class="cart">
                    <input type="number" value="1" class="quantity-input">
                    <button class="add-to-cart">Añadir al carrito</button>
                </div>
            `;

            cardsWrapper.appendChild(productCard);

            // Event handlers for increase and decrease buttons
            const quantityInput = productCard.querySelector('.quantity-input');
            const addToCartButton = productCard.querySelector('.add-to-cart');

            quantityInput.addEventListener('change', () => {
                if (quantityInput.value < 1) {
                    quantityInput.value = 1;
                }
            });

            addToCartButton.addEventListener('click', () => {
                const quantity = parseInt(quantityInput.value, 10); // Asegúrate de que la cantidad sea un número entero
                const productToAdd = {
                    id: product.id, // Asegúrate de que 'product' tenga un 'id' único
                    id_categoria: product.id_categoria,
                    id_farmacia: product.id_farmacia,
                    nombre: product.nombre,
                    descripcion: product.descripcion,
                    precio: product.precio,
                    imagen: product.imagen,
                    quantity: quantity // Usa la cantidad obtenida del input
                };
            
                cartInstance.addToCart(productToAdd); // Añade el producto al carrito
                alert('Producto añadido al carrito');
            });
        });
        

        categorySection.appendChild(cardsWrapper);
        mainElement.appendChild(categorySection);
    });
}

// Call the function to fetch data and generate HTML
fetchCategoriesAndProducts();