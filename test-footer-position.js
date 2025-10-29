const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE_URL = 'http://localhost:3000';

async function testFooterPosition() {
  console.log(' Verificando posici√≥n del footer...');

  try {
    // Crear un usuario para probar la p√gina de edici√≥n
    const createResponse = await fetch(`${BASE_URL}/api/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Usuario Test Footer',
        email: 'footer@example.com',
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

    // Probar la p√gina de edici√≥n
    const editPageResponse = await fetch(`${BASE_URL}/usuarios/${userId}/editar`);
    console.log('Success: P√gina de edici√≥n accesible:', editPageResponse.ok ? 'S√' : 'NO');

    // Limpiar
    await fetch(`${BASE_URL}/api/usuarios/${userId}`, { method: 'DELETE' });
    console.log('Success: Usuario de prueba eliminado');

    console.log('\nList: Instrucciones para verificar el footer:');
    console.log('1. Ve a http://localhost:3000/usuarios');
    console.log('2. Crea un usuario');
    console.log('3. Haz clic en "Editar"');
    console.log('4. Verifica que el footer est√© en la parte inferior de la p√gina');
    console.log('5. El footer debe mantenerse en la parte inferior incluso si el contenido es corto');

  } catch (error) {
    console.error('Error: Error:', error.message);
  }
}

testFooterPosition();
