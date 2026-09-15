document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formNuevoProducto");

    const inputCodigo = document.getElementById("codigoProducto");
    const inputNombre = document.getElementById("nombreProducto");
    const inputDescripcion = document.getElementById("descripcionProducto");
    const inputPrecio = document.getElementById("precioProducto");
    const inputStock = document.getElementById("stockProducto");
    const inputStockCritico = document.getElementById("stockCriticoProducto");
    const selectCategoria = document.getElementById("categoriaProducto");

    const errorCodigo = document.getElementById("errorCodigo");
    const errorNombre = document.getElementById("errorNombre");
    const errorDescripcion = document.getElementById("errorDescripcion");
    const errorPrecio = document.getElementById("errorPrecio");
    const errorStock = document.getElementById("errorStock");
    const errorStockCritico = document.getElementById("errorStockCritico");
    const errorCategoria = document.getElementById("errorCategoria");
    const mensajeExito = document.getElementById("mensajeExito");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let esValido = true;

        // Limpiar errores previos
        errorCodigo.textContent = "";
        errorNombre.textContent = "";
        errorDescripcion.textContent = "";
        errorPrecio.textContent = "";
        errorStock.textContent = "";
        errorStockCritico.textContent = "";
        errorCategoria.textContent = "";
        mensajeExito.style.display = "none";

        // 1. Código: Requerido, texto, min 3 caracteres
        const valCodigo = inputCodigo.value.trim();
        if (!valCodigo) {
            errorCodigo.textContent = "El código del producto es obligatorio.";
            esValido = false;
        } else if (valCodigo.length < 3) {
            errorCodigo.textContent = "El código debe tener al menos 3 caracteres.";
            esValido = false;
        }

        // 2. Nombre: Requerido, max 100 caracteres
        const valNombre = inputNombre.value.trim();
        if (!valNombre) {
            errorNombre.textContent = "El nombre del producto es obligatorio.";
            esValido = false;
        } else if (valNombre.length > 100) {
            errorNombre.textContent = "El nombre no puede superar los 100 caracteres.";
            esValido = false;
        }

        // 3. Descripción: Opcional, max 500 caracteres
        const valDescripcion = inputDescripcion.value.trim();
        if (valDescripcion.length > 500) {
            errorDescripcion.textContent = "La descripción no puede superar los 500 caracteres.";
            esValido = false;
        }

        // 4. Precio: Requerido, min 0, puede tener decimales
        const valPrecioRaw = inputPrecio.value.trim();
        const valPrecio = parseFloat(valPrecioRaw);
        if (valPrecioRaw === "" || isNaN(valPrecio)) {
            errorPrecio.textContent = "El precio es obligatorio.";
            esValido = false;
        } else if (valPrecio < 0) {
            errorPrecio.textContent = "El precio no puede ser negativo.";
            esValido = false;
        }

        // 5. Stock: Requerido, entero, min 0
        const valStockRaw = inputStock.value.trim();
        const valStock = Number(valStockRaw);
        if (valStockRaw === "" || isNaN(valStock)) {
            errorStock.textContent = "El stock es obligatorio.";
            esValido = false;
        } else if (!Number.isInteger(valStock) || valStock < 0) {
            errorStock.textContent = "El stock debe ser un número entero mayor o igual a 0.";
            esValido = false;
        }

        // 6. Stock Crítico: Opcional, entero, min 0
        const valCriticoRaw = inputStockCritico.value.trim();
        let valCritico = null;
        if (valCriticoRaw !== "") {
            valCritico = Number(valCriticoRaw);
            if (isNaN(valCritico) || !Number.isInteger(valCritico) || valCritico < 0) {
                errorStockCritico.textContent = "El stock crítico debe ser un número entero mayor o igual a 0.";
                esValido = false;
            }
        }

        // 7. Categoría: Requerido
        if (!selectCategoria.value) {
            errorCategoria.textContent = "Debe seleccionar una categoría.";
            esValido = false;
        }

        // Si pasa todas las validaciones
        if (esValido) {
            let avisoCritico = "";
            if (valCritico !== null && valStock <= valCritico) {
                avisoCritico = " ⚠️ Atención: El stock ingresado está en nivel crítico.";
            }

            mensajeExito.textContent = `✅ ¡Producto "${valNombre}" guardado exitosamente!${avisoCritico}`;
            mensajeExito.style.display = "block";
            form.reset();
        }
    });
});