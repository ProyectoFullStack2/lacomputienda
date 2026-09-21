// ===== Arreglo de productos: CompuTienda =====
const PRODUCTOS = [
    {
        id: 1,
        nombre: "Notebook HP Pavilion 15",
        precio: 649990,
        imagen: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
        descripcion: "Intel Core i5, 8GB RAM, 512GB SSD, pantalla 15.6\" Full HD.",
        categoria: "Notebooks",
        stock: 12
    },
    {
        id: 2,
        nombre: "PC Gamer Armada Ryzen 5",
        precio: 899990,
        imagen: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
        descripcion: "Ryzen 5 5600, RTX 3060, 16GB RAM, SSD 1TB, gabinete RGB.",
        categoria: "PC Gamer",
        stock: 7
    },
    {
        id: 3,
        nombre: "Monitor LG 24\" IPS",
        precio: 149990,
        imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
        descripcion: "Full HD 75Hz, panel IPS, HDMI y VGA, ideal para oficina.",
        categoria: "Monitores",
        stock: 25
    },
    {
        id: 4,
        nombre: "Teclado Mecánico Redragon",
        precio: 49990,
        imagen: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
        descripcion: "Switches rojos, retroiluminación RGB, layout español.",
        categoria: "Periféricos",
        stock: 40
    },
    {
        id: 5,
        nombre: "Mouse Logitech G502 Hero",
        precio: 39990,
        imagen: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=600&q=80",
        descripcion: "Sensor 25K DPI, 11 botones programables, RGB.",
        categoria: "Periféricos",
        stock: 30
    },
    {
        id: 6,
        nombre: "SSD NVMe Kingston 1TB",
        precio: 89990,
        imagen: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80",
        descripcion: "Lectura hasta 3500 MB/s, formato M.2 2280 PCIe Gen3.",
        categoria: "Componentes",
        stock: 50
    },
    {
        id: 7,
        nombre: "Notebook Lenovo IdeaPad 3",
        precio: 449990,
        imagen: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
        descripcion: "Ryzen 5, 8GB RAM, 256GB SSD, pantalla 15.6\" HD.",
        categoria: "Notebooks",
        stock: 15
    },
    {
        id: 8,
        nombre: "Audífonos HyperX Cloud II",
        precio: 79990,
        imagen: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80",
        descripcion: "Sonido envolvente 7.1, micrófono con cancelación de ruido.",
        categoria: "Periféricos",
        stock: 18
    }
];

// Renderiza productos en un contenedor
function renderizarProductos(contenedorId, lista = PRODUCTOS) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = "<p>No hay productos disponibles.</p>";
        return;
    }

    lista.forEach(p => {
        const art = document.createElement("article");
        art.className = "item-producto";
        art.innerHTML = `
            <img src="${p.imagen}" alt="${p.nombre}" class="foto-producto">
            <h3>${p.nombre}</h3>
            <p>${p.descripcion}</p>
            <p class="precio">$${p.precio.toLocaleString('es-CL')}</p>
            <a href="detalle-producto.html?id=${p.id}" class="btn-accion">Ver detalle</a>
        `;
        contenedor.appendChild(art);
    });
}

// Obtiene el ID desde la URL (?id=1)
function obtenerIdDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("id"));
}

/* ==========================================================================
   RENDERIZADO DE CATÁLOGO: TABLA ADMINISTRATIVA DE PRODUCTOS
   Responsabilidad:
     - Detección del contenedor tabular administrativo en 'admin-productos.html'
     - Recuperación y parseo de productos dinámicos persistidos en localStorage ('productos')
     - Construcción dinámica de nodos <tr> e inyección en el <tbody>
     - Cálculo visual del indicador badge según stock <= stockCritico
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const tablaCuerpo = document.querySelector(".tabla-datos tbody");

    if (tablaCuerpo) {
        const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];

        productosGuardados.forEach((item) => {
            const fila = document.createElement("tr");

            const esCritico = item.stockCritico !== null && item.stock <= item.stockCritico;
            let badgeEstado = '<span class="badge-alerta badge-normal">Normal</span>';

            if (item.precio === 0) {
                badgeEstado = '<span class="badge-alerta badge-normal">FREE</span>';
            } else if (esCritico) {
                badgeEstado = `<span class="badge-alerta badge-critico">Crítico (≤${item.stockCritico})</span>`;
            }

            fila.innerHTML = `
                <td><strong>${item.codigo}</strong></td>
                <td>${item.nombre}</td>
                <td>${item.categoria || "General"}</td>
                <td>$${item.precio.toLocaleString("es-CL")}</td>
                <td>${item.stock}</td>
                <td>${badgeEstado}</td>
                <td>
                    <button type="button" class="btn-tabla btn-editar">Editar</button>
                    <button type="button" class="btn-tabla btn-eliminar">Eliminar</button>
                </td>
            `;

            tablaCuerpo.appendChild(fila);
        });
    }
});

/* ==========================================================================
   RENDERIZADO Y ELIMINACIÓN: TABLA ADMINISTRATIVA DE PRODUCTOS
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const tablaCuerpo = document.querySelector(".tabla-datos tbody");

    if (tablaCuerpo) {
        const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];

        productosGuardados.forEach((item) => {
            const fila = document.createElement("tr");

            const esCritico = item.stockCritico !== null && item.stock <= item.stockCritico;
            let badgeEstado = '<span class="badge-alerta badge-normal">Normal</span>';

            if (item.precio === 0) {
                badgeEstado = '<span class="badge-alerta badge-normal">FREE</span>';
            } else if (esCritico) {
                badgeEstado = `<span class="badge-alerta badge-critico">Crítico (≤${item.stockCritico})</span>`;
            }

            fila.innerHTML = `
                <td><strong>${item.codigo}</strong></td>
                <td>${item.nombre}</td>
                <td>${item.categoria || "General"}</td>
                <td>$${item.precio.toLocaleString("es-CL")}</td>
                <td>${item.stock}</td>
                <td>${badgeEstado}</td>
                <td>
                    <button type="button" class="btn-tabla btn-editar">Editar</button>
                    <button type="button" class="btn-tabla btn-eliminar" data-codigo="${item.codigo}">Eliminar</button>
                </td>
            `;

            tablaCuerpo.appendChild(fila);
        });

        // Delegación de eventos para los botones Eliminar
        tablaCuerpo.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-eliminar")) {
                const codigoAEliminar = e.target.getAttribute("data-codigo");

                if (codigoAEliminar && confirm(`¿Estás seguro de que deseas eliminar el producto ${codigoAEliminar}?`)) {
                    // Filtrar y actualizar localStorage
                    let lista = JSON.parse(localStorage.getItem("productos")) || [];
                    lista = lista.filter(prod => prod.codigo !== codigoAEliminar);
                    localStorage.setItem("productos", JSON.stringify(lista));

                    // Quitar la fila de la tabla en el navegador
                    const fila = e.target.closest("tr");
                    if (fila) fila.remove();
                }
            }
        });
    }
});