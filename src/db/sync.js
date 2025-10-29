const { User, Order, syncDatabase } = require('./index');

async function sync() {
  console.log(' Iniciando sincronización de la base de datos...');

  const success = await syncDatabase();

  if (success) {
    console.log('Success: Sincronización completada exitosamente');
    process.exit(0);
  } else {
    console.log('Error: Error en la sincronización');
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  sync().catch(error => {
    console.error('Error: Error inesperado:', error);
    process.exit(1);
  });
}

module.exports = sync;
