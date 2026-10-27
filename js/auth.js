const CLAVE_ADMIN = "adminLogueado";

function obtenerAdminLogueado() {
    try {
        const guardado = localStorage.getItem(CLAVE_ADMIN);
        if (!guardado) return null;
        const usuario = JSON.parse(guardado);
        return usuario && usuario.rol === "Administrador" ? usuario : null;
    } catch (err) {
        return null;
    }
}


function protegerRutaAdministrador() {
    const admin = obtenerAdminLogueado();
    if (!admin) {
        alert("Acceso restringido: debes iniciar sesión como Administrador.");
        window.location.href = "login.html";
        return null;
    }
    return admin;
}

function cerrarSesionAdmin() {
    localStorage.removeItem(CLAVE_ADMIN);
    window.location.href = "login.html";
}


document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formLogin");
    if (!form) return;

    const errorMsg = document.getElementById("errorMsg");
    const mostrarError = (texto) => {
        if (errorMsg) {
            errorMsg.textContent = texto;
            errorMsg.style.display = "block";
        } else {
            alert(texto);
        }
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (errorMsg) errorMsg.style.display = "none";

        const correo = document.getElementById("correo").value.trim().toLowerCase();
        const clave = document.getElementById("clave").value;

        if (!correo || !clave) {
            mostrarError("Debes ingresar correo y contraseña.");
            return;
        }

        try {
            const { data, error } = await window.db
                .from("usuarios")
                .select("*")
                .eq("correo", correo)
                .single();

            if (error || !data) {
                mostrarError("Credenciales incorrectas.");
                return;
            }

            if (data.password !== clave) {
                mostrarError("Credenciales incorrectas.");
                return;
            }

            if (data.rol !== "Administrador") {
                mostrarError("Este usuario no tiene permisos de administrador.");
                return;
            }

            localStorage.setItem(CLAVE_ADMIN, JSON.stringify(data));
            window.location.href = "admin-home.html";
        } catch (err) {
            console.error("Error de autenticación:", err);
            mostrarError("Ocurrió un error al intentar iniciar sesión.");
        }
    });
});
