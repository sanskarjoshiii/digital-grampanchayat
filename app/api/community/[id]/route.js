import CommunityPost from "@/app/modals/CommunityPost";
import User from "@/app/modals/User";
import { connectToDB } from "@/app/utils/connection";
import { hydratePost, mergePoll, resolveViewer } from "@/app/utils/community";
import { NextResponse } from "next/server";

const assertAdmin = async (email) => (await User.findOne({ email }).lean())?.userType === "admin";

export async function PUT(request, { params }) {
  try {
    await connectToDB();
    const { email, title, caption, media, poll } = await request.json();
    if (!(await assertAdmin(email)))
      return NextResponse.json(
        { message: "Only a system administrator can edit posts" },
        { status: 403 }
      );

    const post = await CommunityPost.findById(params.id);
    if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

    post.title = title;
    post.caption = caption;
    post.media = media;
    // Votes already cast are carried over for any option that kept its _id.
    post.poll = mergePoll(post.poll, poll);
    await post.save();

    const viewer = await resolveViewer(email);
    return NextResponse.json({
      message: "Post updated",
      post: await hydratePost(post.toObject(), viewer),
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    if (!(await assertAdmin(searchParams.get("email"))))
      return NextResponse.json(
        { message: "Only a system administrator can delete posts" },
        { status: 403 }
      );
    await CommunityPost.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
