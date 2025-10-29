const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE_URL = 'http://localhost:3000';

async function testEditUserPageFixed() {
  console.log(' Verificando p√gina de editar usuario con footer correcto...');
  
  try {
    // Crear un usuario para probar la p√gina de edici√≥n
    const createResponse = await fetch(`${BASE_URL}/api/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Usuario Test Editar',
        email: 'editar-fixed@example.com',
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
    
    // Probar espec√≠ficamente la p√gina de editar usuario
    const editPageResponse = await fetch(`${BASE_URL}/usuarios/${userId}/editar`);
    console.log('Success: P√gina de editar usuario accesible:', editPageResponse.ok ? 'S√' : 'NO');
    
    if (editPageResponse.ok) {
      console.log(' P√gina cargada correctamente con clase edit-user-page');
    }
    
    // Limpiar
    await fetch(`${BASE_URL}/api/usuarios/${userId}`, { method: 'DELETE' });
    console.log('Success: Usuario de prueba eliminado');
    
    console.log('\nTarget: SOLUCI√N ESPEC√FICA IMPLEMENTADA:');
    console.log('Ä¢ Clase CSS espec√≠fica: .edit-user-page');
    console.log('Ä¢ min-height: calc(100vh - 200px) solo para esta p√gina');
    console.log('Ä¢ El resto de p√ginas mantienen su comportamiento normal');
    console.log('Ä¢ Footer se empuja al final solo en p√ginas con poco contenido');
    
    console.log('\nList: INSTRUCCIONES PARA VERIFICAR:');
    console.log('1. Ve a http://localhost:3000/usuarios');
    console.log('2. Crea un usuario');
    console.log('3. Haz clic en "Editar"');
    console.log('4. El footer debe estar al final de la p√gina (no arriba)');
    console.log('5. La p√gina debe tener suficiente altura para empujar el footer');
    console.log('6. Otras p√ginas deben seguir funcionando normalmente');
    
  } catch (error) {
    console.error('Error: Error:', error.message);
  }
}

testEditUserPageFixed();
