const usersUrl = 'http://localhost:3000/usuarios';

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch(usersUrl)
    .then(response => response.json())
    .then(users => {
        const user = users.find(user => user.correo === email && user.contrasena === password);
        if (user) {
            // Almacenar la información del usuario en Local Storage, excluyendo la contraseña
            const { contrasena, ...userWithoutPassword } = user;
            localStorage.setItem('userInfo', JSON.stringify(userWithoutPassword));
            // Redirigir al usuario a otra página después del inicio de sesión
            window.location.href = 'index.html';
        } else {
            alert('Inicio de sesión fallido. Por favor, verifica tus credenciales.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});