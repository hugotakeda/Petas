import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    // Busca os Top 10 jogadores no banco de dados KV (do maior para o menor)
    const leaderboard = await kv.zrange('leaderboard:playtime', 0, 9, {
      rev: true, // reverse (maior para o menor)
      withScores: true // traz a pontuação junto
    });

    // Busca quem está online agora para a bolinha verde
    let onlinePlayers = [];
    try {
      const mcRes = await fetch('https://api.mcsrvstat.us/3/petas.xyz');
      const mcData = await mcRes.json();
      if (mcData.online && mcData.players && mcData.players.list) {
        onlinePlayers = mcData.players.list.map(p => typeof p === 'string' ? p.toLowerCase() : p.name.toLowerCase());
      }
    } catch(err) {
      // Ignora erro se a API do mcsrvstat falhar
    }

    // O formato retornado pelo KV é um array plano: ["takemba", 5, "jogador2", 3]
    const formattedData = [];
    for (let i = 0; i < leaderboard.length; i += 2) {
      const playerName = String(leaderboard[i]);
      formattedData.push({
        member: playerName,
        score: Number(leaderboard[i + 1]),
        isOnline: onlinePlayers.includes(playerName.toLowerCase())
      });
    }

    return res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    console.error('Leaderboard Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

