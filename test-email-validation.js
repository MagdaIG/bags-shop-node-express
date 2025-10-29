const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE_URL = 'http://localhost:3000/api';

async function testEmailValidation() {
  console.log(' Probando validación de email único...');

  try {
    // Crear primer usuario
    const user1 = await fetch(`${BASE_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Usuario Test',
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const user1Data = await user1.json();
    console.log('Usuario 1 creado:', user1Data.success ? 'Success:' : 'Error:');

    // Intentar crear segundo usuario con mismo email
    const user2 = await fetch(`${BASE_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Usuario Test 2',
        email: 'test@example.com', // Mismo email
        password: 'password123'
      })
    });

    const user2Data = await user2.json();
    console.log('Usuario 2 con email duplicado:', user2Data.success ? 'Error: (debería fallar)' : 'Success: (correctamente rechazado)');
    console.log('Mensaje:', user2Data.message);

    // Limpiar
    if (user1Data.success && user1Data.data.id) {
      await fetch(`${BASE_URL}/usuarios/${user1Data.data.id}`, { method: 'DELETE' });
      console.log('Usuario de prueba eliminado');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testEmailValidation();
