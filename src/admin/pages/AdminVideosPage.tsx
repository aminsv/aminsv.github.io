import { useCallback, useState } from 'react'
import { useAdminAuthContext } from '../context/AdminAuthContext'
import { useVideosStore } from '../hooks/useVideosStore'
import type { Video } from '../../types/contentTypes'

const NOEMBED_URL = 'https://noembed.com/embed'

/** Fetch title and thumbnail from YouTube via noembed.com. Description is not available from oEmbed. */
async function fetchYouTubeMeta(
  videoUrl: string,
): Promise<{ title: string; thumbnail?: string }> {
  const res = await fetch(
    `${NOEMBED_URL}?url=${encodeURIComponent(videoUrl.trim())}`,
  )
  if (!res.ok) throw new Error('Could not fetch video details')
  const data = (await res.json()) as {
    title?: string
    thumbnail_url?: string
    [key: string]: unknown
  }
  const title = typeof data.title === 'string' ? data.title : ''
  if (!title) throw new Error('No title in response')
  const thumbnail =
    typeof data.thumbnail_url === 'string' ? data.thumbnail_url : undefined
  return { title, thumbnail }
}

/** Extract YouTube video ID from URL (youtube.com/watch?v=ID or youtu.be/ID). */
function parseYouTubeId(url: string): string | null {
  if (!url.trim()) return null
  try {
    const u = new URL(url.trim())
    if (u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com') {
      return u.searchParams.get('v')
    }
    if (u.hostname === 'youtu.be') {
      return u.pathname.slice(1).split('/')[0] || null
    }
  } catch {
    // invalid URL
  }
  return null
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

export function AdminVideosPage() {
  const { token } = useAdminAuthContext()
  const store = useVideosStore(token)

  if (store.loading) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8">
        <p className="text-sm text-slate-400">Loading videos…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Videos</h2>
          <p className="mt-1 text-sm text-slate-400">
            YouTube videos only. Stored in{' '}
            <code className="rounded bg-slate-800 px-1">data/videos.json</code>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={store.add}
            className="rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            + Add video
          </button>
          <button
            type="button"
            onClick={store.persist}
            disabled={store.saving}
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
          >
            {store.saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {store.error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-rose-800 bg-rose-950/40 p-3 text-sm text-rose-400">
          <span>{store.error}</span>
          <button
            type="button"
            onClick={store.reload}
            className="shrink-0 rounded px-2 py-1 text-xs font-medium text-rose-200 hover:bg-rose-900/60"
          >
            Reload
          </button>
        </div>
      )}
      {store.success && (
        <p className="rounded-lg border border-emerald-800 bg-emerald-950/40 p-3 text-sm text-emerald-400">
          {store.success}
        </p>
      )}

      <div className="space-y-4">
        {store.items.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onUpdate={(u) => store.update(video.id, u)}
            onRemove={() => store.remove(video.id)}
          />
        ))}
        {store.items.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
            No videos yet. Click &quot;Add video&quot; and paste a YouTube URL.
          </p>
        )}
      </div>
    </div>
  )
}

function VideoCard({
  video,
  onUpdate,
  onRemove,
}: {
  video: Video
  onUpdate: (u: Partial<Pick<Video, 'title' | 'videoUrl' | 'thumbnail'>>) => void
  onRemove: () => void
}) {
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const youtubeId = parseYouTubeId(video.videoUrl)
  const canFetch = Boolean(youtubeId && video.videoUrl.trim())
  const urlError =
    video.videoUrl.trim() && !youtubeId
      ? 'Enter a valid YouTube URL (youtube.com/watch?v=… or youtu.be/…)'
      : null

  const fetchMeta = useCallback(async () => {
    if (!canFetch) return
    setFetching(true)
    setFetchError(null)
    try {
      const { title, thumbnail } = await fetchYouTubeMeta(video.videoUrl)
      onUpdate({ title, thumbnail })
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Could not fetch details')
    } finally {
      setFetching(false)
    }
  }, [canFetch, video.videoUrl, onUpdate])

  const handleUrlChange = (value: string) => {
    setFetchError(null)
    onUpdate({ videoUrl: value })
  }

  const handleUrlBlur = () => {
    if (canFetch && !video.title.trim() && !fetching) void fetchMeta()
  }

  const showFetchForm = !video.title.trim()
  const showDetails = youtubeId && (video.title || fetching)

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {showFetchForm && (
            <div>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Paste YouTube URL (youtube.com/watch?v=… or youtu.be/…)"
                  className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  value={video.videoUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  onBlur={handleUrlBlur}
                />
                <button
                  type="button"
                  onClick={fetchMeta}
                  disabled={!canFetch || fetching}
                  className="shrink-0 rounded-md border border-slate-600 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {fetching ? 'Fetching…' : 'Fetch'}
                </button>
              </div>
              {urlError && (
                <p className="mt-1 text-xs text-rose-400">{urlError}</p>
              )}
              {fetchError && (
                <p className="mt-1 text-xs text-amber-400">{fetchError}</p>
              )}
            </div>
          )}
          {showDetails && (
            <div className="space-y-3">
              <div className="flex gap-3">
                {video.thumbnail && (
                  <img
                    src={video.thumbnail}
                    alt=""
                    className="h-20 w-36 shrink-0 rounded border border-slate-700 object-cover"
                  />
                )}
                <div className="min-w-0 flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="Video title"
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                    value={video.title}
                    onChange={(e) => onUpdate({ title: e.target.value })}
                  />
                  {video.videoUrl && (
                    <p className="truncate text-xs text-slate-500">
                      {video.videoUrl}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          <p className="text-[11px] text-slate-500">
            Updated {formatDate(video.updatedAt)}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-800 hover:text-rose-400"
          aria-label="Remove video"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
