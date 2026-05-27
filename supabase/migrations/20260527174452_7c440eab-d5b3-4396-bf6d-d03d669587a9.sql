
-- Rooms
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);
GRANT SELECT, INSERT, UPDATE ON public.rooms TO anon, authenticated;
GRANT ALL ON public.rooms TO service_role;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rooms readable by all" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "rooms insertable by all" ON public.rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "rooms updatable by all" ON public.rooms FOR UPDATE USING (true);

-- Room state (one per room)
CREATE TABLE public.room_state (
  room_id UUID PRIMARY KEY REFERENCES public.rooms(id) ON DELETE CASCADE,
  current_track_id TEXT,
  playback_position_seconds DOUBLE PRECISION NOT NULL DEFAULT 0,
  is_playing BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.room_state TO anon, authenticated;
GRANT ALL ON public.room_state TO service_role;
ALTER TABLE public.room_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "room_state readable by all" ON public.room_state FOR SELECT USING (true);
CREATE POLICY "room_state insertable by all" ON public.room_state FOR INSERT WITH CHECK (true);
CREATE POLICY "room_state updatable by all" ON public.room_state FOR UPDATE USING (true);
CREATE POLICY "room_state deletable by all" ON public.room_state FOR DELETE USING (true);

-- Participants
CREATE TABLE public.participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_participants_room ON public.participants(room_id);
GRANT SELECT, INSERT, DELETE ON public.participants TO anon, authenticated;
GRANT ALL ON public.participants TO service_role;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "participants readable by all" ON public.participants FOR SELECT USING (true);
CREATE POLICY "participants insertable by all" ON public.participants FOR INSERT WITH CHECK (true);
CREATE POLICY "participants deletable by all" ON public.participants FOR DELETE USING (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_state;
ALTER PUBLICATION supabase_realtime ADD TABLE public.participants;
ALTER TABLE public.room_state REPLICA IDENTITY FULL;
ALTER TABLE public.participants REPLICA IDENTITY FULL;
