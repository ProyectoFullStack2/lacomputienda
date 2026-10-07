document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.querySelector(".formulario-registro");

    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const correoConf = document.getElementById("correo-conf").value.trim();
        const password = document.getElementById("password").value;
        const passwordConf = document.getElementById("password-conf").value;
        const telefono = document.getElementById("telefono") ? document.getElementById("telefono").value.trim() : "";
        const region = document.getElementById("region") ? document.getElementById("region").value : "";
        const comuna = document.getElementById("comuna") ? document.getElementById("comuna").value : "";

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

        // --- GUARDAR EN SUPABASE ---
        try {
            // Reemplaza 'usuarios' por el nombre exacto de tu tabla en Supabase
            const { data, error } = await window.db
                .from('usuarios') 
                .insert([
                    { 
                        nombre: nombre, 
                        correo: correo, 
                        password: password,
                        telefono: telefono,
                        region: region,
                        comuna: comuna
                    }
                ]);

            if (error) {
                console.error("Error de Supabase:", error);
                alert("Hubo un error al registrar: " + error.message);
                return;
            }

            alert("¡Registro exitoso y guardado!");
            formulario.reset();

        } catch (err) {
            console.error("Error inesperado:", err);
            alert("Ocurrió un error inesperado.");
        }
    });
});