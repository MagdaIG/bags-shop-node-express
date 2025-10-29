const { User, Order, sequelize } = require('../index');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log(' Iniciando proceso de seeding...');

    // Verificar conexi√≥n
    await sequelize.authenticate();
    console.log('Success: Conexi√≥n a la base de datos establecida.');

    // Limpiar datos existentes (opcional)
    console.log('π Limpiando datos existentes...');
    await Order.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });

    // Crear usuarios
    console.log('• Creando usuarios...');
    const users = await User.bulkCreate([
      {
        nombre: 'Magdalena Garc√≠a',
        email: 'magda@example.com',
        password: 'Bootcamp123'
      },
      {
        nombre: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'Bootcamp123'
      },
      {
        nombre: 'Bob Smith',
        email: 'bob@example.com',
        password: 'Bootcamp123'
      },
      {
        nombre: 'Mar√≠a Rodr√≠guez',
        email: 'maria@example.com',
        password: 'Bootcamp123'
      },
      {
        nombre: 'Carlos L√≥pez',
        email: 'carlos@example.com',
        password: 'Bootcamp123'
      }
    ]);

    console.log(`Success: ${users.length} usuarios creados exitosamente.`);

    // Crear pedidos
    console.log('Bag: Creando pedidos...');
    const orders = await Order.bulkCreate([
      {
        usuario_id: users[0].id, // Magdalena
        producto: 'Makeup Bag Lavender',
        cantidad: 2,
        precio_unitario: 25.00,
        fecha_pedido: '2024-01-15',
        estado: 'entregado'
      },
      {
        usuario_id: users[0].id, // Magdalena
        producto: 'Tote Bag',
        cantidad: 1,
        precio_unitario: 35.00,
        fecha_pedido: '2024-01-20',
        estado: 'enviado'
      },
      {
        usuario_id: users[1].id, // Alice
        producto: 'Mini Pouch',
        cantidad: 3,
        precio_unitario: 18.00,
        fecha_pedido: '2024-01-18',
        estado: 'confirmado'
      },
      {
        usuario_id: users[1].id, // Alice
        producto: 'Book Quilted Bag',
        cantidad: 1,
        precio_unitario: 28.00,
        fecha_pedido: '2024-01-22',
        estado: 'pendiente'
      },
      {
        usuario_id: users[2].id, // Bob
        producto: 'Laptop Quilted Bag',
        cantidad: 1,
        precio_unitario: 45.00,
        fecha_pedido: '2024-01-19',
        estado: 'en_proceso'
      },
      {
        usuario_id: users[2].id, // Bob
        producto: 'Drawstring Bag',
        cantidad: 1,
        precio_unitario: 22.00,
        fecha_pedido: '2024-01-21',
        estado: 'pendiente'
      },
      {
        usuario_id: users[3].id, // Mar√≠a
        producto: 'Money Bag',
        cantidad: 2,
        precio_unitario: 20.00,
        fecha_pedido: '2024-01-16',
        estado: 'entregado'
      },
      {
        usuario_id: users[4].id, // Carlos
        producto: 'Scrunchies',
        cantidad: 4,
        precio_unitario: 8.00,
        fecha_pedido: '2024-01-17',
        estado: 'confirmado'
      },
      {
        usuario_id: users[4].id, // Carlos
        producto: 'Round Bag',
        cantidad: 1,
        precio_unitario: 30.00,
        fecha_pedido: '2024-01-23',
        estado: 'pendiente'
      },
      {
        usuario_id: users[0].id, // Magdalena
        producto: 'Makeup Quilted',
        cantidad: 1,
        precio_unitario: 26.00,
        fecha_pedido: '2024-01-24',
        estado: 'pendiente'
      },
      {
        usuario_id: users[1].id, // Alice
        producto: 'Drawstring Minibag',
        cantidad: 2,
        precio_unitario: 15.00,
        fecha_pedido: '2024-01-25',
        estado: 'confirmado'
      }
    ]);

    console.log(`Success: ${orders.length} pedidos creados exitosamente.`);

    // Mostrar resumen
    console.log('\nChart: Resumen del seeding:');
    console.log(`• Usuarios creados: ${users.length}`);
    console.log(`Bag: Pedidos creados: ${orders.length}`);

    console.log('\nUser: Usuarios creados:');
    users.forEach(user => {
      console.log(`   - ${user.nombre} (${user.email})`);
    });

    console.log('\nBag: Pedidos creados:');
    orders.forEach(order => {
      const user = users.find(u => u.id === order.usuario_id);
      console.log(`   - ${order.producto} x${order.cantidad} - ${user.nombre} (${order.estado})`);
    });

    console.log('\nâ ¬Seeding completado exitosamente!');
    console.log('\n Credenciales de prueba:');
    console.log('   Email: magda@example.com | Contrase√a: Bootcamp123');
    console.log('   Email: alice@example.com | Contrase√a: Bootcamp123');
    console.log('   Email: bob@example.com | Contrase√a: Bootcamp123');

  } catch (error) {
    console.error('Error: Error durante el seeding:', error);
    throw error;
  }
}

// Funci√≥n para ejecutar el seeding
async function runSeed() {
  try {
    await seedDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error: Error fatal en el seeding:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runSeed();
}

module.exports = { seedDatabase };
