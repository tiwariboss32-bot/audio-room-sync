-- User-uploaded tracks for rooms
CREATE TABLE public.tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT NOT NULL DEFAULT 'Unknown',
  path TEXT NOT NULL,
  duration DOUBLE PRECISION,
  uploaded_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_tracks_room ON public.tracks(room_id);
GRANT SELECT, INSERT, DELETE ON public.tracks TO anon, authenticated;
GRANT ALL ON public.tracks TO service_role;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tracks readable by all" ON public.tracks FOR SELECT USING (true);
CREATE POLICY "tracks insertable by all" ON public.tracks FOR INSERT WITH CHECK (true);
CREATE POLICY "tracks deletable by all" ON public.tracks FOR DELETE USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.tracks;
ALTER TABLE public.tracks REPLICA IDENTITY FULL;
