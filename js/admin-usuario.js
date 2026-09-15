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
                form.reset();
                selectComuna.innerHTML = '<option value="">-- Seleccione Comuna --</option>';
            }
        });
    }
});