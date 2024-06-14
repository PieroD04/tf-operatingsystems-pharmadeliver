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

    function createOrder() {
        const direccionEntrega = prompt("Por favor, ingresa tu dirección de entrega:");
        if (direccionEntrega) {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const pedido = {
                estado: "Pendiente",
                direccion_entrega: direccionEntrega,
                fecha_pedido: new Date().toISOString(),
                id_cliente: userInfo.id,
                id_repartidor: 1 // Asumimos el id del repartidor
            };

            fetch('http://localhost:3000/pedidos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pedido),
            })
            .then(response => response.json())
            .then(data => {
                const carrito = JSON.parse(localStorage.getItem('cart') || '[]');
                console.log()
                carrito.forEach(producto => {
                    const detallePedido = {
                        id_producto: producto.id,
                        id_pedido: data.id, // Asumiendo que el backend devuelve el id del pedido creado
                        cantidad: producto.cantidad,
                        precio_unitario: producto.precio
                    };

                    fetch('http://localhost:3000/detalle_pedidos', {
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