document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.querySelector("form");

    if (formulario) {
        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const correoInput = document.getElementById("correo");
            const passwordInput = document.getElementById("password");

            if (!correoInput || !passwordInput) return;

            const correo = correoInput.value.trim();
            const password = passwordInput.value;

            if (correo === "") {
                alert("El correo es requerido.");
                return;
            }
            if (correo.length > 100) {
                alert("El correo no puede superar los 100 caracteres.");
                return;
            }

            const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
            const esDominioValido = dominiosPermitidos.some(dominio => correo.endsWith(dominio));

            if (!esDominioValido) {
                alert("Solo se permiten correos con @duoc.cl, @profesor.duoc.cl y @gmail.com");
                return;
            }

            if (password === "") {
                alert("La contraseña es requerida.");
                return;
            }
            if (password.length < 4 || password.length > 10) {
                alert("La contraseña debe tener entre 4 y 10 caracteres.");
                return;
            }

            if (correo === "admin@gmail.com" && password === "ADMIN12D") {
                alert("¡Bienvenido, Administrador!");
                window.location.href = "admin-home.html";
                return;
            }

            alert("¡Inicio de sesión exitoso!");
        });
    }
});