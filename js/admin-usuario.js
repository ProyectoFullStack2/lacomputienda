// ARCHIVO: js/admin-usuario.js
// OBJETIVO: Validación de rol de Administrador, guardado de usuarios en Supabase, listado dinámico y eliminación en PostgreSQL

// 1. Proteger ruta: solo accesible por Administrador logueado
const adminLogueado = protegerRutaAdministrador();

document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("formNuevoUsuario");

    const inputRun = document.getElementById("runUsuario");
    const inputNombre = document.getElementById("nombreUsuario");
    const inputApellidos = document.getElementById("apellidosUsuario");
    const inputCorreo = document.getElementById("correoUsuario");
    const selectTipo = document.getElementById("tipoUsuario");
    const selectRegion = document.getElementById("regionUsuario");
    const selectComuna = document.getElementById("comunaUsuario");
    const inputDireccion = document.getElementById("direccionUsuario");

    const errorRun = document.getElementById("errorRun");
    const errorNombre = document.getElementById("errorNombre");
    const errorApellidos = document.getElementById("errorApellidos");
    const errorCorreo = document.getElementById("errorCorreo");
    const errorTipo = document.getElementById("errorTipo");
    const errorRegion = document.getElementById("errorRegion");
    const errorComuna = document.getElementById("errorComuna");
    const mensajeExito = document.getElementById("mensajeExito");

    // Dataset de Regiones y Comunas de Chile
    const comunasPorRegion = {
        "Metropolitana": ["Santiago", "Maipú", "La Florida", "Puente Alto", "San Joaquín", "Providencia"],
        "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón"],
        "Biobío": ["Concepción", "Talcahuano", "Chillán (ex Región)", "Los Ángeles", "San Pedro de la Paz"]
    };

    // Dinámica select dependiente: Carga de comunas según región seleccionada
    if (selectRegion && selectComuna) {
        selectRegion.addEventListener("change", () => {
            const regionSeleccionada = selectRegion.value;
            selectComuna.innerHTML = '<option value="">-- Seleccione Comuna --</option>';

            if (comunasPorRegion[regionSeleccionada]) {
                comunasPorRegion[regionSeleccionada].forEach(comuna => {
                    const option = document.createElement("option");
                    option.value = comuna;
                    option.textContent = comuna;
                    selectComuna.appendChild(option);
                });
            }
        });
    }

    // ==========================================================================
    // SECCIÓN 1: FORMULARIO DE REGISTRO EN SUPABASE (admin-nuevo-usuario.html)
    // ==========================================================================
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            let esValido = true;

            // Limpiar alertas previas
            errorRun.textContent = "";
            errorNombre.textContent = "";
            errorApellidos.textContent = "";
            errorCorreo.textContent = "";
            errorTipo.textContent = "";
            errorRegion.textContent = "";
            errorComuna.textContent = "";
            mensajeExito.style.display = "none";

            // 1. RUN: 7 a 9 caracteres alfanuméricos
            const valRun = inputRun.value.trim().toUpperCase();
            const regexRun = /^[0-9]{6,8}[0-9K]$/;
            if (!valRun) {
                errorRun.textContent = "El RUN es obligatorio.";
                esValido = false;
            } else if (!regexRun.test(valRun)) {
                errorRun.textContent = "Formato inválido. Sin puntos ni guion, ej: 19011022K (7 a 9 car.).";
                esValido = false;
            }

            // 2. Nombre: Requerido, máx 50 car.
            const valNombre = inputNombre.value.trim();
            if (!valNombre) {
                errorNombre.textContent = "El nombre es obligatorio.";
                esValido = false;
            } else if (valNombre.length > 50) {
                errorNombre.textContent = "El nombre no puede superar los 50 caracteres.";
                esValido = false;
            }

            // 3. Apellidos: Requerido, máx 100 car.
            const valApellidos = inputApellidos.value.trim();
            if (!valApellidos) {
                errorApellidos.textContent = "Los apellidos son obligatorios.";
                esValido = false;
            } else if (valApellidos.length > 100) {
                errorApellidos.textContent = "Los apellidos no pueden superar los 100 caracteres.";
                esValido = false;
            }

            // 4. Correo: Dominios permitidos
            const valCorreo = inputCorreo.value.trim().toLowerCase();
            const dominiosValidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com", "@computienda.cl"];
            const tieneDominioValido = dominiosValidos.some(dom => valCorreo.endsWith(dom));
            if (!valCorreo) {
                errorCorreo.textContent = "El correo es obligatorio.";
                esValido = false;
            } else if (!tieneDominioValido) {
                errorCorreo.textContent = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl, @gmail.com o @computienda.cl.";
                esValido = false;
            }

            // 5. Tipo/Rol de Usuario
            if (!selectTipo.value) {
                errorTipo.textContent = "Debe seleccionar un perfil de usuario.";
                esValido = false;
            }

            // 6. Región y Comuna
            if (!selectRegion.value) {
                errorRegion.textContent = "Debe seleccionar una región.";
                esValido = false;
            }
            if (!selectComuna.value) {
                errorComuna.textContent = "Debe seleccionar una comuna.";
                esValido = false;
            }

            // Si es válido, guardar en la base de datos Supabase
            if (esValido) {
                const nuevoUsuario = {
                    run: valRun,
                    nombre: valNombre,
                    apellidos: valApellidos,
                    correo: valCorreo,
                    clave: "123456", // Contraseña inicial genérica para que el usuario pueda iniciar sesión
                    rol: selectTipo.value
                };

                try {
                    const { error } = await window.db
                        .from("usuarios")
                        .insert([nuevoUsuario]);

                    if (error) {
                        if (error.code === "23505") { // Clave única duplicada
                            errorCorreo.textContent = "Ya existe un usuario con este RUN o Correo.";
                        } else {
                            alert("Error al guardar en la base de datos: " + error.message);
                        }
                        return;
                    }

                    mensajeExito.textContent = `✅ ¡Usuario "${valNombre} ${valApellidos}" registrado exitosamente con rol ${selectTipo.value}!`;
                    mensajeExito.style.display = "block";

                    form.reset();
                    selectComuna.innerHTML = '<option value="">-- Seleccione Comuna --</option>';

                } catch (err) {
                    console.error("Error al registrar usuario:", err);
                    alert("Ocurrió un error al contactar la base de datos.");
                }
            }
        });
    }

    // ==========================================================================
    // SECCIÓN 2: RENDERIZADO Y ELIMINACIÓN EN TABLA (admin-usuarios.html)
    // ==========================================================================
    const tablaCuerpoUsuarios = document.querySelector(".tabla-datos tbody");
    const esPaginaListaUsuarios = window.location.pathname.includes("admin-usuarios.html");

    if (tablaCuerpoUsuarios && esPaginaListaUsuarios) {

        // Función para cargar los usuarios desde Supabase
        async function cargarUsuariosDesdeBD() {
            tablaCuerpoUsuarios.innerHTML = `<tr><td colspan="7" style="text-align:center;">Cargando usuarios desde PostgreSQL...</td></tr>`;

            try {
                const { data: usuarios, error } = await window.db
                    .from("usuarios")
                    .select("id, run, nombre, apellidos, correo, rol")
                    .order("id", { ascending: false });

                if (error) {
                    console.error("Error al obtener usuarios:", error);
                    tablaCuerpoUsuarios.innerHTML = `<tr><td colspan="7" style="text-align:center; color:red;">Error: ${error.message}</td></tr>`;
                    return;
                }

                tablaCuerpoUsuarios.innerHTML = "";

                if (!usuarios || usuarios.length === 0) {
                    tablaCuerpoUsuarios.innerHTML = `<tr><td colspan="7" style="text-align:center;">No hay usuarios registrados.</td></tr>`;
                    return;
                }

                usuarios.forEach((user) => {
                    const fila = document.createElement("tr");

                    // Color de badge según rol
                    let colorBadge = "background:#dcfce7; color:#166534;"; // Verde (Cliente)
                    if (user.rol === "Administrador") {
                        colorBadge = "background:#fee2e2; color:#991b1b;"; // Rojo
                    } else if (user.rol === "Vendedor") {
                        colorBadge = "background:#e0f2fe; color:#075985;"; // Azul
                    }

                    fila.innerHTML = `
                        <td><strong>${user.run}</strong></td>
                        <td>${user.nombre} ${user.apellidos || ""}</td>
                        <td>${user.correo}</td>
                        <td><span class="badge-alerta" style="${colorBadge}">${user.rol}</span></td>
                        <td>N/A</td>
                        <td>
                            <button type="button" class="btn-tabla btn-eliminar" data-run="${user.run}">Eliminar</button>
                        </td>
                    `;
                    tablaCuerpoUsuarios.appendChild(fila);
                });

            } catch (err) {
                console.error("Error de conexión:", err);
                tablaCuerpoUsuarios.innerHTML = `<tr><td colspan="7" style="text-align:center; color:red;">Error de conexión con el servidor.</td></tr>`;
            }
        }

        // Cargar usuarios al entrar a la página
        await cargarUsuariosDesdeBD();

        // Evento para eliminar usuario directamente en Supabase
        tablaCuerpoUsuarios.addEventListener("click", async (e) => {
            if (e.target.classList.contains("btn-eliminar")) {
                const runAEliminar = e.target.getAttribute("data-run");

                // Evitar que el admin principal se borre a sí mismo
                if (adminLogueado && adminLogueado.run === runAEliminar) {
                    alert("No puedes eliminar tu propia cuenta de Administrador activa.");
                    return;
                }

                if (runAEliminar && confirm(`¿Estás seguro de que deseas eliminar al usuario RUN ${runAEliminar}?`)) {
                    try {
                        const { error } = await window.db
                            .from("usuarios")
                            .delete()
                            .eq("run", runAEliminar);

                        if (error) {
                            alert("Error al eliminar el usuario de la base de datos: " + error.message);
                            return;
                        }

                        // Quitar fila del DOM
                        const fila = e.target.closest("tr");
                        if (fila) fila.remove();

                    } catch (err) {
                        console.error("Error al eliminar:", err);
                        alert("Ocurrió un error al intentar eliminar.");
                    }
                }
            }
        });
    }
});