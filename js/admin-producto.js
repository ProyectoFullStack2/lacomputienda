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

    form.addEventListener("submit", async (e) => {
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

        // 1. Código
        const valCodigo = inputCodigo.value.trim().toUpperCase();
        if (!valCodigo) {
            errorCodigo.textContent = "El código del producto es obligatorio.";
            esValido = false;
        } else if (valCodigo.length < 3) {
            errorCodigo.textContent = "El código debe tener al menos 3 caracteres.";
            esValido = false;
        }

        // 2. Nombre
        const valNombre = inputNombre.value.trim();
        if (!valNombre) {
            errorNombre.textContent = "El nombre del producto es obligatorio.";
            esValido = false;
        } else if (valNombre.length > 100) {
            errorNombre.textContent = "El nombre no puede superar los 100 caracteres.";
            esValido = false;
        }

        // 3. Descripción
        const valDescripcion = inputDescripcion.value.trim();
        if (valDescripcion.length > 500) {
            errorDescripcion.textContent = "La descripción no puede superar los 500 caracteres.";
            esValido = false;
        }

        // 4. Precio
        const valPrecioRaw = inputPrecio.value.trim();
        const valPrecio = parseFloat(valPrecioRaw);
        if (valPrecioRaw === "" || isNaN(valPrecio)) {
            errorPrecio.textContent = "El precio es obligatorio.";
            esValido = false;
        } else if (valPrecio < 0) {
            errorPrecio.textContent = "El precio no puede ser negativo.";
            esValido = false;
        }

        // 5. Stock
        const valStockRaw = inputStock.value.trim();
        const valStock = Number(valStockRaw);
        if (valStockRaw === "" || isNaN(valStock)) {
            errorStock.textContent = "El stock es obligatorio.";
            esValido = false;
        } else if (!Number.isInteger(valStock) || valStock < 0) {
            errorStock.textContent = "El stock debe ser un número entero mayor o igual a 0.";
            esValido = false;
        }

        // 6. Stock Crítico
        const valCriticoRaw = inputStockCritico.value.trim();
        let valCritico = null;
        if (valCriticoRaw !== "") {
            valCritico = Number(valCriticoRaw);
            if (isNaN(valCritico) || !Number.isInteger(valCritico) || valCritico < 0) {
                errorStockCritico.textContent = "El stock crítico debe ser un número entero mayor o igual a 0.";
                esValido = false;
            }
        }

        // 7. Categoría
        if (!selectCategoria.value) {
            errorCategoria.textContent = "Debe seleccionar una categoría.";
            esValido = false;
        }

        // Si es válido, guardar en Supabase
        if (esValido) {
            const nuevoProducto = {
                codigo: valCodigo,
                nombre: valNombre,
                categoria: selectCategoria.value,
                precio: Math.round(valPrecio),
                stock: valStock,
                stock_critico: valCritico !== null ? valCritico : 5
            };

            try {
                const { error } = await window.db
                    .from("productos")
                    .insert([nuevoProducto]);

                if (error) {
                    if (error.code === "23505") {
                        errorCodigo.textContent = "Ya existe un producto registrado con este código.";
                    } else {
                        alert("Error al guardar en la base de datos: " + error.message);
                    }
                    return;
                }

                let avisoCritico = "";
                if (valCritico !== null && valStock <= valCritico) {
                    avisoCritico = " ⚠️ Atención: El stock ingresado está en nivel crítico.";
                }

                mensajeExito.textContent = `✅ ¡Producto "${valNombre}" guardado en la base de datos!${avisoCritico}`;
                mensajeExito.style.display = "block";

                form.reset();

            } catch (err) {
                console.error("Error inesperado:", err);
                alert("Ocurrió un error al intentar conectar con la base de datos.");
            }
        }
    });
});