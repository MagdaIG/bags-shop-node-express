const { User, Order, sequelize } = require('./src/db');

async function testDatabase() {
  try {
    console.log(' Probando conexión a la base de datos...');
    
    // Verificar conexión
    await sequelize.authenticate();
    console.log('Success: Conexión a la base de datos establecida correctamente.');
    
    // Sincronizar modelos
    await sequelize.sync({ force: false });
    console.log('Success: Modelos sincronizados con la base de datos.');
    
    // Probar creación de usuario
    console.log(' Probando creación de usuario...');
    const testUser = await User.create({
      nombre: 'Usuario Test',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Success: Usuario creado exitosamente:', testUser.toJSON());
    
    // Probar creación de pedido
    console.log(' Probando creación de pedido...');
    const testOrder = await Order.create({
      usuario_id: testUser.id,
      producto: 'Tote Bag',
      cantidad: 2,
      precio_unitario: 25.99
    });
    console.log('Success: Pedido creado exitosamente:', testOrder.toJSON());
    
    // Probar consultas
    console.log(' Probando consultas...');
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    console.log('Success: Usuarios encontrados:', users.length);
    
    const orders = await Order.findAll({
      include: [{
        model: User,
        as: 'usuario',
        attributes: ['id', 'nombre', 'email']
      }]
    });
    console.log('Success: Pedidos encontrados:', orders.length);
    
    // Limpiar datos de prueba
    console.log(' Limpiando datos de prueba...');
    await testOrder.destroy();
    await testUser.destroy();
    console.log('Success: Datos de prueba eliminados.');
    
    console.log('� Todas las pruebas pasaron exitosamente!');
    
  } catch (error) {
    console.error('Error: Error en las pruebas:', error);
  } finally {
    await sequelize.close();
    console.log('Success: Conexión cerrada.');
  }
}

// Ejecutar pruebas
testDatabase();
