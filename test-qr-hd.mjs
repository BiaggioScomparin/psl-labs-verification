import QRCode from 'qrcode';

async function test() {
  const url = 'https://psl-labs-verification.vercel.app/v/GHK50-8F92K';
  
  // Test with margin: 2 and width: 300
  const qrDataUrl = await QRCode.toDataURL(url, {
    margin: 2,
    width: 300,
    errorCorrectionLevel: 'M',
    color: { dark: '#000000', light: '#ffffff' }
  });
  
  console.log('High-res QR Code generated, length:', qrDataUrl.length);
}
test();
