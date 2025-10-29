const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE_URL = 'http://localhost:3000/api';

async function testUserEditScenarios() {
  console.log(' Probando diferentes escenarios de edición de usuario...');

  try {
    // Crear usuario de prueba
    const createResponse = await fetch(`${BASE_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Usuario Test',
        email: 'test@example.com',
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

    // Escenario 1: Editar solo nombre
    console.log('\n1�� Probando edición solo del nombre...');
    const editNameResponse = await fetch(`${BASE_URL}/usuarios/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Usuario Modificado'
      })
    });

    const editNameData = await editNameResponse.json();
    console.log('Resultado:', editNameData.success ? 'Success:' : 'Error:');
    if (!editNameData.success) {
      console.log('Error:', editNameData.message);
      if (editNameData.errors) {
        console.log('Errores:', editNameData.errors);
      }
    }

    // Escenario 2: Editar solo email
    console.log('\n2�� Probando edición solo del email...');
    const editEmailResponse = await fetch(`${BASE_URL}/usuarios/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nuevo@example.com'
      })
    });

    const editEmailData = await editEmailResponse.json();
    console.log('Resultado:', editEmailData.success ? 'Success:' : 'Error:');
    if (!editEmailData.success) {
      console.log('Error:', editEmailData.message);
      if (editEmailData.errors) {
        console.log('Errores:', editEmailData.errors);
      }
    }

    // Escenario 3: Editar nombre y email
    console.log('\n3�� Probando edición de nombre y email...');
    const editBothResponse = await fetch(`${BASE_URL}/usuarios/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Usuario Completo',
        email: 'completo@example.com'
      })
    });

    const editBothData = await editBothResponse.json();
    console.log('Resultado:', editBothData.success ? 'Success:' : 'Error:');
    if (!editBothData.success) {
      console.log('Error:', editBothData.message);
      if (editBothData.errors) {
        console.log('Errores:', editBothData.errors);
      }
    }

    // Escenario 4: Editar con contrase�a
    console.log('\n4�� Probando edición con nueva contrase�a...');
    const editPasswordResponse = await fetch(`${BASE_URL}/usuarios/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Usuario Con Password',
        password: 'nuevapassword123'
      })
    });

    const editPasswordData = await editPasswordResponse.json();
    console.log('Resultado:', editPasswordData.success ? 'Success:' : 'Error:');
    if (!editPasswordData.success) {
      console.log('Error:', editPasswordData.message);
      if (editPasswordData.errors) {
        console.log('Errores:', editPasswordData.errors);
      }
    }

    // Escenario 5: Probar validaciones
    console.log('\n5�� Probando validaciones...');

    // Email inv�lido
    const invalidEmailResponse = await fetch(`${BASE_URL}/usuarios/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'email-invalido'
      })
    });

    const invalidEmailData = await invalidEmailResponse.json();
    console.log('Email inv�lido:', !invalidEmailData.success ? 'Success: (correctamente rechazado)' : 'Error: (debería fallar)');

    // Contrase�a muy corta
    const shortPasswordResponse = await fetch(`${BASE_URL}/usuarios/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: '123'
      })
    });

    const shortPasswordData = await shortPasswordResponse.json();
    console.log('Contrase�a corta:', !shortPasswordData.success ? 'Success: (correctamente rechazado)' : 'Error: (debería fallar)');

    // Limpiar
    await fetch(`${BASE_URL}/usuarios/${userId}`, { method: 'DELETE' });
    console.log('\nSuccess: Usuario de prueba eliminado');

  } catch (error) {
    console.error('Error: Error inesperado:', error.message);
  }
}

testUserEditScenarios();
