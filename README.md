## lacomputienda 
Tienda online básica de venta de computadores, notebooks y accesorios.
- Proyecto desarrollado para la asignatura Desarrollo Fullstack II 003D - Evaluación Parcial 2.
- Integrantes: Jonathan Canales - Michael Escobar - Elizabeth Cabrera

## Descripción Del Proyecto
El objetivo de este proyecto es desarrollar el frontend de una tienda online utilizando HTML5, CSS y JavaScript.
El sitio incluye vistas para clientes (catálogo, carrito, blogs, contacto), un panel de administración para la gestión de productos y usuarios
e implementación de una base de datos.

## Características Principales
- **Navegación fluida:** Menú superior unificado en todas las vistas
- **Catálogo dinámico:** Renderizado de productos usando arreglos en JavaScript
- **Autenticación real:** Inicio de sesión y registro de usuarios conectados a la base de datos con contraseñas encriptadas.
- **Carrito de compras:** Persistencia de datos usando `localStorage` (los productos no se borran al cerrar el navegador)
- **Validaciones JS:** Reglas de negocio en formularios (RUT con módulo 11, correos permitidos, contraseñas)
- **Diseño responsivo**
- **Panel de administrador:** Vistas para la gestión del sistema

## Tecnologías Utilizadas
- **HTML5:** 
- **CSS3**
- **JavaScript** 
- **Git y GitHub**

## Estructura del Repositorio
```text
lacomputienda/
│
├── css/                  # styles.css
├── img/                  # imágenes y recursos gráficos
├── js/                   # lógica de javascript, validaciones y conexión a bd
│
├── admin/                # panel de administración
│   ├── admin-home.html
│   ├── admin-productos.html
│   ├── admin-usuarios.html
│   ├── admin-nuevo-producto.html
│   └── admin-nuevo-usuario.html
│
├── index.html            # página de inicio (home)
├── productos.html        # catálogo de productos
├── detalle-producto.html # vista detallada de un producto
├── carrito.html          # carrito de compras
├── contacto.html         # formulario de contacto
├── nosotros.html         # información de la empresa
├── blogs.html            # listado de noticias
├── registro.html         # registro de nuevos usuarios 
├── Inicio-sesion.html    # Login de usuarios 
└── login.html            # Login exclusivo de Administrador
