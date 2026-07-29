"use client";

const MAX_OPTIONS = 8;
const newPoll = () => ({ question: "", allowMultiple: false, options: [{ text: "" }, { text: "" }] });

// Admin-side poll builder. Options already saved keep their _id so that editing
// a post does not throw away the votes villagers have already cast.
export default function PollComposer({ poll, onChange }) {
  if (!poll)
    return (
      <button
        type="button"
        onClick={() => onChange(newPoll())}
        className="flex min-h-14 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line bg-cream px-4 text-sm text-muted transition-colors hover:bg-mist sm:col-span-2"
      >
        <img
          src="https://img.icons8.com/ios/50/1f1f1f/bar-chart--v1.png"
          width={16}
          height={16}
          alt=""
        />
        Attach a poll
      </button>
    );

  const setOption = (index, text) =>
    onChange({
      ...poll,
      options: poll.options.map((option, i) => (i === index ? { ...option, text } : option)),
    });

  const removeOption = (index) =>
    onChange({ ...poll, options: poll.options.filter((_, i) => i !== index) });

  return (
    <div className="rounded-lg border border-line bg-cream p-4 sm:col-span-2">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">Poll</h3>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-xs font-medium text-red-700 hover:underline"
        >
          Remove poll
        </button>
      </div>

      <input
        value={poll.question}
        onChange={(event) => onChange({ ...poll, question: event.target.value })}
        className="ds-input"
        placeholder="Ask the village a question"
        maxLength={200}
      />

      <div className="mt-3 space-y-2">
        {poll.options.map((option, index) => (
          <div key={option._id || index} className="flex items-center gap-2">
            <span className="w-5 shrink-0 text-xs text-muted">{index + 1}.</span>
            <input
              value={option.text}
              onChange={(event) => setOption(index, event.target.value)}
              className="ds-input py-2"
              placeholder={`Option ${index + 1}`}
              maxLength={120}
            />
            {poll.options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:bg-mist"
                aria-label={`Remove option ${index + 1}`}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        {poll.options.length < MAX_OPTIONS ? (
          <button
            type="button"
            onClick={() => onChange({ ...poll, options: [...poll.options, { text: "" }] })}
            className="text-sm font-medium text-ink hover:underline"
          >
            + Add option
          </button>
        ) : (
          <span className="text-xs text-muted">Maximum {MAX_OPTIONS} options</span>
        )}

        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={poll.allowMultiple}
            onChange={(event) => onChange({ ...poll, allowMultiple: event.target.checked })}
            className="h-4 w-4 accent-ink"
          />
          Allow multiple choices
        </label>
      </div>

      <p className="mt-3 text-xs text-muted">
        A poll needs a question and at least two filled options, otherwise it is not saved.
        Individual votes stay private — only totals are shown.
      </p>
    </div>
  );
}
