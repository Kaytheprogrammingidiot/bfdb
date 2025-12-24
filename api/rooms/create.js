import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { maxPlayers } = req.body;

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  const { data, error } = await supabase
    .from("rooms")
    .insert({ code, max_players: maxPlayers })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({
    roomId: data.id,
    code: data.code,
    maxPlayers: data.max_players
  });
}
