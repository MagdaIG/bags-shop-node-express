const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuraci√≥n de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware global
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(methodOverride('_method'));

// Archivos est√ticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para pasar datos globales a las vistas
app.use((req, res, next) => {
  res.locals.currentYear = new Date().getFullYear();
  res.locals.appName = 'Handmade Bags Store';
  next();
});

// Datos mock para demostraci√≥n
const mockUsers = [
  {
    id: 1,
    nombre: 'Magdalena Garc√≠a',
    email: 'magda@example.com',
    createdAt: new Date('2024-01-10'),
    pedidos: [
      { id: 1, producto: 'Makeup Bag Lavender', cantidad: 2, fecha_pedido: '2024-01-15', estado: 'entregado' },
      { id: 2, producto: 'Tote Bag', cantidad: 1, fecha_pedido: '2024-01-20', estado: 'enviado' }
    ]
  },
  {
    id: 2,
    nombre: 'Alice Johnson',
    email: 'alice@example.com',
    createdAt: new Date('2024-01-12'),
    pedidos: [
      { id: 3, producto: 'Mini Pouch', cantidad: 3, fecha_pedido: '2024-01-18', estado: 'confirmado' },
      { id: 4, producto: 'Book Quilted Bag', cantidad: 1, fecha_pedido: '2024-01-22', estado: 'pendiente' }
    ]
  },
  {
    id: 3,
    nombre: 'Bob Smith',
    email: 'bob@example.com',
    createdAt: new Date('2024-01-14'),
    pedidos: [
      { id: 5, producto: 'Laptop Quilted Bag', cantidad: 1, fecha_pedido: '2024-01-19', estado: 'en_proceso' }
    ]
  }
];

const mockOrders = [
  {
    id: 1,
    usuario_id: 1,
    producto: 'Makeup Bag Lavender',
    cantidad: 2,
    precio_unitario: 25.00,
    fecha_pedido: '2024-01-15',
    estado: 'entregado',
    usuario: { id: 1, nombre: 'Magdalena Garc√≠a', email: 'magda@example.com' }
  },
  {
    id: 2,
    usuario_id: 1,
    producto: 'Tote Bag',
    cantidad: 1,
    precio_unitario: 35.00,
    fecha_pedido: '2024-01-20',
    estado: 'enviado',
    usuario: { id: 1, nombre: 'Magdalena Garc√≠a', email: 'magda@example.com' }
  },
  {
    id: 3,
    usuario_id: 2,
    producto: 'Mini Pouch',
    cantidad: 3,
    precio_unitario: 18.00,
    fecha_pedido: '2024-01-18',
    estado: 'confirmado',
    usuario: { id: 2, nombre: 'Alice Johnson', email: 'alice@example.com' }
  },
  {
    id: 4,
    usuario_id: 2,
    producto: 'Book Quilted Bag',
    cantidad: 1,
    precio_unitario: 28.00,
    fecha_pedido: '2024-01-22',
    estado: 'pendiente',
    usuario: { id: 2, nombre: 'Alice Johnson', email: 'alice@example.com' }
  },
  {
    id: 5,
    usuario_id: 3,
    producto: 'Laptop Quilted Bag',
    cantidad: 1,
    precio_unitario: 45.00,
    fecha_pedido: '2024-01-19',
    estado: 'en_proceso',
    usuario: { id: 3, nombre: 'Bob Smith', email: 'bob@example.com' }
  }
];

// Rutas de vistas
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Handmade Bags Store',
    stats: {
      totalUsers: mockUsers.length,
      totalOrders: mockOrders.length
    },
    recentOrders: mockOrders.slice(0, 5)
  });
});

app.get('/usuarios', (req, res) => {
  res.render('usuarios/index', {
    title: 'Gesti√≥n de Usuarios',
    users: mockUsers
  });
});

app.get('/usuarios/crear', (req, res) => {
  res.render('usuarios/crear', {
    title: 'Crear Usuario'
  });
});

app.get('/usuarios/:id/editar', (req, res) => {
  const user = mockUsers.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).render('error', {
      title: 'Usuario no encontrado',
      error: { status: 404, message: 'Usuario no encontrado' }
    });
  }
  res.render('usuarios/editar', {
    title: 'Editar Usuario',
    user
  });
});

