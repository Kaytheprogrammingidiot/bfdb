import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  const { code } = req.query;

  // Find room
  const { data: room } = await supabase
    .from("rooms")
    .select("id")
    .eq("code", code)
    .single();

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  const { data, error } = await supabase
    .from("player_state")
    .select("player_id, x, y, state, updated_at")
    .eq("room_id", room.id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
}
