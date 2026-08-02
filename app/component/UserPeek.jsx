"use client";

import { useEffect } from "react";
import { avatarSrc } from "../utils/avatar";

/**
 * Details of a villager who commented on a post.
 *
 * The fields shown are exactly the fields the server chose to send: every
 * viewer gets name, username and photo, while contact details are only ever
 * included in an admin's response. Nothing here is filtered in the browser.
 */
export default function UserPeek({ user, onClose }) {
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!user) return null;
  const contact = [
    user.phoneNo && { label: "Mobile", value: user.phoneNo, href: `tel:${user.phoneNo}` },
    user.email && { label: "Email", value: user.email, href: `mailto:${user.email}` },
  ].filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-card border border-line bg-paper shadow-pop"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Profile of ${user.name}`}
      >
        <div className="flex items-start gap-4 px-5 py-5">
          <img
            src={avatarSrc(user.profile)}
            alt=""
            className="h-16 w-16 shrink-0 rounded-full border border-line object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold text-ink">{user.name}</p>
            <p className="truncate text-sm text-muted">@{user.username}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-mist"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {contact.length > 0 && (
          <div className="border-t border-line bg-cream px-5 py-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
              Contact details · admin only
            </p>
            <dl className="space-y-2">
              {contact.map((row) => (
                <div key={row.label} className="flex items-baseline gap-3 text-sm">
                  <dt className="w-16 shrink-0 text-muted">{row.label}</dt>
                  <dd className="min-w-0 flex-1 truncate">
                    <a href={row.href} className="text-ink hover:underline">
                      {row.value}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
