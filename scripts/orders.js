
// Step 1: Fetch Orders
async function fetchOrders() {
    const ordersUrl = 'http://localhost:3000/pedidos';
    const ordersdetailUrl = 'http://localhost:3000/detalle_pedidos';
    const productsUrl = 'http://localhost:3000/productos';
    const clientsUrl = 'http://localhost:3000/clientes';

    try {
        const [ordersResponse, ordersdetailResponse, productsResponse, clientsResponse] = await Promise.all([
            fetch(ordersUrl),
            fetch(ordersdetailUrl),
            fetch(productsUrl),
            fetch(clientsUrl)
        ]);

        let orders = await ordersResponse.json();
        let ordersdetail = await ordersdetailResponse.json();
        let details = [];
        const products = await productsResponse.json();
        const clients = await clientsResponse.json();

        // Step 2: Filter with Client ID (from localStorage)
        if(!localStorage.getItem('userInfo')) {
            generatePage([], [], products);
            return;
        }

        const userId = JSON.parse(localStorage.getItem('userInfo')).id;
        const clientId = clients.find(client => client.id_usuario === userId).id;
        orders = orders.filter(order => order.id_cliente === clientId);
        orders.forEach(order => {
            details = ordersdetail.filter(detail => detail.id_pedido === order.id);
        });

        // Step 3: Generate HTML Page
        generatePage(orders, details, products);
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function generatePage(orders, details, products) {
    // if there are no orders
    if (orders.length === 0) {
        const mainElement = document.querySelector('pedidos');
        mainElement.innerHTML = '<p>No se encontraron pedidos.</p>';
        return;
    }

    const mainElement = document.querySelector('pedidos');
    mainElement.innerHTML = '';

    orders.forEach(order => {
        let formattedDate = new Date(order.fecha_pedido).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        const orderSection = document.createElement('section');
        orderSection.innerHTML = `<h2>Pedido #${order.id}</h2>
        <p>Fecha: ${formattedDate}</p>
        <p>Dirección de entrega: ${order.direccion_entrega}</p>
        <p>Estado: ${order.estado}</p>`;


        const cardsWrapper = document.createElement('div');
        cardsWrapper.className = 'cards';
        let totalPrice = 0;

        // diplay in a list the products of the order
        details.forEach(detail => {
            const product = products.find(product => product.id === detail.id_producto);
            const productCard = document.createElement('div');
            productCard.innerHTML = `
                <h3>${product.nombre}</h3>
                <p>Cantidad: ${detail.cantidad}</p>
                <p>Precio unitario: S/.${product.precio}</p>
            `;
            totalPrice += detail.cantidad * product.precio;

            cardsWrapper.appendChild(productCard);
        }
        );

        // display the total price of the order and in color blue
        const total = document.createElement('div');
        total.innerHTML = `<h3>Total: S/.${totalPrice}</h3>`;
        total.style.color = '#007488';
        cardsWrapper.appendChild(total);

        // add a chat button
        const chatButton = document.createElement('button');
        chatButton.innerHTML = 'Chat';
        chatButton.className = 'chat-button';
        cardsWrapper.appendChild(chatButton);

        orderSection.appendChild(cardsWrapper);
        mainElement.appendChild(orderSection);
    });
}

fetchOrders();