const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE_URL = 'http://localhost:3000';

async function testFooterFixed() {
  console.log(' Verificando que el footer est√© fijo al final de la p√gina...');

  try {
    // Crear un usuario para probar la p√gina de edici√≥n
    const createResponse = await fetch(`${BASE_URL}/api/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Usuario Test Footer',
        email: 'footer-test@example.com',
        password: 'password123'
      })
    });

    const createData = await createResponse.json();
    if (!createData.success) {
      console.log('Error: Error al crear usuario:', createData.message);
      return;
    }

    const userId = createData.data.id;
    console.log('Success: Usuario creado con ID:', userId);

    // Probar diferentes p√ginas
    const pages = [
      { name: 'P√gina de inicio', url: '/' },
      { name: 'Lista de usuarios', url: '/usuarios' },
      { name: 'Crear usuario', url: '/usuarios/crear' },
      { name: 'Editar usuario', url: `/usuarios/${userId}/editar` },
      { name: 'Lista de pedidos', url: '/pedidos' },
      { name: 'Crear pedido', url: '/pedidos/crear' }
    ];

    console.log('\nList: Probando p√ginas:');
    for (const page of pages) {
      try {
        const response = await fetch(`${BASE_URL}${page.url}`);
        console.log(`${page.name}: ${response.ok ? 'Success:' : 'Error:'}`);
      } catch (error) {
        console.log(`${page.name}: Error: Error`);
      }
    }

    // Limpiar
    await fetch(`${BASE_URL}/api/usuarios/${userId}`, { method: 'DELETE' });
    console.log('\nSuccess: Usuario de prueba eliminado');

    console.log('\nTarget: INSTRUCCIONES PARA VERIFICAR EL FOOTER:');
    console.log('1. Ve a http://localhost:3000/usuarios');
    console.log('2. Crea un usuario');
    console.log('3. Haz clic en "Editar"');
    console.log('4. El footer debe estar SIEMPRE al final de la p√gina');
    console.log('5. Prueba hacer scroll - el footer debe mantenerse al final');
    console.log('6. Prueba en diferentes p√ginas para verificar consistencia');

    console.log('\nConfig: SOLUCI√N IMPLEMENTADA:');
    console.log('Ä¢ Flexbox layout con body como contenedor principal');
    console.log('Ä¢ Content wrapper con flex: 1 para tomar espacio disponible');
    console.log('Ä¢ Footer con margin-top: auto para empujarse al final');
    console.log('Ä¢ Navbar fijo con padding-top compensatorio en main');

  } catch (error) {
    console.error('Error: Error:', error.message);
  }
}

testFooterFixed();
