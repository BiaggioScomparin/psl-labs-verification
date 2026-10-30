import fs from 'fs';
import QRCode from 'qrcode';

async function test() {
  const qr = await QRCode.toDataURL('https://psl-labs-verification.vercel.app/v/GHK50-TEST', {
    margin: 0,
    width: 100,
    errorCorrectionLevel: 'M',
    color: { dark: '#0f172a', light: '#ffffff' }
  });
  console.log('QR length:', qr.length);
}
test();
