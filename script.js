  // ---- Copy IP ----
  const SERVER_IP = 'petas.xyz';
  function copyIp(feedbackEl){
    navigator.clipboard.writeText(SERVER_IP).then(()=>{
      if(feedbackEl){
        const original = feedbackEl.innerHTML;
        feedbackEl.querySelector('span').textContent = 'Copiado!';
        setTimeout(()=>{ feedbackEl.innerHTML = original; }, 1800);
      }
    }).catch(()=>{});
  }
  document.getElementById('copyIpHero')?.addEventListener('click', function(){ copyIp(this); });
  document.getElementById('copyIpCta')?.addEventListener('click', function(){ copyIp(this); });

  const ALT_IP = 'br-ded-2.enxadahost.com:10829';
  function copyAltIp(feedbackEl){
    navigator.clipboard.writeText(ALT_IP).then(()=>{
      if(feedbackEl){
        const original = feedbackEl.innerHTML;
        feedbackEl.textContent = 'Copiado!';
        setTimeout(()=>{ feedbackEl.innerHTML = original; }, 1800);
      }
    }).catch(()=>{});
  }
  document.getElementById('copyIpAltHero')?.addEventListener('click', function(){ copyAltIp(this); });
  document.getElementById('copyIpAltCta')?.addEventListener('click', function(){ copyAltIp(this); });
  document.getElementById('ipPill')?.addEventListener('click', function(){
    navigator.clipboard.writeText(SERVER_IP).then(()=>{
      this.classList.add('copied');
      setTimeout(()=> this.classList.remove('copied'), 1600);
    }).catch(()=>{});
  });

  // ---- Live server status (mcsrvstat.us public API) ----
  async function loadStatus(){
    const dot = document.getElementById('statusDot');
    const text = document.getElementById('statusText');
    const sub = document.getElementById('statusSub');
    const players = document.getElementById('statPlayers');
    const version = document.getElementById('statVersion');

    try{
      const res = await fetch('https://api.mcsrvstat.us/3/' + SERVER_IP);
      if(!res.ok) throw new Error('offline');
      const data = await res.json();
      if(data.online){
        dot.classList.add('online');
        text.textContent = 'Servidor online';
        sub.textContent = data.ip ? (data.ip + (data.port ? ':' + data.port : '')) : '';
        players.textContent = (data.players ? (data.players.online + '/' + data.players.max) : '—');
        version.textContent = data.version ? data.version.replace(/§./g,'').slice(0,10) : '—';
      } else {
        dot.classList.add('offline');
        text.textContent = 'Servidor offline';
        sub.textContent = 'Tente novamente em instantes';
        players.textContent = '0';
        version.textContent = '—';
      }
    } catch(e){
      dot.classList.add('offline');
      text.textContent = 'Status indisponível';
      sub.textContent = 'Não foi possível consultar agora';
      players.textContent = '—'; version.textContent = '—';
    }
  }
  loadStatus();

  // ---- Leaderboard ----
  function formatPlaytime(minutes) {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }

  async function loadLeaderboard() {
    const listEl = document.getElementById('leaderboardList');
    if(!listEl) return;

    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();

      if(data.success && data.data && data.data.length > 0) {
        listEl.innerHTML = '';
        data.data.forEach((entry, index) => {
          const pos = index + 1;
          const row = document.createElement('div');
          row.className = `lb-row ${pos <= 3 ? 'top-' + pos : ''}`;
          
          const onlineBadge = entry.isOnline 
            ? '<span class="status-dot online" style="margin-left: 8px; box-shadow: 0 0 8px rgba(72,240,166,0.6);" title="Online agora!"></span>' 
            : '';

          row.innerHTML = `
            <div class="lb-pos">#${pos}</div>
            <div class="lb-player">
              <img src="https://minotar.net/helm/${entry.member}/32.png" alt="${entry.member}" loading="lazy">
              ${entry.member} ${onlineBadge}
            </div>
            <div class="lb-time">${formatPlaytime(entry.score)}</div>
          `;
          listEl.appendChild(row);
        });
      } else {
        listEl.innerHTML = '<div class="lb-empty">Nenhum dado registrado ainda. Entre no servidor para ser o primeiro!</div>';
      }
    } catch(e) {
      listEl.innerHTML = '<div class="lb-empty">Erro ao carregar o ranking. Tente novamente mais tarde.</div>';
    }
  }
  loadLeaderboard();

