// test/prototype.test.ts (o el archivo de test que tengas creado)
import { authLogin } from "../src/index.js";

async function testBasico() {
    console.log("⏳ Validando inicialización del test...");
    
    // Un pequeño log para asegurar que TypeScript no lo ignore
    if (typeof authLogin === 'function') {
        console.log("✅ El módulo de login se exportó correctamente para los tests.");
    }
}

testBasico();