import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { code, playerId, x, y, state } = req.body;

  // Find room
  const { data: room } = await supabase
    .from("rooms")
    .select("id")
    .eq("code", code)
    .single();

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  // Upsert state
  const { error } = await supabase
    .from("player_state")
    .upsert({
      room_id: room.id,
      player_id: playerId,
      x,
      y,
      state,
      updated_at: new Date()
    });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ ok: true });
}
