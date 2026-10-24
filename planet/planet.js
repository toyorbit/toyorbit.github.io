'use strict';
(() => {
  const canvas = document.getElementById('planet');
  const ctx = canvas.getContext('2d');
  const form = document.getElementById('controls');
  const nameInput = document.getElementById('planet-name');
  const sizeInput = document.getElementById('planet-size');
  const ringInput = document.getElementById('planet-ring');
  const save = document.getElementById('save');
  const status = document.getElementById('status');
  const palettes = {
    peach: {label: '귤빛', light: '#ffdbac', mid: '#fa9b68', dark: '#6a315f', ring: '#d8b0ff'},
    violet: {label: '보랏빛', light: '#e7d8ff', mid: '#b395ed', dark: '#372758', ring: '#ffbd8d'},
    blue: {label: '별빛 파랑', light: '#c6e7ff', mid: '#69aaf2', dark: '#252c66', ring: '#d6baff'},
    pink: {label: '분홍 안개', light: '#ffdaeb', mid: '#f395bd', dark: '#682d63', ring: '#ffd3a3'}
  };
  // Stable stars keep the scene still while the visitor adjusts their planet.
  let seed = 48271;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const stars = Array.from({length: 100}, () => ({x: random() * 1200, y: random() * 1200, r: random() * 1.5 + .6, a: random() * .45 + .12}));
  function state() {
    const key = form.elements.palette.value;
    return {key, palette: palettes[key], size: Number(sizeInput.value), ring: ringInput.checked, name: nameInput.value.trim() || '이름 없는 행성'};
  }
  function ring(x, y, r, color, front) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-.39);
    ctx.strokeStyle = color; ctx.lineWidth = r * .08; ctx.globalAlpha = .78;
    ctx.beginPath(); ctx.ellipse(0, 0, r * 1.68, r * .44, 0, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = .4; ctx.lineWidth = r * .012;
    for (const scale of [1.1, 1.18]) { ctx.beginPath(); ctx.ellipse(0, 0, r * 1.68 * scale, r * .44 * scale, 0, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2); ctx.stroke(); }
    ctx.restore();
  }
  function draw() {
    const s = state(), p = s.palette, x = 600, y = 535, r = 150 + s.size * 1.15;
    ctx.clearRect(0, 0, 1200, 1200);
    ctx.fillStyle = '#0e0c22'; ctx.fillRect(0, 0, 1200, 1200);
    const nebula = ctx.createRadialGradient(600, 500, 0, 600, 500, 620);
    nebula.addColorStop(0, '#63358d35'); nebula.addColorStop(.6, '#35234d18'); nebula.addColorStop(1, '#0e0c2200');
    ctx.fillStyle = nebula; ctx.fillRect(0, 0, 1200, 1200);
    for (const star of stars) { ctx.fillStyle = `rgba(221,210,255,${star.a})`; ctx.beginPath(); ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2); ctx.fill(); }
    ctx.save(); ctx.strokeStyle = '#b99cdb18'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(x, y, 480, 325, -.39, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([3, 12]); ctx.beginPath(); ctx.arc(x, y, 440, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    if (s.ring) ring(x, y, r, p.ring, false);
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
    const surface = ctx.createRadialGradient(x - r * .5, y - r * .5, 0, x + r * .3, y + r * .2, r * 1.5);
    surface.addColorStop(0, p.light); surface.addColorStop(.45, p.mid); surface.addColorStop(1, p.dark);
    ctx.fillStyle = surface; ctx.fillRect(x-r, y-r, r*2, r*2);
    ctx.save(); ctx.translate(x, y); ctx.rotate(-.18);
    for (let i = 0; i < 18; i++) {
      const bandY = -r + i * r * .12;
      ctx.strokeStyle = i % 3 === 0 ? '#ffffff13' : '#39204c0e'; ctx.lineWidth = r * (.025 + (i % 3) * .016);
      ctx.beginPath(); ctx.moveTo(-r * 1.3, bandY); ctx.bezierCurveTo(-r * .5, bandY + r * .12, r * .6, bandY - r * .08, r * 1.3, bandY + r * .1); ctx.stroke();
    }
    ctx.restore();
    const shade = ctx.createLinearGradient(x-r, y-r, x+r, y+r);
    shade.addColorStop(0, '#ffffff00'); shade.addColorStop(.5, '#0e082000'); shade.addColorStop(1, '#0e08209c');
    ctx.fillStyle = shade; ctx.fillRect(x-r,y-r,r*2,r*2); ctx.restore();
    ctx.strokeStyle = '#ffffff22'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, r-1, 0, Math.PI*2); ctx.stroke();
    if (s.ring) ring(x, y, r, p.ring, true);
    // A small satellite and crosshair add scale without competing with the planet.
    ctx.fillStyle = p.ring; ctx.beginPath(); ctx.arc(950, 260, 6, 0, Math.PI*2); ctx.fill();
    for (const [sx,sy,sz] of [[260,285,9],[890,805,7]]) {
      ctx.strokeStyle = '#d9c2f4'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx-sz,sy); ctx.lineTo(sx+sz,sy); ctx.moveTo(sx,sy-sz); ctx.lineTo(sx,sy+sz); ctx.stroke();
    }
    ctx.textAlign = 'center'; ctx.fillStyle = '#b59acb'; ctx.font = '16px monospace'; ctx.fillText('A LITTLE WORLD BY YOU', 600, 958);
    let fontSize = 47;
    do { ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif`; if (ctx.measureText(s.name).width <= 980) break; fontSize--; } while (fontSize > 16);
    ctx.fillStyle = '#eee8ff'; ctx.fillText(s.name, 600, 1033);
    ctx.fillStyle = '#9481ac'; ctx.font = '17px monospace'; ctx.fillText('TOYORBIT  /  PLANET MAKER', 600, 1100);
    document.getElementById('size-value').value = String(s.size);
    canvas.setAttribute('aria-label', `${p.label} 행성, 크기 ${s.size}, 고리 ${s.ring ? '있음' : '없음'}. 이름: ${s.name}`);
  }
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', () => { draw(); status.textContent = 'PNG 이미지 · 1200 × 1200'; });
  document.getElementById('random').addEventListener('click', () => {
    const keys = Object.keys(palettes), key = keys[Math.floor(Math.random() * keys.length)];
    form.elements.palette.value = key;
    sizeInput.value = String(20 + Math.floor(Math.random() * 81)); ringInput.checked = Math.random() > .25;
    const first = ['졸린', '말랑한', '춤추는', '반짝이는', '수줍은', '엉뚱한'];
    const last = ['귤', '솜사탕', '궤도', '별사탕', '도넛', '복숭아'];
    nameInput.value = `${first[Math.floor(Math.random()*first.length)]} ${last[Math.floor(Math.random()*last.length)]}`;
    draw(); status.textContent = '새로운 행성을 발견했어요. 마음대로 바꿔도 좋아요!';
  });
  save.addEventListener('click', () => {
    save.disabled = true; status.textContent = '행성 이미지를 준비하고 있어요…';
    try {
      canvas.toBlob(blob => {
        if (!blob) { status.textContent = '이미지를 만들지 못했어요. 다시 시도해 주세요.'; save.disabled = false; return; }
        const url = URL.createObjectURL(blob), link = document.createElement('a');
        const safeName = state().name.replace(/[\u0000-\u001f\u007f<>:"/\\|?*]/g, '').replace(/^[.\s]+|[.\s]+$/g, '').slice(0, 60) || 'my-planet';
        link.href = url; link.download = `toyorbit-${safeName}.png`; document.body.appendChild(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        status.textContent = 'PNG 저장을 요청했어요. 다운로드 목록을 확인해 주세요.'; save.disabled = false;
      }, 'image/png');
    } catch (_) { save.disabled = false; status.textContent = '저장하지 못했어요. 브라우저의 다운로드 설정을 확인해 주세요.'; }
  });
  document.getElementById('year').textContent = new Date().getFullYear(); draw();
})();
