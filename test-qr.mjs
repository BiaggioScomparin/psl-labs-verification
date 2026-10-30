import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';

async function test() {
  const qr = await QRCode.toDataURL('https://psl-labs.vercel.app/v/GHK50-TEST1', {
    margin: 0,
    width: 120,
    errorCorrectionLevel: 'M',
    color: { dark: '#0f172a', light: '#ffffff' }
  });
  console.log('QR Code generated length:', qr.length);
}
test();
