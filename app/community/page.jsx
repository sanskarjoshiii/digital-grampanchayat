"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useEdgeStore } from "@/lib/edgestore";
import { useGlobalContext } from "../context/context";
import ShareMenu from "../component/ShareMenu";
import Dropdown from "../component/Dropdown";
import { avatarSrc } from "../utils/avatar";
import PollComposer from "../component/PollComposer";
import PollCard from "../component/PollCard";
import UserPeek from "../component/UserPeek";

const emptyDraft = { title: "", caption: "", media: [], poll: null };

const RANGES = [
  { value: "all", label: "All time" },
  { value: "today", label: "Last 24 hours" },
  { value: "week", label: "Last week" },
  { value: "month", label: "Last month" },
  { value: "quarter", label: "Last 3 months" },
  { value: "halfyear", label: "Last 6 months" },
  { value: "year", label: "Last year" },
  { value: "custom", label: "Custom (days)" },
];

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "most-liked", label: "Most liked" },
  { value: "least-liked", label: "Least liked" },
  { value: "most-discussed", label: "Most commented" },
];

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(date)
  );

export default function CommunityPage() {
  const { userData, setOpenSidebar } = useGlobalContext();
  const { edgestore } = useEdgeStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("active");
  const [range, setRange] = useState("all");
  const [days, setDays] = useState("7");
  const [sort, setSort] = useState("newest");
  const [draft, setDraft] = useState(emptyDraft);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [busy, setBusy] = useState({});
  const [expanded, setExpanded] = useState({});
  const [peek, setPeek] = useState(null);
  const isAdmin = userData?.userType === "admin";
  // Guards against a slow filter response overwriting a newer one.
  const requestId = useRef(0);

  const loadPosts = useCallback(async () => {
    const ticket = ++requestId.current;
    setLoading(true);
    try {
      const params = new URLSearchParams({ view, range, sort });
      if (range === "custom") params.set("days", days || "1");
      if (userData?.email) params.set("viewer", userData.email);
      const response = await fetch(`/api/community?${params}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      if (ticket === requestId.current) setPosts(data);
    } catch (error) {
      if (ticket === requestId.current) toast.error(error.message || "Could not load posts");
    }
    if (ticket === requestId.current) setLoading(false);
  }, [view, range, days, sort, userData?.email]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Swap a single card in place. Nothing else re-renders, so the page keeps its
  // scroll position and no skeleton ever flashes over the feed.
  const replacePost = (id, next) =>
    setPosts((current) => current.map((post) => (post._id === id ? next : post)));

  const patchPost = (id, update) =>
    setPosts((current) => current.map((post) => (post._id === id ? update(post) : post)));

  const interact = async (id, action, extra = {}) => {
    const response = await fetch(`/api/community/${id}/interactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, email: userData.email, ...extra }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Could not update post");
    return data.post;
  };

  const requireLogin = () => {
    if (userData?.email) return true;
    toast.error("Please log in to interact with community posts");
    return false;
  };

  const toggleLike = async (post) => {
    if (!requireLogin()) return;
    // Optimistic: the heart responds instantly, the server confirms the count.
    patchPost(post._id, (current) => ({
      ...current,
      likedByMe: !current.likedByMe,
      likeCount: current.likeCount + (current.likedByMe ? -1 : 1),
    }));
    try {
      replacePost(post._id, await interact(post._id, "like"));
    } catch (error) {
      replacePost(post._id, post);
      toast.error(error.message);
    }
  };

  const vote = async (post, optionId) => {
    if (!requireLogin() || busy[post._id]) return;
    setBusy((current) => ({ ...current, [post._id]: true }));
    try {
      replacePost(post._id, await interact(post._id, "vote", { optionId }));
    } catch (error) {
      toast.error(error.message);
    }
    setBusy((current) => ({ ...current, [post._id]: false }));
  };

  const submitComment = async (post) => {
    if (!requireLogin()) return;
    const body = (commentText[post._id] || "").trim();
    if (!body) return;
    try {
      replacePost(post._id, await interact(post._id, "comment", { body }));
      setCommentText((current) => ({ ...current, [post._id]: "" }));
      setExpanded((current) => ({ ...current, [post._id]: true }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeComment = async (post, commentId) => {
    try {
      replacePost(post._id, await interact(post._id, "delete-comment", { commentId }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const uploadMedia = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const result = await edgestore.publicFiles.upload({ file });
          return {
            url: result.url,
            title: file.name,
            type: file.type.startsWith("video") ? "video" : "image",
          };
        })
      );
      setDraft((current) => ({ ...current, media: [...current.media, ...uploaded] }));
    } catch {
      toast.error("Media upload failed");
    }
    setUploading(false);
    event.target.value = "";
  };

  const publish = async (event) => {
    event.preventDefault();
    if (!draft.title.trim()) return toast.error("Add a clear title for this update");
    if (draft.poll) {
      const filled = draft.poll.options.filter((option) => option.text.trim());
      if (!draft.poll.question.trim() || filled.length < 2)
        return toast.error("A poll needs a question and at least two options");
    }
    const response = await fetch(editing ? `/api/community/${editing}` : "/api/community", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, email: userData.email }),
    });
    const data = await response.json();
    if (!response.ok) return toast.error(data.message || "Could not save post");
    toast.success(editing ? "Post updated" : "Post published for seven days");
    if (editing) replacePost(editing, data.post);
    setDraft(emptyDraft);
    setEditing(null);
    if (!editing) loadPosts();
  };

  const startEditing = (post) => {
    setEditing(post._id);
    setDraft({
      title: post.title,
      caption: post.caption,
      media: post.media || [],
      // Options carry their _id back so the server keeps the votes on them.
      poll: post.poll
        ? {
            question: post.poll.question,
            allowMultiple: post.poll.allowMultiple,
            options: post.poll.options.map((option) => ({ _id: option._id, text: option.text })),
          }
        : null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this community post? This cannot be undone.")) return;
    const response = await fetch(
      `/api/community/${id}?email=${encodeURIComponent(userData.email)}`,
      { method: "DELETE" }
    );
    const data = await response.json();
    if (!response.ok) return toast.error(data.message || "Could not delete post");
    toast.success("Post deleted");
    setPosts((current) => current.filter((post) => post._id !== id));
  };

  return (
    <main
      className="min-h-[calc(100vh-4rem)] bg-cream px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
      onClick={() => setOpenSidebar(false)}
    >
      <div className="mx-auto max-w-5xl">
        {/* No page title or blurb: the section name is in the top nav and the
            explanation is in the help panel. */}
        <div className="mb-6 flex justify-end">
          <div className="flex rounded-lg border border-line bg-paper p-1 text-sm">
            <button
              onClick={() => setView("active")}
              className={`rounded-md px-3 py-2 font-medium transition-colors ${view === "active" ? "bg-ink text-white" : "text-muted hover:bg-mist"}`}
            >
              This week
            </button>
            <button
              onClick={() => setView("all")}
              className={`rounded-md px-3 py-2 font-medium transition-colors ${view === "all" ? "bg-ink text-white" : "text-muted hover:bg-mist"}`}
            >
              All posts
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-end gap-4 rounded-card border border-line bg-paper p-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              Posted within
            </span>
            <Dropdown
              value={range}
              options={RANGES}
              onChange={setRange}
              ariaLabel="Posted within"
            />
          </div>

          {range === "custom" && (
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">Days</span>
              <input
                value={days}
                onChange={(event) => setDays(event.target.value.replace(/\D/g, ""))}
                onBlur={() => !days && setDays("1")}
                type="number"
                min="1"
                className="ds-input w-24 py-2"
              />
            </label>
          )}

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">Sort by</span>
            <Dropdown value={sort} options={SORTS} onChange={setSort} ariaLabel="Sort by" />
          </div>

          {(range !== "all" || sort !== "newest") && (
            <button
              onClick={() => {
                setRange("all");
                setSort("newest");
              }}
              className="ml-auto text-sm font-medium text-ink hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {isAdmin && (
          <form onSubmit={publish} className="mb-8 overflow-hidden rounded-card border border-line bg-paper">
            <div className="border-b border-line px-5 py-4">
              <h2 className="font-semibold text-ink">
                {editing ? "Edit community post" : "Publish an official update"}
              </h2>
              <p className="mt-1 text-sm text-muted">
                Only system administrators can publish. Visibility ends automatically after seven
                days.
              </p>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <input
                value={draft.title}
                onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                className="ds-input"
                placeholder="Update title"
                maxLength="120"
                required
              />
              <textarea
                value={draft.caption}
                onChange={(event) => setDraft({ ...draft, caption: event.target.value })}
                className="ds-input min-h-24 resize-y sm:col-span-2"
                placeholder="What should villagers know?"
                maxLength="3000"
              />
              <label className="flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line bg-cream px-4 text-center text-sm text-muted transition-colors hover:bg-mist sm:col-span-2">
                <img
                  src="https://img.icons8.com/ios/50/1f1f1f/image--v1.png"
                  width={16}
                  height={16}
                  alt=""
                />
                <span>{uploading ? "Uploading media…" : "Add photos or videos"}</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={uploadMedia}
                  disabled={uploading}
                />
              </label>
              {draft.media.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:col-span-2">
                  {draft.media.map((item, index) => (
                    <div key={`${item.url}-${index}`} className="relative overflow-hidden rounded-lg bg-mist">
                      <button
                        type="button"
                        onClick={() =>
                          setDraft({ ...draft, media: draft.media.filter((_, i) => i !== index) })
                        }
                        className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-sm text-white"
                        aria-label="Remove media"
                      >
                        ×
                      </button>
                      {item.type === "video" ? (
                        <video src={item.url} className="h-24 w-full object-cover" />
                      ) : (
                        <img src={item.url} alt="Selected upload" className="h-24 w-full object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              )}
              <PollComposer poll={draft.poll} onChange={(poll) => setDraft({ ...draft, poll })} />
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button className="btn-primary text-sm" disabled={uploading}>
                {editing ? "Save changes" : "Publish post"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setDraft(emptyDraft);
                  }}
                  className="btn-ghost px-4 py-2 text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        <section className="mx-auto max-w-2xl space-y-6" aria-live="polite">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div key={item} className="h-72 animate-pulse rounded-card bg-mist" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-card border border-dashed border-line bg-paper px-6 py-14 text-center">
              <h2 className="font-semibold text-ink">No posts here yet</h2>
              <p className="mt-2 text-sm text-muted">
                {view === "active"
                  ? "Check back for the next official village update."
                  : "Try widening your time filter."}
              </p>
            </div>
          ) : (
            posts.map((post) => {
              const comments = post.comments || [];
              const showAll = expanded[post._id] || comments.length <= 3;
              const visible = showAll ? comments : comments.slice(-3);
              return (
                <article key={post._id} className="overflow-hidden rounded-card border border-line bg-paper">
                  <header className="flex items-start gap-3 px-5 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                      PX
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-ink">
                        PanchayatX <span className="text-muted">• Official</span>
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {formatDate(post.createdAt)}{" "}
                        {view === "active" && `· visible until ${formatDate(post.expiresAt)}`}
                      </p>
                    </div>
                    {isAdmin && (
                      <div className="ml-auto flex gap-2">
                        <button
                          onClick={() => startEditing(post)}
                          className="text-sm font-medium text-ink hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deletePost(post._id)}
                          className="text-sm font-medium text-red-700 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </header>

                  {post.media?.length > 0 && (
                    <div className={`grid gap-px bg-line ${post.media.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                      {post.media.map((media, index) =>
                        media.type === "video" ? (
                          <video
                            key={index}
                            src={media.url}
                            controls
                            className="aspect-square w-full bg-ink object-cover"
                          />
                        ) : (
                          <img
                            key={index}
                            src={media.url}
                            alt={media.title || post.title}
                            className="aspect-square w-full object-cover"
                          />
                        )
                      )}
                    </div>
                  )}

                  <div className="px-5 py-4">
                    <h2 className="text-lg font-semibold text-ink">{post.title}</h2>
                    {post.caption && (
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink">{post.caption}</p>
                    )}

                    {post.poll && (
                      <PollCard
                        poll={post.poll}
                        onVote={(optionId) => vote(post, optionId)}
                        canVote={!!userData?.email}
                        pending={!!busy[post._id]}
                      />
                    )}

                    <div className="mt-4 flex items-center gap-5 border-y border-line py-3 text-sm">
                      <button
                        onClick={() => toggleLike(post)}
                        className="font-medium text-ink transition-colors hover:text-black"
                        aria-pressed={post.likedByMe}
                      >
                        {post.likedByMe ? "♥" : "♡"} Like{" "}
                        <span className="ml-1 tabular-nums text-muted">{post.likeCount}</span>
                      </button>
                      <span className="text-muted">{comments.length} comments</span>
                      <ShareMenu post={post} />
                    </div>

                    {!showAll && (
                      <button
                        onClick={() => setExpanded((current) => ({ ...current, [post._id]: true }))}
                        className="mt-3 text-sm font-medium text-muted hover:text-ink hover:underline"
                      >
                        View all {comments.length} comments
                      </button>
                    )}

                    <div className="mt-4 space-y-4">
                      {visible.map((comment) => (
                        <div key={comment._id} className="flex gap-3">
                          <button
                            onClick={() => setPeek(comment.user)}
                            className="shrink-0"
                            aria-label={`View profile of ${comment.user.name}`}
                          >
                            <img
                              src={avatarSrc(comment.user.profile)}
                              alt=""
                              className="h-8 w-8 rounded-full border border-line object-cover"
                            />
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-ink">
                              <button
                                onClick={() => setPeek(comment.user)}
                                className="font-semibold hover:underline"
                              >
                                {comment.user.name}
                              </button>{" "}
                              <span className="text-muted">@{comment.user.username}</span>
                              {comment.createdAt && (
                                <span className="ml-1 text-xs text-muted">
                                  · {formatDate(comment.createdAt)}
                                </span>
                              )}
                            </p>
                            <p className="mt-1 whitespace-pre-wrap text-sm text-ink">{comment.body}</p>
                          </div>
                          {(isAdmin || comment.mine) && (
                            <button
                              onClick={() => removeComment(post, comment._id)}
                              className="shrink-0 text-xs text-red-700 hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <input
                        value={commentText[post._id] || ""}
                        onChange={(event) =>
                          setCommentText({ ...commentText, [post._id]: event.target.value })
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            submitComment(post);
                          }
                        }}
                        className="ds-input py-2"
                        placeholder={userData?.email ? "Add a comment…" : "Log in to comment"}
                        disabled={!userData?.email}
                        maxLength={1000}
                      />
                      <button
                        onClick={() => submitComment(post)}
                        disabled={!userData?.email || !commentText[post._id]?.trim()}
                        className="btn-primary px-4 py-2 text-sm"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>

      <UserPeek user={peek} onClose={() => setPeek(null)} />
    </main>
  );
}
