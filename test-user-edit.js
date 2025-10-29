const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE_URL = 'http://localhost:3000/api';

async function testUserEdit() {
  console.log(' Probando edición de usuario...');

  try {
    // Crear usuario primero
    const createResponse = await fetch(`${BASE_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Usuario Original',
        email: 'original@example.com',
        password: 'password123'
      })
    });

    const createData = await createResponse.json();
    console.log('Usuario creado:', createData.success ? 'Success:' : 'Error:');

    if (!createData.success) {
      console.log('Error:', createData.message);
      return;
    }

    const userId = createData.data.id;
    console.log('ID del usuario:', userId);

    // Intentar editar usuario
    const editResponse = await fetch(`${BASE_URL}/usuarios/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Usuario Editado',
        email: 'editado@example.com'
      })
    });

    const editData = await editResponse.json();
    console.log('Usuario editado:', editData.success ? 'Success:' : 'Error:');
    console.log('Respuesta:', editData);

    // Limpiar
    await fetch(`${BASE_URL}/usuarios/${userId}`, { method: 'DELETE' });
    console.log('Usuario eliminado');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testUserEdit();
