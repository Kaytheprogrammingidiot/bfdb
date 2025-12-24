import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { code, playerId } = req.body;

  // Get room
  const { data: room } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", code)
    .single();

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  // Count players
  const { count } = await supabase
    .from("room_players")
    .select("*", { count: "exact", head: true })
    .eq("room_id", room.id);

  if (count >= room.max_players) {
    return res.status(403).json({ error: "Room is full" });
  }

  // Join
  const { error } = await supabase
    .from("room_players")
    .insert({
      room_id: room.id,
      player_id: playerId
    });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({
    success: true,
    roomId: room.id,
    code: room.code
  });
}
