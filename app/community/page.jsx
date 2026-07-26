"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useEdgeStore } from "@/lib/edgestore";
import { useGlobalContext } from "../context/context";
import ShareMenu from "../component/ShareMenu";

const emptyDraft = { title: "", caption: "", media: [] };
const formatDate = (date) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));

export default function CommunityPage() {
  const { userData, setOpenSidebar } = useGlobalContext();
  const { edgestore } = useEdgeStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("active");
  const [period, setPeriod] = useState("all");
  const [value, setValue] = useState("7");
  const [draft, setDraft] = useState(emptyDraft);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [commentText, setCommentText] = useState({});
  const isAdmin = userData?.userType === "admin";

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ view, period });
      if (period !== "all") params.set("value", value);
      if (userData?.email) params.set("viewer", userData.email);
      const response = await fetch(`/api/community?${params}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setPosts(data);
    } catch (error) { toast.error(error.message || "Could not load posts"); }
    setLoading(false);
  };

  useEffect(() => { loadPosts(); }, [view, period, value, userData?.email]);

  const uploadMedia = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(files.map(async (file) => {
        const result = await edgestore.publicFiles.upload({ file });
        return { url: result.url, title: file.name, type: file.type.startsWith("video") ? "video" : "image" };
      }));
      setDraft((current) => ({ ...current, media: [...current.media, ...uploaded] }));
    } catch { toast.error("Media upload failed"); }
    setUploading(false);
    event.target.value = "";
  };

  const publish = async (event) => {
    event.preventDefault();
    if (!draft.title.trim()) return toast.error("Add a clear title for this update");
    const response = await fetch(editing ? `/api/community/${editing}` : "/api/community", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, email: userData.email }),
    });
    const data = await response.json();
    if (!response.ok) return toast.error(data.message || "Could not save post");
    toast.success(editing ? "Post updated" : "Post published for seven days");
    setDraft(emptyDraft); setEditing(null); loadPosts();
  };

  const interact = async (id, action, extra = {}) => {
    if (!userData?.email) return toast.error("Please log in to interact with community posts");
    const response = await fetch(`/api/community/${id}/interactions`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, email: userData.email, ...extra }),
    });
    const data = await response.json();
    if (!response.ok) return toast.error(data.message || "Could not update post");
    if (action === "comment") setCommentText((current) => ({ ...current, [id]: "" }));
    loadPosts();
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this community post? This cannot be undone.")) return;
    const response = await fetch(`/api/community/${id}?email=${encodeURIComponent(userData.email)}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) return toast.error(data.message || "Could not delete post");
    toast.success("Post deleted"); loadPosts();
  };

  const share = async (post) => {
    const url = `${window.location.origin}/community`;
    const text = `${post.title} — PanchayatX Community`;
    try {
      if (navigator.share) await navigator.share({ title: post.title, text, url });
      else { await navigator.clipboard.writeText(`${text}\n${url}`); toast.success("Post link copied"); }
    } catch (error) { if (error.name !== "AbortError") toast.error("Could not share this post"); }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-cream px-4 py-6 sm:px-8 sm:py-8" onClick={() => setOpenSidebar(false)}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted">Village updates</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">Community</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Official news, development updates and meeting moments from your Panchayat. New posts stay on the community feed for seven days.</p>
          </div>
          <div className="flex rounded-lg border border-line bg-paper p-1 text-sm">
            <button onClick={() => setView("active")} className={`rounded-md px-3 py-2 font-medium transition-colors ${view === "active" ? "bg-ink text-white" : "text-muted hover:bg-mist"}`}>This week</button>
            <button onClick={() => setView("all")} className={`rounded-md px-3 py-2 font-medium transition-colors ${view === "all" ? "bg-ink text-white" : "text-muted hover:bg-mist"}`}>All posts</button>
          </div>
        </div>

        {view === "all" && <div className="mb-6 flex flex-wrap items-center gap-3 rounded-card border border-line bg-paper p-4">
          <span className="text-sm font-medium text-ink">Show posts from</span>
          <select value={period} onChange={(event) => setPeriod(event.target.value)} className="ds-input w-auto py-2">
            <option value="all">All time</option><option value="days">Last days</option><option value="months">Last months</option><option value="years">Last years</option>
          </select>
          {period !== "all" && <input value={value} onChange={(event) => setValue(event.target.value.replace(/\D/g, "") || "1")} type="number" min="1" className="ds-input w-24 py-2" aria-label="Period amount" />}
        </div>}

        {isAdmin && <form onSubmit={publish} className="mb-8 overflow-hidden rounded-card border border-line bg-paper">
          <div className="border-b border-line px-5 py-4"><h2 className="font-semibold text-ink">{editing ? "Edit community post" : "Publish an official update"}</h2><p className="mt-1 text-sm text-muted">Only system administrators can publish. Visibility ends automatically after seven days.</p></div>
          <div className="grid gap-4 p-5 sm:grid-cols-2"><input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="ds-input" placeholder="Update title" maxLength="120" required /><textarea value={draft.caption} onChange={(event) => setDraft({ ...draft, caption: event.target.value })} className="ds-input min-h-24 resize-y sm:col-span-2" placeholder="What should villagers know?" maxLength="3000" />
            <label className="flex min-h-24 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line bg-cream px-4 text-center text-sm text-muted transition-colors hover:bg-mist sm:col-span-2"><span>{uploading ? "Uploading media…" : "Add photos or videos"}</span><input type="file" accept="image/*,video/*" multiple className="hidden" onChange={uploadMedia} disabled={uploading} /></label>
            {draft.media.length > 0 && <div className="grid grid-cols-3 gap-3 sm:col-span-2">{draft.media.map((item, index) => <div key={`${item.url}-${index}`} className="relative overflow-hidden rounded-lg bg-mist"><button type="button" onClick={() => setDraft({ ...draft, media: draft.media.filter((_, i) => i !== index) })} className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-sm text-white" aria-label="Remove media">×</button>{item.type === "video" ? <video src={item.url} className="h-24 w-full object-cover" /> : <img src={item.url} alt="Selected upload" className="h-24 w-full object-cover" />}</div>)}</div>}
          </div>
          <div className="flex gap-3 border-t border-line px-5 py-4"><button className="btn-primary text-sm" disabled={uploading}>{editing ? "Save changes" : "Publish post"}</button>{editing && <button type="button" onClick={() => { setEditing(null); setDraft(emptyDraft); }} className="btn-ghost px-4 py-2 text-sm">Cancel</button>}</div>
        </form>}

        <section className="mx-auto max-w-2xl space-y-6" aria-live="polite">
          {loading ? <div className="space-y-4">{[1, 2].map((item) => <div key={item} className="h-72 animate-pulse rounded-card bg-mist" />)}</div> : posts.length === 0 ? <div className="rounded-card border border-dashed border-line bg-paper px-6 py-14 text-center"><h2 className="font-semibold text-ink">No posts here yet</h2><p className="mt-2 text-sm text-muted">{view === "active" ? "Check back for the next official village update." : "Try widening your time filter."}</p></div> : posts.map((post) => <article key={post._id} className="overflow-hidden rounded-card border border-line bg-paper">
            <header className="flex items-start gap-3 px-5 py-4"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">PX</div><div className="min-w-0"><p className="font-medium text-ink">PanchayatX <span className="text-muted">• Official</span></p><p className="mt-0.5 text-xs text-muted">{formatDate(post.createdAt)} {view === "active" && `· visible until ${formatDate(post.expiresAt)}`}</p></div>{isAdmin && <div className="ml-auto flex gap-2"><button onClick={() => { setEditing(post._id); setDraft({ title: post.title, caption: post.caption, media: post.media || [] }); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-sm font-medium text-ink hover:underline">Edit</button><button onClick={() => deletePost(post._id)} className="text-sm font-medium text-red-700 hover:underline">Delete</button></div>}</header>
            {post.media?.length > 0 && <div className={`grid gap-px bg-line ${post.media.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>{post.media.map((media, index) => media.type === "video" ? <video key={index} src={media.url} controls className="aspect-square w-full bg-ink object-cover" /> : <img key={index} src={media.url} alt={media.title || post.title} className="aspect-square w-full object-cover" />)}</div>}
            <div className="px-5 py-4"><h2 className="text-lg font-semibold text-ink">{post.title}</h2>{post.caption && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink">{post.caption}</p>}<div className="mt-4 flex items-center gap-5 border-y border-line py-3 text-sm"><button onClick={() => interact(post._id, "like")} className="font-medium text-ink hover:text-black">{post.likedByMe ? "♥" : "♡"} Like <span className="ml-1 text-muted">{post.likeCount}</span></button><span className="text-muted">{post.comments.length} comments</span><ShareMenu post={post} /></div>
              <div className="mt-4 space-y-4">{post.comments.map((comment) => <div key={comment._id} className="flex gap-3"><img src={comment.user.profile || "/panchayatx-logo.png"} alt="" className="h-8 w-8 rounded-full border border-line object-cover" /><div className="min-w-0 flex-1"><p className="text-sm text-ink"><span className="font-semibold">{comment.user.name || comment.user.username}</span> <span className="text-muted">@{comment.user.username || "villager"}</span></p><p className="mt-1 text-sm text-ink">{comment.body}</p></div>{isAdmin && <button onClick={() => interact(post._id, "delete-comment", { commentId: comment._id })} className="text-xs text-red-700 hover:underline">Remove</button>}</div>)}</div>
              <div className="mt-4 flex gap-2"><input value={commentText[post._id] || ""} onChange={(event) => setCommentText({ ...commentText, [post._id]: event.target.value })} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); interact(post._id, "comment", { body: commentText[post._id] }); } }} className="ds-input py-2" placeholder={userData?.email ? "Add a comment…" : "Log in to comment"} disabled={!userData?.email} /><button onClick={() => interact(post._id, "comment", { body: commentText[post._id] })} disabled={!userData?.email || !commentText[post._id]?.trim()} className="btn-primary px-4 py-2 text-sm">Post</button></div>
            </div>
          </article>)}</section>
      </div>
    </main>
  );
}
