document.addEventListener("DOMContentLoaded", function () {

    var formularioRegistro = document.getElementById("formularioRegistro");

    formularioRegistro.addEventListener("submit", function (e) {
        e.preventDefault();

        var nombre = document.getElementById("regNombre").value.trim();
        var email = document.getElementById("regEmail").value.trim();
        var password = document.getElementById("regPassword").value.trim();
        var mascota = document.getElementById("regMascota").value;

        var errorNombre = document.getElementById("errorNombre");
        var errorEmail = document.getElementById("errorEmail");
        var errorPassword = document.getElementById("errorPassword");
        var errorMascota = document.getElementById("errorMascota");
        var resultadoRegistro = document.getElementById("resultadoRegistro");

        errorNombre.textContent = "";
        errorEmail.textContent = "";
        errorPassword.textContent = "";
        errorMascota.textContent = "";
        resultadoRegistro.textContent = "";

        var esValido = true;

        if (nombre === "") {
            errorNombre.textContent = "El nombre no puede quedar vacio.";
            esValido = false;
        } else if (nombre.length < 3) {
            errorNombre.textContent = "El nombre debe tener al menos 3 caracteres.";
            esValido = false;
        }

        var regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === "") {
            errorEmail.textContent = "El correo electronico es requerido.";
            esValido = false;
        } else if (!regexCorreo.test(email)) {
            errorEmail.textContent = "Ingrese un formato de correo valido.";
            esValido = false;
        }

        if (password === "") {
            errorPassword.textContent = "La contrasena es obligatoria.";
            esValido = false;
        } else if (password.length < 6) {
            errorPassword.textContent = "La contrasena debe contener al menos 6 caracteres.";
            esValido = false;
        }

        if (mascota === "") {
            errorMascota.textContent = "Seleccione una opcion de mascota.";
            esValido = false;
        }

        if (esValido) {
            resultadoRegistro.textContent = "Registro completado con exito en La casa de tu mascota.";
            formularioRegistro.reset();
        }
    });

    var formularioLogin = document.getElementById("formularioLogin");

    formularioLogin.addEventListener("submit", function (e) {
        e.preventDefault();

        var email = document.getElementById("loginEmail").value.trim();
        var password = document.getElementById("loginPassword").value.trim();

        var errorEmail = document.getElementById("errorLoginEmail");
        var errorPassword = document.getElementById("errorLoginPassword");
        var resultadoLogin = document.getElementById("resultadoLogin");

        errorEmail.textContent = "";
        errorPassword.textContent = "";
        resultadoLogin.textContent = "";

        var esValido = true;

        if (email === "") {
            errorEmail.textContent = "Debe ingresar su correo electronico.";
            esValido = false;
        }

        if (password === "") {
            errorPassword.textContent = "Debe ingresar su contrasena.";
            esValido = false;
        }

        if (esValido) {
            resultadoLogin.textContent = "Inicio de sesion correcto.";
            formularioLogin.reset();
        }
    });

});