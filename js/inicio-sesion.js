document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.querySelector("form");

    if (formulario) {
        formulario.addEventListener("submit", async function (evento) {
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

            try {

                const { data, error } = await window.db
                    .from('usuarios')
                    .select('*')
                    .eq('correo', correo)
                    .single();

                if (error || !data) {
                    alert("El correo electrónico no está registrado.");
                    return;
                }

                if (data.password === password) {
                    alert(`¡Inicio de sesión exitoso! Bienvenido de nuevo, ${data.nombre}`);
                    
                    localStorage.setItem("usuarioLogueado", JSON.stringify(data));

                    window.location.href = "index.html";
                } else {
                    alert("Contraseña incorrecta.");
                }

            } catch (err) {
                console.error("Error al conectar con Supabase:", err);
                alert("Ocurrió un error inesperado al intentar iniciar sesión.");
            }
        });
    }
});