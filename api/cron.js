import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    // 1. Busca os dados do servidor
    const response = await fetch('https://api.mcsrvstat.us/3/petas.xyz');
    const data = await response.json();

    // 2. Verifica se o servidor está online e se tem jogadores
    if (data.online && data.players && data.players.list && data.players.list.length > 0) {
      const pipeline = kv.pipeline();
      
      // 3. Para cada jogador, adiciona 5 minutos no banco (o cron roda a cada 5 min)
      for (const player of data.players.list) {
        const playerName = typeof player === 'string' ? player : player.name;
        // zIncrBy(key, increment, member)
        pipeline.zincrby('leaderboard:playtime', 5, playerName);
      }
      
      await pipeline.exec();
      return res.status(200).json({ success: true, message: `Atualizou o tempo de ${data.players.list.length} jogadores.` });
    } else {
      return res.status(200).json({ success: true, message: 'Nenhum jogador online no momento.' });
    }
  } catch (error) {
    console.error('Cron Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
