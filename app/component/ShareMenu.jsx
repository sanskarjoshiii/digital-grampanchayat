"use client";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

// Share a community post to specific platforms, with a native-share fallback.
export default function ShareMenu({ post }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/community`
      : "/community";
  const text = `${post.title} — PanchayatX Community`;
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);

  const platforms = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${t}%20${u}`,
      icon: "https://img.icons8.com/color/48/whatsapp--v1.png",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      icon: "https://img.icons8.com/color/48/facebook-new.png",
    },
    {
      name: "X (Twitter)",
      href: `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
      icon: "https://img.icons8.com/ios-filled/50/1f1f1f/twitterx--v2.png",
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${u}&text=${t}`,
      icon: "https://img.icons8.com/color/48/telegram-app--v1.png",
    },
  ];

  const nativeShare = async () => {
    setOpen(false);
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        toast.success("Post link copied");
      }
    } catch (e) {
      if (e.name !== "AbortError") toast.error("Could not share this post");
    }
  };

  const copyLink = async () => {
    setOpen(false);
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      toast.success("Post link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 font-medium text-ink hover:text-black"
      >
        <img
          width="16"
          height="16"
          src="https://img.icons8.com/ios/50/1f1f1f/share--v1.png"
          alt=""
        />
        Share
      </button>

      {open && (
        <div className="absolute right-0 bottom-9 z-50 w-52 rounded-card border border-line bg-paper shadow-pop p-1.5">
          <p className="px-2 py-1.5 text-xs uppercase tracking-wide text-muted">
            Share to
          </p>
          {platforms.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-ink hover:bg-mist transition-colors"
            >
              <img src={p.icon} width={20} height={20} alt="" />
              {p.name}
            </a>
          ))}
          <button
            onClick={copyLink}
            className="w-full flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-ink hover:bg-mist transition-colors"
          >
            <img
              src="https://img.icons8.com/ios/50/1f1f1f/link--v1.png"
              width={20}
              height={20}
              alt=""
            />
            Copy link
          </button>
          <button
            onClick={nativeShare}
            className="w-full flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-ink hover:bg-mist transition-colors"
          >
            <img
              src="https://img.icons8.com/ios/50/1f1f1f/share-rounded.png"
              width={20}
              height={20}
              alt=""
            />
            More…
          </button>
        </div>
      )}
    </div>
  );
}
