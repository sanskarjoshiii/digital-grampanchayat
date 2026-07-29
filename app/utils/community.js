import User from "@/app/modals/User";

/**
 * Shared shaping rules for community posts.
 *
 * Privacy contract enforced here (and never in the browser):
 *  - The list of people who liked a post is never sent to anyone. Likes are a
 *    plain counter plus a "did I like this" flag so the heart can fill in.
 *  - The same holds for poll votes: counts only, plus the viewer's own choices.
 *  - Everyone may see WHO commented (name, username, photo).
 *  - Only an admin additionally receives a commenter's contact details
 *    (email and mobile number).
 */

const publicProfile = (user) => ({
  name: user?.name || "Village resident",
  username: user?.username || "villager",
  profile: user?.profile || "",
});

const adminProfile = (user) => ({
  ...publicProfile(user),
  email: user?.email || "",
  phoneNo: user?.phoneNo || "",
});

/** Resolve the requesting user once, so routes can branch on their role. */
export const resolveViewer = async (email) => {
  if (!email) return null;
  return User.findOne({ email }).select("email userType").lean();
};

const shapePoll = (poll, viewerEmail) => {
  if (!poll?.question) return null;
  const voters = new Set();
  const options = (poll.options || []).map((option) => {
    const votes = option.votes || [];
    votes.forEach((voter) => voters.add(voter));
    return {
      _id: String(option._id),
      text: option.text,
      votes: votes.length,
      votedByMe: viewerEmail ? votes.includes(viewerEmail) : false,
    };
  });
  return {
    question: poll.question,
    allowMultiple: !!poll.allowMultiple,
    options,
    // Distinct voters, so a multiple-choice option can never exceed 100%.
    voterCount: voters.size,
    votedByMe: options.some((option) => option.votedByMe),
  };
};

/** Strip private fields and attach the commenter profiles this viewer may see. */
export const hydratePosts = async (posts, viewer) => {
  const viewerEmail = viewer?.email || "";
  const isAdmin = viewer?.userType === "admin";

  const emails = [
    ...new Set(posts.flatMap((post) => (post.comments || []).map((comment) => comment.email))),
  ];
  const users = emails.length
    ? await User.find({ email: { $in: emails } })
        .select("email username name profile phoneNo")
        .lean()
    : [];
  const byEmail = new Map(users.map((user) => [user.email, user]));

  return posts.map((post) => {
    const likes = post.likes || [];
    const comments = post.comments || [];
    return {
      ...post,
      likes: undefined,
      likeCount: likes.length,
      likedByMe: viewerEmail ? likes.includes(viewerEmail) : false,
      commentCount: comments.length,
      poll: shapePoll(post.poll, viewerEmail),
      comments: comments.map((comment) => {
        const author = byEmail.get(comment.email);
        return {
          _id: String(comment._id),
          body: comment.body,
          createdAt: comment.createdAt,
          // The raw email stays server-side unless the viewer is an admin.
          email: undefined,
          mine: viewerEmail ? comment.email === viewerEmail : false,
          user: isAdmin ? adminProfile(author) : publicProfile(author),
        };
      }),
    };
  });
};

export const hydratePost = async (post, viewer) => {
  const [shaped] = await hydratePosts([post], viewer);
  return shaped;
};

/**
 * Build the poll to persist. Options are matched to the stored poll by _id so
 * an admin can fix a typo or add a choice without resetting existing votes.
 */
export const mergePoll = (existingPoll, incomingPoll) => {
  if (!incomingPoll?.question?.trim()) return null;
  const options = (incomingPoll.options || []).filter((option) => option.text?.trim());
  if (options.length < 2) return null;

  const previousVotes = new Map(
    (existingPoll?.options || []).map((option) => [String(option._id), option.votes || []])
  );

  return {
    question: incomingPoll.question.trim().slice(0, 200),
    allowMultiple: !!incomingPoll.allowMultiple,
    options: options.slice(0, 8).map((option) => ({
      ...(option._id ? { _id: option._id } : {}),
      text: option.text.trim().slice(0, 120),
      votes: previousVotes.get(String(option._id)) || [],
    })),
  };
};

/** Translate the feed's filter controls into a Mongo query + sort stage. */
export const buildFeedQuery = ({ view, range, days, sort }) => {
  const query = view === "all" ? {} : { expiresAt: { $gte: new Date() } };

  const since = new Date();
  const ranges = {
    today: () => since.setDate(since.getDate() - 1),
    week: () => since.setDate(since.getDate() - 7),
    month: () => since.setDate(since.getDate() - 30),
    quarter: () => since.setMonth(since.getMonth() - 3),
    halfyear: () => since.setMonth(since.getMonth() - 6),
    year: () => since.setFullYear(since.getFullYear() - 1),
    custom: () => since.setDate(since.getDate() - Math.min(Math.max(Number(days) || 1, 1), 3650)),
  };
  if (ranges[range]) {
    ranges[range]();
    query.createdAt = { $gte: since };
  }

  const sorts = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    "most-liked": { likeCount: -1, createdAt: -1 },
    "least-liked": { likeCount: 1, createdAt: -1 },
    "most-discussed": { commentCount: -1, createdAt: -1 },
  };

  return { query, sort: sorts[sort] || sorts.newest };
};
