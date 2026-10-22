import * as THREE from 'three';

const textureCache = new Map<string, THREE.CanvasTexture>();

export function getSignTexture(signId: string, svgType: string, params?: Record<string, string | number>): THREE.CanvasTexture {
  const key = `${signId}_${JSON.stringify(params || {})}`;
  if (textureCache.has(key)) {
    return textureCache.get(key)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Fill transparent or white background
  ctx.clearRect(0, 0, 512, 512);

  // Draw sign based on svgType
  ctx.save();

  if (svgType === 'stop') {
    // Red Octagon
    ctx.beginPath();
    const r = 240;
    const cx = 256;
    const cy = 256;
    for (let i = 0; i < 8; i++) {
      const angle = (i * 2 * Math.PI) / 8 + Math.PI / 8;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = '#DC2626';
    ctx.fill();
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 120px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('STOP', 256, 256);
  } else if (svgType === 'give_way') {
    // Inverted Triangle
    ctx.beginPath();
    ctx.moveTo(256, 480);
    ctx.lineTo(40, 60);
    ctx.lineTo(472, 60);
    ctx.closePath();
    ctx.fillStyle = '#DC2626';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(256, 400);
    ctx.lineTo(90, 95);
    ctx.lineTo(422, 95);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  } else if (svgType === 'speed_limit') {
    const speed = params?.speed || 40;
    // Red Circle, White inside
    ctx.beginPath();
    ctx.arc(256, 256, 230, 0, Math.PI * 2);
    ctx.fillStyle = '#DC2626';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(256, 256, 185, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    ctx.fillStyle = '#111827';
    ctx.font = '900 180px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(speed), 256, 260);
  } else if (svgType === 'no_entry') {
    ctx.beginPath();
    ctx.arc(256, 256, 230, 0, Math.PI * 2);
    ctx.fillStyle = '#DC2626';
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(80, 216, 352, 80);
  } else if (svgType === 'no_parking') {
    ctx.beginPath();
    ctx.arc(256, 256, 230, 0, Math.PI * 2);
    ctx.fillStyle = '#DC2626';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(256, 256, 190, 0, Math.PI * 2);
    ctx.fillStyle = '#1E40AF';
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 240px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('P', 256, 256);

    ctx.lineWidth = 36;
    ctx.strokeStyle = '#DC2626';
    ctx.beginPath();
    ctx.moveTo(110, 110);
    ctx.lineTo(402, 402);
    ctx.stroke();
  } else if (svgType === 'compulsory_keep_left') {
    ctx.beginPath();
    ctx.arc(256, 256, 230, 0, Math.PI * 2);
    ctx.fillStyle = '#1D4ED8';
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    ctx.save();
    ctx.translate(256, 256);
    ctx.rotate((-45 * Math.PI) / 180);
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(0, -120);
    ctx.lineTo(70, -30);
    ctx.lineTo(25, -30);
    ctx.lineTo(25, 120);
    ctx.lineTo(-25, 120);
    ctx.lineTo(-25, -30);
    ctx.lineTo(-70, -30);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else if (svgType === 'speed_breaker') {
    // Cautionary triangle
    ctx.beginPath();
    ctx.moveTo(256, 40);
    ctx.lineTo(480, 460);
    ctx.lineTo(32, 460);
    ctx.closePath();
    ctx.fillStyle = '#DC2626';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(256, 100);
    ctx.lineTo(430, 430);
    ctx.lineTo(82, 430);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Hump
    ctx.beginPath();
    ctx.moveTo(120, 360);
    ctx.lineTo(190, 360);
    ctx.bezierCurveTo(220, 260, 292, 260, 322, 360);
    ctx.lineTo(392, 360);
    ctx.lineWidth = 26;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#111827';
    ctx.stroke();
  } else if (svgType === 'school_ahead' || svgType === 'pedestrian_crossing') {
    // Cautionary triangle
    ctx.beginPath();
    ctx.moveTo(256, 40);
    ctx.lineTo(480, 460);
    ctx.lineTo(32, 460);
    ctx.closePath();
    ctx.fillStyle = '#DC2626';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(256, 100);
    ctx.lineTo(430, 430);
    ctx.lineTo(82, 430);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Silhouette symbol
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.arc(256, 220, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(240, 254, 32, 80);
    ctx.fillRect(224, 334, 24, 60);
    ctx.fillRect(264, 334, 24, 60);

    // Cross stripes
    ctx.fillRect(140, 400, 232, 16);
  } else if (svgType === 'hospital') {
    ctx.fillStyle = '#1D4ED8';
    ctx.roundRect(40, 40, 432, 432, 40);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.roundRect(100, 100, 312, 312, 20);
    ctx.fill();

    // Red cross
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(226, 140, 60, 140);
    ctx.fillRect(186, 180, 140, 60);

    ctx.fillStyle = '#1D4ED8';
    ctx.font = '900 80px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('H', 256, 370);
  } else {
    // Default blue informatory sign
    ctx.fillStyle = '#047857';
    ctx.roundRect(40, 40, 432, 432, 40);
    ctx.fill();
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ROAD', 256, 230);
    ctx.fillText('SIGN', 256, 290);
  }

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  textureCache.set(key, texture);
  return texture;
}
