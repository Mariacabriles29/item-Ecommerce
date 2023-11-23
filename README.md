# Ecommerce Next.js con MongoDB - Proyecto de Prueba

Este proyecto es un sistema de comercio electrónico desarrollado con Next.js y MongoDB, que incluye características esenciales como listado de productos, paginación, pasarela de pago, chat en tiempo real, sistema de tickets y panel administrativo. A continuación, se detallan las principales funcionalidades del proyecto.

## Inicio Rápido

1. **Instalación de Dependencias**

   ```bash
   npm install
   ```

2. **Configuración de MongoDB**

   Asegúrese de tener una instancia de MongoDB en ejecución y configure la conexión en el archivo `.env`.

3. **Configuración de Autenticación con RRSS**

   Configurar las credenciales de autenticación para RRSS en el archivo `.env`.

4. **Inicio de la Aplicación**

   ```bash
   npm run dev
   ```

   La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

5. **Configuración del Servidor de Chat con Socket.io**

Antes de utilizar la funcionalidad de chat en tiempo real, inicie el servidor de chat ejecutando:

```bash
npm run start-server
```

6. **Configuración de la Base de Datos y Usuario Administrador**

   -Iniciar MongoDB:

-Asegúrese de tener el servidor de MongoDB en ejecución.

**Registrar el Primer Usuario Administrador:**

-Ejecute la aplicación y registre el primer usuario.
Acceda a la base de datos y actualice el rol del primer usuario a "admin" y el campo root a "true" .

**Alternar entre Roles de Usuario:**

-Desde la interfaz de la aplicación con su usuario admin, puede modificar los roles de los usuarios registrados a su conveniencia. Alternar entre los roles admin y user según sea necesario.

## Características

### Ecommerce

- **Listado de Productos:**

  - Muestra una lista de productos organizados en al menos 3 categorías.
  - Implementa paginación para facilitar la exploración.

- **Detalles del Producto:**

  - Páginas detalladas para cada producto con información completa.

- **Carrito de Compras:**

  - Permite a los usuarios agregar productos al carrito.
  - Proceso de pago integrado con PayPal u otra pasarela de pago.

- **Búsqueda Global:**

  - Barra de búsqueda que realiza consultas en tiempo real a la base de datos.
  - Muestra sugerencias a medida que el usuario escribe.

- **Validación de Stock:**
  - Impide que los productos sin stock se agreguen al carrito.
  - Informa a los usuarios sobre la disponibilidad de productos.

### Autenticación

- **Registro e Inicio de Sesión:**

  - Formularios de registro e inicio de sesión con campos requeridos.
  - Registro e inicio de sesión mediante RRSS (mínimo 2 plataformas).

- **Rutas Protegidas:**
  - Acceso a rutas protegidas, con paneles administrativos solo para usuarios autenticados con rol admin.

### Sistema de Tickets

- **Creación y Gestión de Tickets:**
  - Página para crear nuevos tickets y verificar el estado de los existentes.
  - Almacenamiento y gestión de tickets en MongoDB.

### Chat de Atención al Cliente

- **Chat en Tiempo Real:**
  - Interfaz de chat utilizando Socket.io o Firebase Realtime Database.
  - Comunicación directa entre usuarios y personal técnico.

### Panel Administrativo

- **Operaciones CRUD:**

  - Administradores pueden crear, listar, modificar, agregar stock y eliminar productos.

- **Gestión de Categorías:**

  - Operaciones CRUD para las categorías del ecommerce.

- **Gestión de Usuarios:**

  - Modificación del rol de los usuarios entre admin y user.

- **Gestión de Tickets y Chat:**
  - Administradores pueden gestionar tickets y chatear con clientes.

## Contribuciones

Las contribuciones son bienvenidas. Si encuentra algún problema o tiene sugerencias, por favor, abra un problema o envíe una solicitud de extracción.

¡Disfruta construyendo tu ecommerce con Next.js y MongoDB!
