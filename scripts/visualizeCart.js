document.addEventListener('DOMContentLoaded', () => {
    const shoppingCartElement = document.querySelector('shoppingcart');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
    }

    function renderCartItems() {
        shoppingCartElement.innerHTML = ''; // Limpiar el contenido actual
        let totalCost = 0;
    
        // Crear la tabla y el encabezado
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th></th>
            </tr>
        `;
        table.appendChild(thead);
    
        const tbody = document.createElement('tbody');
    
        cart.forEach((product, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${product.imagen}" alt="${product.nombre}"></td>
                <td>${product.nombre}</td>
                <td><input type="number" value="${product.quantity}" min="1" data-index="${index}" style="width: 60px;"></td>
                <td>S/.${product.precio}</td>
                <td><button data-index="${index}">Eliminar</button></td>
            `;
            tbody.appendChild(row);
    
            const quantityInput = row.querySelector('input[type="number"]');
            quantityInput.addEventListener('change', (e) => {
                const index = e.target.dataset.index;
                cart[index].quantity = parseInt(e.target.value);
                updateCart();
            });
    
            const deleteButton = row.querySelector('button');
            deleteButton.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                cart.splice(index, 1);
                updateCart();
            });
    
            totalCost += product.precio * product.quantity;
        });
    
        table.appendChild(tbody);
        shoppingCartElement.appendChild(table);
    
        // Mostrar el total
        const totalElement = document.createElement('total');
        totalElement.textContent = `Total: S/.${totalCost}`;
        shoppingCartElement.appendChild(totalElement);
    }

    // Inicializar la vista del carrito
    renderCartItems();
});