import CommunityPost from "@/app/modals/CommunityPost";
import User from "@/app/modals/User";
import { connectToDB } from "@/app/utils/connection";
import {
  buildFeedQuery,
  hydratePosts,
  mergePoll,
  resolveViewer,
} from "@/app/utils/community";
import { NextResponse } from "next/server";

const isAdmin = async (email) => {
  const user = await User.findOne({ email }).lean();
  return user?.userType === "admin";
};

export async function GET(request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const { query, sort } = buildFeedQuery({
      view: searchParams.get("view") || "active",
      range: searchParams.get("range") || "all",
      days: searchParams.get("days"),
      sort: searchParams.get("sort") || "newest",
    });

    // Aggregate rather than find(), so "most/least liked" can sort on the size
    // of the likes array without keeping a denormalised counter in sync.
    const posts = await CommunityPost.aggregate([
      { $match: query },
      {
        $addFields: {
          likeCount: { $size: { $ifNull: ["$likes", []] } },
          commentCount: { $size: { $ifNull: ["$comments", []] } },
        },
      },
      { $sort: sort },
    ]);

    const viewer = await resolveViewer(searchParams.get("viewer") || "");
    return NextResponse.json(await hydratePosts(posts, viewer));
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Could not load community posts" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDB();
    const { email, title, caption, media = [], poll = null } = await request.json();
    if (!(await isAdmin(email)))
      return NextResponse.json(
        { message: "Only a system administrator can publish posts" },
        { status: 403 }
      );
    if (!title?.trim())
      return NextResponse.json({ message: "A post title is required" }, { status: 400 });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const post = await CommunityPost.create({
      title,
      caption,
      media,
      poll: mergePoll(null, poll),
      authorEmail: email,
      expiresAt,
    });
    return NextResponse.json({ message: "Community post published", post }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Could not publish post" },
      { status: 400 }
    );
  }
}
