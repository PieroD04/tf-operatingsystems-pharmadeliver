const usersURL = 'http://40.121.143.184:5000/usuarios';
const clientsURL = 'http://40.121.143.184:5000/clientes';

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const dni = document.getElementById('dni').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // validacion DNI solo debe tener numeros y debe ser de 8 digitos
    if (dni.length != 8 || isNaN(dni)) {
        alert('El DNI debe tener 8 digitos y solo debe contener numeros.');
        return;
    }

    // validacion Contraseña debe ser de al menos 8 caracteres
    if (password.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres.');
        return;
    }

    const user = {
        nombre: name,
        correo: email,
        dni: dni,
        contrasena: password,
        telefono: phone
    };

    fetch(usersURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
        const cliente = {
            id_usuario: data.id // Asumiendo que el backend devuelve el id del usuario creado
        };
        fetch(clientsURL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(cliente),
                    })
        // REDIRECCIONAR A LOGIN
        window.location.href = 'login.html';
        alert('Usuario registrado exitosamente. Pasa a iniciar sesión.')
        }
    )
    .catch((error) => {
        console.error('Error:', error)
    })

})