app.get('/usuarios/:id/pedidos', (req, res) => {
  const user = mockUsers.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).render('error', {
      title: 'Usuario no encontrado',
      error: { status: 404, message: 'Usuario no encontrado' }
    });
  }

  const orders = mockOrders.filter(o => o.usuario_id === parseInt(req.params.id));
  res.render('usuarios/pedidos', {
    title: `Pedidos de ${user.nombre}`,
    user,
    orders
  });
});

app.get('/pedidos', (req, res) => {
  res.render('pedidos/index', {
    title: 'Gesti√≥n de Pedidos',
    orders: mockOrders
  });
});

app.get('/pedidos/crear', (req, res) => {
  res.render('pedidos/crear', {
    title: 'Crear Pedido',
    users: mockUsers.map(u => ({ id: u.id, nombre: u.nombre, email: u.email }))
  });
});

app.get('/productos', (req, res) => {
  res.render('productos', {
    title: 'Cat√logo de Productos'
  });
});

// Rutas API mock
app.post('/api/usuarios', (req, res) => {
  const { nombre, email, password } = req.body;
  const newUser = {
    id: mockUsers.length + 1,
    nombre,
    email,
    createdAt: new Date(),
    pedidos: []
  };
  mockUsers.push(newUser);

  res.status(201).json({
    success: true,
    message: 'Usuario creado exitosamente',
    data: newUser
  });
});

app.get('/api/usuarios', (req, res) => {
  res.json({
    success: true,
    message: 'Usuarios obtenidos exitosamente',
    data: mockUsers.map(u => ({ ...u, password: undefined })),
    count: mockUsers.length
  });
});

app.get('/api/usuarios/:id', (req, res) => {
  const user = mockUsers.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  res.json({
    success: true,
    message: 'Usuario obtenido exitosamente',
    data: { ...user, password: undefined }
  });
});

app.put('/api/usuarios/:id', (req, res) => {
  const user = mockUsers.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  const { nombre, email } = req.body;
  if (nombre) user.nombre = nombre;
  if (email) user.email = email;

  res.json({
    success: true,
    message: 'Usuario actualizado exitosamente',
    data: { ...user, password: undefined }
  });
});

app.delete('/api/usuarios/:id', (req, res) => {
  const userIndex = mockUsers.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  mockUsers.splice(userIndex, 1);
  res.json({
    success: true,
    message: 'Usuario eliminado exitosamente'
  });
});

app.post('/api/pedidos', (req, res) => {
  const { usuario_id, producto, cantidad, precio_unitario } = req.body;
  const newOrder = {
    id: mockOrders.length + 1,
    usuario_id: parseInt(usuario_id),
    producto,
    cantidad: parseInt(cantidad),
    precio_unitario: precio_unitario ? parseFloat(precio_unitario) : null,
    fecha_pedido: new Date().toISOString().split('T')[0],
    estado: 'pendiente',
    usuario: mockUsers.find(u => u.id === parseInt(usuario_id))
  };
  mockOrders.push(newOrder);

  res.status(201).json({
    success: true,
    message: 'Pedido creado exitosamente',
    data: newOrder
  });
});

app.get('/api/pedidos', (req, res) => {
  res.json({
    success: true,
    message: 'Pedidos obtenidos exitosamente',
    data: mockOrders,
    count: mockOrders.length
  });
});

app.get('/api/pedidos/usuario/:id', (req, res) => {
  const user = mockUsers.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  const orders = mockOrders.filter(o => o.usuario_id === parseInt(req.params.id));
  res.json({
    success: true,
    message: `Pedidos del usuario ${user.nombre} obtenidos exitosamente`,
    data: {
      usuario: user,
      pedidos: orders,
      total_pedidos: orders.length
    }
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor'
  });
});

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada`
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Start: Servidor ejecut√ndose en http://localhost:${PORT}`);
  console.log(`Chart: Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Info: Modo: DEMO (sin base de datos)`);
  console.log(`\nSparkle: Caracter√≠sticas disponibles:`);
  console.log(`   Web: Interfaz web completa`);
  console.log(`   Bag: Productos artesanales con im√genes`);
  console.log(`   • Gesti√≥n de usuarios`);
  console.log(`   ¶ Gesti√≥n de pedidos`);
  console.log(`   Info: Tema pastel personalizado`);
  console.log(`\nó Accede a: http://localhost:${PORT}`);
});

module.exports = app;
