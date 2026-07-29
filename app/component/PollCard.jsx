"use client";

// Reader-facing poll. The server only ever sends vote counts and the viewer's
// own choices, so there is no way to render who voted for what.
export default function PollCard({ poll, onVote, canVote, pending }) {
  const denominator = poll.voterCount || 0;
  const share = (votes) => (denominator ? Math.round((votes / denominator) * 100) : 0);

  return (
    <div className="mt-4 rounded-lg border border-line bg-cream p-4">
      <p className="font-medium text-ink">{poll.question}</p>
      <p className="mt-0.5 text-xs text-muted">
        {poll.allowMultiple ? "Choose one or more" : "Choose one"} ·{" "}
        {denominator} {denominator === 1 ? "vote" : "votes"}
        {poll.votedByMe && " · tap again to undo"}
      </p>

      <div className="mt-3 space-y-2">
        {poll.options.map((option) => {
          const percent = share(option.votes);
          return (
            <button
              key={option._id}
              type="button"
              disabled={!canVote || pending}
              onClick={() => onVote(option._id)}
              title={canVote ? undefined : "Log in to vote"}
              className={`relative w-full overflow-hidden rounded-lg border px-3 py-2 text-left transition-colors disabled:cursor-not-allowed ${
                option.votedByMe ? "border-ink bg-paper" : "border-line bg-paper hover:bg-mist"
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute inset-y-0 left-0 transition-[width] duration-300 ${
                  option.votedByMe ? "bg-ink/10" : "bg-mist"
                }`}
                style={{ width: `${percent}%` }}
              />
              <span className="relative flex items-center gap-2 text-sm">
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center border text-[10px] text-white ${
                    poll.allowMultiple ? "rounded-[4px]" : "rounded-full"
                  } ${option.votedByMe ? "border-ink bg-ink" : "border-line bg-paper"}`}
                >
                  {option.votedByMe && "✓"}
                </span>
                <span className={`min-w-0 flex-1 truncate ${option.votedByMe ? "font-medium text-ink" : "text-ink"}`}>
                  {option.text}
                </span>
                <span className="shrink-0 text-xs tabular-nums text-muted">
                  {percent}% ({option.votes})
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {!canVote && <p className="mt-2 text-xs text-muted">Log in to cast your vote.</p>}
    </div>
  );
}
