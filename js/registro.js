document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.querySelector(".formulario-registro");

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const correoConf = document.getElementById("correo-conf").value.trim();
        const password = document.getElementById("password").value;
        const passwordConf = document.getElementById("password-conf").value;

        if (nombre === "") {
            alert("El nombre completo es requerido.");
            return;
        }
        if (nombre.length > 100) {
            alert("El nombre no puede superar los 100 caracteres.");
            return;
        }

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

        if (correo !== correoConf) {
            alert("Los correos electrónicos no coinciden.");
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

        if (password !== passwordConf) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        alert("¡Registro exitoso!");
        formulario.submit();
    });
});