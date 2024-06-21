const ordersUrl = 'http://40.121.143.184:5000/pedidos';
const orderDetailsUrl = 'http://40.121.143.184:5000/detalle_pedidos';
const clientsUrl = 'http://40.121.143.184:5000/clientes';
const deliveryMenUrl = 'http://40.121.143.184:5000/repartidores';


document.addEventListener('DOMContentLoaded', function() {
    const orderButtonElement = document.querySelector('orderbutton');

    if (orderButtonElement) {
        const orderButton = document.createElement('button');
        orderButton.textContent = isLogued() ? 'Crear Pedido' : 'Iniciar Sesión';
        orderButtonElement.appendChild(orderButton);

        orderButton.addEventListener('click', function() {
            if (!isLogued()) {
                window.location.href = 'login.html';
            } else {
                createOrder();
            }
        });
    }

    function isLogued() {
        return localStorage.getItem('userInfo') !== null;
    }

    async function createOrder() {
        if(!localStorage.getItem('cart')) {
            alert('No hay productos en el carrito.');
            return;
        }

        const direccionEntrega = prompt("Por favor, ingresa tu dirección de entrega:");
        if (direccionEntrega) {
            const clientsResponse = await fetch(clientsUrl);
            const clients = await clientsResponse.json();
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const clientId = clients.find(client => client.id_usuario === userInfo.id).id;
            

            const deliveryMenResponse = await fetch(deliveryMenUrl);
            const deliveryMen = await deliveryMenResponse.json();
            const deliveryMan = deliveryMen[Math.floor(Math.random() * deliveryMen.length)];
            const deliveryManId = deliveryMan.id;

            const pedido = {
                estado: "Pendiente",
                direccion_entrega: direccionEntrega,
                fecha_pedido: formatToDatabaseDate(new Date().toISOString()),
                id_cliente: clientId,
                id_repartidor: deliveryManId // Asumimos el id del repartidor
            };

            fetch(ordersUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pedido),
            })
            .then(response => response.json())
            .then(data => {
                const carrito = JSON.parse(localStorage.getItem('cart') || '[]');
                carrito.forEach(producto => {
                    const detallePedido = {
                        id_producto: producto.id,
                        id_pedido: data.pedido.id, 
                        cantidad: producto.quantity,
                        precio_unitario: producto.precio
                    };

                    fetch(orderDetailsUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(detallePedido),
                    })
                    .then(response => response.json())
                    .then(data => console.log("Detalle de pedido creado", data))
                    .catch(error => console.error('Error al crear detalle de pedido:', error));
                });

                alert('Pedido creado con éxito');
                localStorage.removeItem('cart'); // Limpiar el carrito
                
            })
            .catch(error => console.error('Error al crear pedido:', error));
        } else {
            alert("Debes proporcionar una dirección de entrega para continuar.");
        }
    }
});

function formatToDatabaseDate(isoString) {
    return isoString.replace('T', ' ').substring(0, 19); // Converts to 'YYYY-MM-DD HH:mm:ss'
}
