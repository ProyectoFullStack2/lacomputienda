document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formularioContacto");
    const nombre = document.getElementById("nombreContacto");
    const correo = document.getElementById("correoContacto");
    const comentario = document.getElementById("comentarioContacto");
    const errorNombre = document.getElementById("errorNombre");
    const errorCorreo = document.getElementById("errorCorreo");
    const errorComentario = document.getElementById("errorComentario");
    const mensajeExito = document.getElementById("mensajeExito");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            let esValido = true;

            errorNombre.textContent = "";
            errorCorreo.textContent = "";
            errorComentario.textContent = "";
            mensajeExito.style.display = "none";

            const valNombre = nombre.value.trim();
            if (!valNombre) {
                errorNombre.textContent = "El nombre es obligatorio.";
                esValido = false;
            } else if (valNombre.length > 100) {
                errorNombre.textContent = "El nombre no puede exceder los 100 caracteres.";
                esValido = false;
            }

            const valCorreo = correo.value.trim().toLowerCase();
            const dominiosValidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
            const tieneDominioValido = dominiosValidos.some(dom => valCorreo.endsWith(dom));

            if (!valCorreo) {
                errorCorreo.textContent = "El correo es obligatorio.";
                esValido = false;
            } else if (valCorreo.length > 100) {
                errorCorreo.textContent = "El correo no puede exceder los 100 caracteres.";
                esValido = false;
            } else if (!tieneDominioValido) {
                errorCorreo.textContent = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
                esValido = false;
            }

            const valComentario = comentario.value.trim();
            if (!valComentario) {
                errorComentario.textContent = "El mensaje o comentario es obligatorio.";
                esValido = false;
            } else if (valComentario.length > 500) {
                errorComentario.textContent = "El comentario no puede exceder los 500 caracteres.";
                esValido = false;
            }

            if (esValido) {
                try {
                    const { data, error } = await window.db
                        .from('contactos')
                        .insert([
                            {
                                nombre: valNombre,
                                correo: valCorreo,
                                mensaje: valComentario
                            }
                        ]);

                    if (error) {
                        console.error("Error al guardar en Supabase:", error.message);
                        mensajeExito.textContent = "❌ Hubo un error al guardar el mensaje.";
                        mensajeExito.style.display = "block";
                    } else {
                        mensajeExito.textContent = "✓ ¡Mensaje enviado con éxito y guardado!";
                        mensajeExito.style.display = "block";
                        form.reset();
                    }
                } catch (err) {
                    console.error("Error de red o conexión:", err);
                    mensajeExito.textContent = "❌ Error de conexión con la base de datos.";
                    mensajeExito.style.display = "block";
                }
            }
        });
    }
});