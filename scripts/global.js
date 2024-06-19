function checkUserStatus() {
    var user = localStorage.getItem('userInfo');
    var welcomeMessage = document.getElementById('welcome');
    var authButton = document.getElementById('authButton');
    if (user) {
        // Mostrar mensaje de bienvenida
        var userInfo = JSON.parse(user);
        welcomeMessage.textContent = '¡Bienvenid@, ' + userInfo.nombre + '!';
        // Si un usuario inició sesión, mostrar botón de cerrar sesión
        authButton.textContent = 'Cerrar Sesión';
        authButton.onclick = function() {
            localStorage.removeItem('userInfo');
            window.location.href = 'index.html';
        };
    } else {
        // Si no hay información de usuario, mostrar botón de iniciar sesión
        authButton.textContent = 'Iniciar Sesión';
        authButton.onclick = function() {
            // Aquí se agrega la lógica para iniciar sesión
            window.location.href = 'login.html';
        };
    }

}

document.addEventListener('DOMContentLoaded', checkUserStatus);