import CommunityPost from "@/app/modals/CommunityPost";
import User from "@/app/modals/User";
import { connectToDB } from "@/app/utils/connection";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    await connectToDB();
    const { action, email, body, commentId } = await request.json();
    const post = await CommunityPost.findById(params.id);
    if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });
    const user = await User.findOne({ email }).lean();
    if (!user) return NextResponse.json({ message: "Please log in to interact" }, { status: 401 });
    if (action === "like") {
      const index = post.likes.indexOf(email);
      index >= 0 ? post.likes.splice(index, 1) : post.likes.push(email);
    } else if (action === "comment") {
      if (!body?.trim()) return NextResponse.json({ message: "Write a comment first" }, { status: 400 });
      post.comments.push({ email, body: body.trim() });
    } else if (action === "delete-comment") {
      if (user.userType !== "admin") return NextResponse.json({ message: "Only a system administrator can remove comments" }, { status: 403 });
      post.comments = post.comments.filter((comment) => String(comment._id) !== commentId);
    } else return NextResponse.json({ message: "Unknown interaction" }, { status: 400 });
    await post.save();
    return NextResponse.json({ message: "Updated" });
  } catch (error) { return NextResponse.json({ message: error.message }, { status: 400 }); }
}
