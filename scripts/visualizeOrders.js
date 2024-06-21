
// Step 1: Fetch Orders
async function fetchOrders() {
    const ordersUrl = 'http://40.121.143.184:5000/pedidos';
    const ordersdetailUrl = 'http://40.121.143.184:5000/detalle_pedidos';
    const productsUrl = 'http://40.121.143.184:5000/productos';
    const clientsUrl = 'http://40.121.143.184:5000/clientes';
    const deliveryMenUrl = 'http://40.121.143.184:5000/repartidores';
    const usersUrl = 'http://40.121.143.184:5000/usuarios';

    try {
        const [ordersResponse, ordersdetailResponse, productsResponse, clientsResponse, deliveryMenResponse, usersResponse] = await Promise.all([
            fetch(ordersUrl),
            fetch(ordersdetailUrl),
            fetch(productsUrl),
            fetch(clientsUrl),
            fetch(deliveryMenUrl),
            fetch(usersUrl)
        ]);

        let orders = await ordersResponse.json();
        let ordersdetail = await ordersdetailResponse.json();
        let details = [];
        const products = await productsResponse.json();
        const clients = await clientsResponse.json();
        const deliveryMen = await deliveryMenResponse.json();
        const users = await usersResponse.json();

        // Step 2: Filter with Client ID (from localStorage)
        if(!localStorage.getItem('userInfo')) {
            generatePage([], [], products);
            return;
        }

        const userId = JSON.parse(localStorage.getItem('userInfo')).id;
        const clientId = clients.find(client => client.id_usuario === userId).id;
        orders = orders.filter(order => order.id_cliente === clientId);
        orders.forEach(order => {
            details = details.concat(ordersdetail.filter(detail => detail.id_pedido === order.id));
        });

        // Step 3: Generate HTML Page
        generatePage(orders, details, products, deliveryMen, users);
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function generatePage(orders, details, products, deliveryMen, users) {
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
        let deliveryMan = deliveryMen.find(delivery => delivery.id === order.id_repartidor);
        let deliveryUsername = users.find(user => user.id === deliveryMan.id_usuario).nombre;
        const orderSection = document.createElement('section');
        orderSection.innerHTML = `<h2>Pedido #${order.id}</h2>
        <p>Fecha: ${formattedDate}</p>
        <p>Dirección de entrega: ${order.direccion_entrega}</p>
        <p>Estado: ${order.estado}</p>
        <p>Repartidor: ${deliveryUsername}</p>`;


        const cardsWrapper = document.createElement('div');
        cardsWrapper.className = 'cards';
        let totalPrice = 0;

        // diplay list of products of the order
        details.forEach(detail => {
            if (order.id === detail.id_pedido) {
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

        // Add click event to chat button
        chatButton.addEventListener('click', function() {
            // Save repartidor info to localStorage
            localStorage.setItem('repartidorInfo', JSON.stringify({ nombre: deliveryUsername }));
            localStorage.setItem('pedidoId', order.id);
            // Redirect to chat.html
            window.location.href = 'chat.html';
        });

        cardsWrapper.appendChild(chatButton);

        orderSection.appendChild(cardsWrapper);
        mainElement.appendChild(orderSection);
    });
}

fetchOrders();