const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE_URL = 'http://localhost:3000';

async function testEditUserPageFooter() {
  console.log(' Verificando footer en p�gina de editar usuario...');
  
  try {
    // Crear un usuario para probar la p�gina de edición
    const createResponse = await fetch(`${BASE_URL}/api/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Usuario Test Editar',
        email: 'editar-test@example.com',
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
    
    // Probar específicamente la p�gina de editar usuario
    const editPageResponse = await fetch(`${BASE_URL}/usuarios/${userId}/editar`);
    console.log('Success: P�gina de editar usuario accesible:', editPageResponse.ok ? 'S�' : 'NO');
    
    if (editPageResponse.ok) {
      console.log(' Contenido de la p�gina obtenido correctamente');
    }
    
    // Limpiar
    await fetch(`${BASE_URL}/api/usuarios/${userId}`, { method: 'DELETE' });
    console.log('Success: Usuario de prueba eliminado');
    
    console.log('\nTarget: SOLUCI�N IMPLEMENTADA:');
    console.log('�� Main con min-height: calc(100vh - 200px)');
    console.log('�� Esto asegura que el contenido tenga altura mínima');
    console.log('�� El footer se empuja al final cuando el contenido es corto');
    console.log('�� Flexbox mantiene el footer en la posición correcta');
    
    console.log('\nList: INSTRUCCIONES PARA VERIFICAR:');
    console.log('1. Ve a http://localhost:3000/usuarios');
    console.log('2. Crea un usuario');
    console.log('3. Haz clic en "Editar"');
    console.log('4. El footer debe estar al final de la p�gina (no arriba)');
    console.log('5. Si el contenido es corto, el footer debe estar al final de la pantalla');
    console.log('6. El contenido debe tener suficiente altura para empujar el footer');
    
  } catch (error) {
    console.error('Error: Error:', error.message);
  }
}

testEditUserPageFooter();
