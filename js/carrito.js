const CLAVE_CARRITO = "carrito_computienda";

// Simula el proceso de pago
function pagar() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        alert("🛒 Tu carrito está vacío. Agrega productos antes de pagar.");
        return;
    }

    const total = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const confirmar = confirm(
        `¿Confirmar pago de $${total.toLocaleString('es-CL')}?\n\n` +
        `Productos: ${carrito.length}\n` +
        `Total: $${total.toLocaleString('es-CL')}`
    );

    if (confirmar) {
        alert("✅ ¡Pago realizado con éxito! Gracias por tu compra.");
        localStorage.removeItem(CLAVE_CARRITO);
        renderizarCarrito();
        actualizarContadorCarrito();
    }
}

// Aplica un cupón de descuento (ejemplo simple)
function aplicarCupon() {
    const cupon = document.getElementById("cupon").value.trim().toUpperCase();
    const mensaje = document.getElementById("mensaje-cupon");

    const CUPONES_VALIDOS = {
        "TECH10": 0.10,
        "COMPU20": 0.20,
        "BIENVENIDO": 0.05
    };

    if (CUPONES_VALIDOS[cupon]) {
        const descuento = CUPONES_VALIDOS[cupon] * 100;
        mensaje.textContent = `✅ Cupón aplicado: ${descuento}% de descuento`;
        mensaje.style.color = "var(--color-exito)";
        // Aquí podrías guardar el descuento en localStorage para aplicarlo al total
    } else {
        mensaje.textContent = "❌ Cupón no válido";
        mensaje.style.color = "var(--color-error)";
    }
}


/* LOL */
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function agregarAlCarrito(idProducto, cantidad = 1) {
    const carrito = obtenerCarrito();
    const producto = PRODUCTOS.find(p => p.id === idProducto);
    if (!producto) return;

    const existe = carrito.find(i => i.id === idProducto);
    if (existe) existe.cantidad += cantidad;
    else carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad
    });

    guardarCarrito(carrito);
    alert(`✅ ${producto.nombre} agregado al carrito`);
}

function eliminarDelCarrito(id) {
    const carrito = obtenerCarrito().filter(i => i.id !== id);
    guardarCarrito(carrito);
    renderizarCarrito();
}

function cambiarCantidad(id, cantidad) {
    const carrito = obtenerCarrito();
    const item = carrito.find(p => p.id === id);
    if (!item) return;
    item.cantidad = parseInt(cantidad);
    if (item.cantidad <= 0) return eliminarDelCarrito(id);
    guardarCarrito(carrito);
    renderizarCarrito();
}

function actualizarContadorCarrito() {
    const contador = document.getElementById("contador-carrito");
    if (contador) {
        const total = obtenerCarrito().reduce((s, i) => s + i.cantidad, 0);
        contador.textContent = total;
    }
}

function renderizarCarrito() {
    const tabla = document.getElementById("lista-carrito");
    if (!tabla) return;

    const carrito = obtenerCarrito();
    tabla.innerHTML = "";

    if (carrito.length === 0) {
        tabla.innerHTML = "<tr><td colspan='6' style='text-align:center;padding:2rem;'>Tu carrito está vacío 🛒</td></tr>";
        document.getElementById("total-carrito").textContent = "$0";
        return;
    }

    let total = 0;
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td><img src="${item.imagen}" alt="${item.nombre}" style="width:60px;border-radius:5px;"></td>
            <td>${item.nombre}</td>
            <td>$${item.precio.toLocaleString('es-CL')}</td>
            <td><input type="number" min="1" value="${item.cantidad}"
                onchange="cambiarCantidad(${item.id}, this.value)"></td>
            <td>$${subtotal.toLocaleString('es-CL')}</td>
            <td><button class="btn-accion" onclick="eliminarDelCarrito(${item.id})">❌</button></td>
        `;
        tabla.appendChild(fila);
    });

    document.getElementById("total-carrito").textContent = `$${total.toLocaleString('es-CL')}`;
}

function vaciarCarrito() {
    if (confirm("¿Seguro que quieres vaciar el carrito?")) {
        localStorage.removeItem(CLAVE_CARRITO);
        renderizarCarrito();
        actualizarContadorCarrito();
    }
}

document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);