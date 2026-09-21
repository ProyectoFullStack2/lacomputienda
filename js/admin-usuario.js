document.addEventListener("DOMContentLoaded", () => {
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

    // Dataset simulado de Regiones y Comunas de Chile
    const comunasPorRegion = {
        "Metropolitana": ["Santiago", "Maipú", "La Florida", "Puente Alto", "San Joaquín", "Providencia"],
        "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón"],
        "Biobío": ["Concepción", "Talcahuano", "Chillán (ex Región)", "Los Ángeles", "San Pedro de la Paz"]
    };

    // Dinámica de carga de comunas según región seleccionada
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

    if (form) {
        form.addEventListener("submit", (e) => {
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

            // 1. Validación de RUN (Sin puntos ni guion, 7 a 9 caracteres)
            const valRun = inputRun.value.trim().toUpperCase();
            const regexRun = /^[0-9]{6,8}[0-9K]$/;
            if (!valRun) {
                errorRun.textContent = "El RUN es obligatorio.";
                esValido = false;
            } else if (!regexRun.test(valRun)) {
                errorRun.textContent = "Formato inválido. Sin puntos ni guion, ej: 19011022K (7 a 9 car.).";
                esValido = false;
            }

            // 2. Nombre: Requerido, máx 50 caracteres
            const valNombre = inputNombre.value.trim();
            if (!valNombre) {
                errorNombre.textContent = "El nombre es obligatorio.";
                esValido = false;
            } else if (valNombre.length > 50) {
                errorNombre.textContent = "El nombre no puede superar los 50 caracteres.";
                esValido = false;
            }

            // 3. Apellidos: Requerido, máx 100 caracteres
            const valApellidos = inputApellidos.value.trim();
            if (!valApellidos) {
                errorApellidos.textContent = "Los apellidos son obligatorios.";
                esValido = false;
            } else if (valApellidos.length > 100) {
                errorApellidos.textContent = "Los apellidos no pueden superar los 100 caracteres.";
                esValido = false;
            }

            // 4. Correo: Requerido, dominios permitidos
            const valCorreo = inputCorreo.value.trim().toLowerCase();
            const dominiosValidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
            const tieneDominioValido = dominiosValidos.some(dom => valCorreo.endsWith(dom));
            if (!valCorreo) {
                errorCorreo.textContent = "El correo es obligatorio.";
                esValido = false;
            } else if (!tieneDominioValido) {
                errorCorreo.textContent = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
                esValido = false;
            }

            // 5. Tipo de Usuario: Requerido
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

            // Éxito
            if (esValido) {
                mensajeExito.textContent = `✅ ¡Usuario "${valNombre} ${valApellidos}" registrado exitosamente con rol ${selectTipo.value}!`;
                mensajeExito.style.display = "block";

                /* ==========================================================================
                   PERSISTENCIA CLIENT-SIDE: REGISTRO DE CUENTA DE USUARIO
                   Estructura del objeto usuario:
                     - run       : Identificador nacional validado (valRun)
                     - nombre    : Nombres del usuario (valNombre)
                     - apellidos : Apellidos del usuario (valApellidos)
                     - correo    : Dirección electrónica institucional o autorizada (valCorreo)
                     - rol       : Perfil asignado desde el formulario (selectTipo.value)
                     - comuna    : Comuna seleccionada (selectComuna.value)
                   Almacenamiento: Array serializado en JSON bajo la clave 'usuarios' de localStorage
                   ========================================================================== */
                const nuevoUsuario = {
                    run: valRun,
                    nombre: valNombre,
                    apellidos: valApellidos,
                    correo: valCorreo,
                    rol: selectTipo.value,
                    comuna: selectComuna.value
                };

                const coleccionUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
                coleccionUsuarios.push(nuevoUsuario);
                localStorage.setItem("usuarios", JSON.stringify(coleccionUsuarios));

                form.reset();
                selectComuna.innerHTML = '<option value="">-- Seleccione Comuna --</option>';
            }
        });
    }

    /* ==========================================================================
       RENDERIZADO DE CUENTAS: TABLA ADMINISTRATIVA DE PERSONAL
       Responsabilidad:
         - Detección de la tabla administrativa en 'admin-usuarios.html'
         - Recuperación y deserialización del array 'usuarios' de localStorage
         - Construcción dinámica de filas <tr> con los datos y botones de acción
       ========================================================================== */
    const tablaCuerpoUsuarios = document.querySelector(".tabla-datos tbody");
    const esPaginaListaUsuarios = window.location.pathname.includes("admin-usuarios.html");

    if (tablaCuerpoUsuarios && esPaginaListaUsuarios) {
        const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

        usuariosGuardados.forEach((user) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td><strong>${user.run}</strong></td>
                <td>${user.nombre} ${user.apellidos}</td>
                <td>${user.correo}</td>
                <td><span class="badge-alerta" style="background:#dcfce7; color:#166534;">${user.rol}</span></td>
                <td>${user.comuna || "N/A"}</td>
                <td>
                    <button type="button" class="btn-tabla btn-editar">Editar</button>
                    <button type="button" class="btn-tabla btn-eliminar">Eliminar</button>
                </td>
            `;
            tablaCuerpoUsuarios.appendChild(fila);
        });
    }
});

/* ==========================================================================
       RENDERIZADO Y ELIMINACIÓN: TABLA ADMINISTRATIVA DE PERSONAL
       ========================================================================== */
    const tablaCuerpoUsuarios = document.querySelector(".tabla-datos tbody");
    const esPaginaListaUsuarios = window.location.pathname.includes("admin-usuarios.html");

    if (tablaCuerpoUsuarios && esPaginaListaUsuarios) {
        const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

        usuariosGuardados.forEach((user) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td><strong>${user.run}</strong></td>
                <td>${user.nombre} ${user.apellidos}</td>
                <td>${user.correo}</td>
                <td><span class="badge-alerta" style="background:#dcfce7; color:#166534;">${user.rol}</span></td>
                <td>${user.comuna || "N/A"}</td>
                <td>
                    <button type="button" class="btn-tabla btn-editar">Editar</button>
                    <button type="button" class="btn-tabla btn-eliminar" data-run="${user.run}">Eliminar</button>
                </td>
            `;
            tablaCuerpoUsuarios.appendChild(fila);
        });

        // Evento para eliminar usuario dinámico
        tablaCuerpoUsuarios.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-eliminar")) {
                const runAEliminar = e.target.getAttribute("data-run");

                if (runAEliminar && confirm(`¿Estás seguro de que deseas eliminar al usuario RUN ${runAEliminar}?`)) {
                    // Filtrar arreglo y actualizar localStorage
                    let lista = JSON.parse(localStorage.getItem("usuarios")) || [];
                    lista = lista.filter(u => u.run !== runAEliminar);
                    localStorage.setItem("usuarios", JSON.stringify(lista));

                    // Quitar fila del DOM
                    const fila = e.target.closest("tr");
                    if (fila) fila.remove();
                }
            }
        });
    }