import { useState, useRef } from "react";
import { uploadTrack } from "@/lib/api/upload.functions";

interface Props {
  roomId: string;
  uploadedBy: string;
  onUploaded: () => void;
}

export function UploadTrack({ roomId, uploadedBy, onUploaded }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setUploading(true);
    setError(null);
    try {
      const base64 = await fileToBase64(file);
      await uploadTrack({
        data: {
          roomId,
          fileBase64: base64,
          fileName: file.name,
          title: title.trim(),
          artist: artist.trim() || "Unknown",
          uploadedBy,
        },
      });
      setOpen(false);
      setTitle("");
      setArtist("");
      setFile(null);
      onUploaded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-dashed border-border/60 bg-secondary/20 px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition flex items-center justify-center gap-2"
      >
        <UploadIcon />
        Upload a track
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md mx-4 rounded-3xl border border-border/60 bg-card p-6 shadow-xl"
          >
            <h3 className="text-lg font-bold mb-1">Upload a track</h3>
            <p className="text-xs text-muted-foreground mb-5">
              This MP3 will be available to everyone in the room.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  MP3 file
                </label>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".mp3,audio/mpeg"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-mint file:text-primary-foreground file:font-medium file:cursor-pointer hover:file:brightness-110 text-muted-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Track title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                  placeholder="My awesome track"
                  className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-mint focus:ring-2 focus:ring-mint/30 transition"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Artist (optional)
                </label>
                <input
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  maxLength={200}
                  placeholder="Artist name"
                  className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-mint focus:ring-2 focus:ring-mint/30 transition"
                />
              </div>
            </div>

            {error && (
              <p className="mt-3 text-xs text-destructive">{error}</p>
            )}

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border border-border/60 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/40 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!file || !title.trim() || uploading}
                className="flex-1 rounded-xl bg-mint py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
              >
                {uploading ? "Uploading…" : "Upload"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
