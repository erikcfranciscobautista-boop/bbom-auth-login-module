// test/prototype.test.ts (o el archivo de test que tengas creado)
import { executeAuthLoginModule } from "../src/index.js";

async function testBasico() {
    console.log("⏳ Validando inicialización del test...");
    
    // Un pequeño log para asegurar que TypeScript no lo ignore
    if (typeof executeAuthLoginModule === 'function') {
        console.log("✅ El módulo de login se exportó correctamente para los tests.");
    }
}

testBasico();