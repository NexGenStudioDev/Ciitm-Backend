// genKey.mjs

import { exec } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { promisify } from 'util';
const run = promisify(exec);

const keyDir = './src/key';
const keyPath = `${keyDir}/key.pem`;
const certPath = `${keyDir}/cert.pem`;

async function generateCert() {
  if (existsSync(keyPath) && existsSync(certPath)) {
    console.log('✅ SSL files already exist:', keyPath, '&', certPath);
    return;
  }

  try {
    // Ensure directory exists
    if (!existsSync(keyDir)) {
      mkdirSync(keyDir, { recursive: true });
    }

    console.log('🔐 Generating self-signed SSL certificate...');

    await run(`openssl genrsa -out ${keyPath} 2048`);
    await run(
      `openssl req -new -key ${keyPath} -out csr.pem -subj "/CN=localhost"`
    );
    await run(
      `openssl x509 -req -in csr.pem -signkey ${keyPath} -out ${certPath} -days 365`
    );
    await run('rm csr.pem');

    console.log('✅ SSL certificate generated at:', keyPath, 'and', certPath);
  } catch (err) {
    console.error('❌ Failed to generate SSL certificate:', err);
  }
}

generateCert();
