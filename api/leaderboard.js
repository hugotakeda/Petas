import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    // Busca os Top 10 jogadores no banco de dados KV (do maior para o menor)
    const leaderboard = await kv.zrange('leaderboard:playtime', 0, 9, {
      rev: true, // reverse (maior para o menor)
      withScores: true // traz a pontuação junto
    });

    // O formato retornado pode variar, então normalizamos para a resposta
    // [{score: 5, member: "Notch"}]
    return res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    console.error('Leaderboard Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
