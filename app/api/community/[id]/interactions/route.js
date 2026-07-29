import CommunityPost from "@/app/modals/CommunityPost";
import User from "@/app/modals/User";
import { connectToDB } from "@/app/utils/connection";
import { hydratePost } from "@/app/utils/community";
import { NextResponse } from "next/server";

const castVote = (poll, email, optionId) => {
  const target = poll.options.id(optionId);
  if (!target) return "That poll option no longer exists";
  const alreadyChosen = target.votes.includes(email);

  if (!poll.allowMultiple) {
    // Single choice: clear anything this villager picked before.
    poll.options.forEach((option) => {
      option.votes = option.votes.filter((voter) => voter !== email);
    });
  } else if (alreadyChosen) {
    target.votes = target.votes.filter((voter) => voter !== email);
    return null;
  }

  // Tapping the current single choice again retracts the vote.
  if (!alreadyChosen) target.votes.push(email);
  return null;
};

export async function POST(request, { params }) {
  try {
    await connectToDB();
    const { action, email, body, commentId, optionId } = await request.json();

    const post = await CommunityPost.findById(params.id);
    if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

    const user = await User.findOne({ email }).select("email userType").lean();
    if (!user) return NextResponse.json({ message: "Please log in to interact" }, { status: 401 });

    if (action === "like") {
      const index = post.likes.indexOf(email);
      index >= 0 ? post.likes.splice(index, 1) : post.likes.push(email);
    } else if (action === "comment") {
      if (!body?.trim())
        return NextResponse.json({ message: "Write a comment first" }, { status: 400 });
      post.comments.push({ email, body: body.trim() });
    } else if (action === "delete-comment") {
      const comment = post.comments.id(commentId);
      if (!comment) return NextResponse.json({ message: "Comment not found" }, { status: 404 });
      // Admins moderate anyone; a villager may still remove their own comment.
      if (user.userType !== "admin" && comment.email !== email)
        return NextResponse.json(
          { message: "You can only remove your own comment" },
          { status: 403 }
        );
      post.comments.pull(commentId);
    } else if (action === "vote") {
      if (!post.poll) return NextResponse.json({ message: "This post has no poll" }, { status: 400 });
      const problem = castVote(post.poll, email, optionId);
      if (problem) return NextResponse.json({ message: problem }, { status: 400 });
    } else {
      return NextResponse.json({ message: "Unknown interaction" }, { status: 400 });
    }

    await post.save();
    // Return the freshly shaped post so the feed can patch this one card in
    // place — no refetch, no scroll jump.
    return NextResponse.json({
      message: "Updated",
      post: await hydratePost(post.toObject(), user),
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
