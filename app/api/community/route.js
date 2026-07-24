import CommunityPost from "@/app/modals/CommunityPost";
import User from "@/app/modals/User";
import { connectToDB } from "@/app/utils/connection";
import { NextResponse } from "next/server";

const isAdmin = async (email) => {
  const user = await User.findOne({ email }).lean();
  return user?.userType === "admin";
};

const hydratePosts = async (posts, viewer = "") => {
  const emails = [...new Set(posts.flatMap((post) => post.comments.map((comment) => comment.email)))];
  const users = emails.length
    ? await User.find({ email: { $in: emails } }).select("email username name profile").lean()
    : [];
  const profiles = new Map(users.map((user) => [user.email, user]));
  return posts.map((post) => ({
    ...post,
    // Never expose the list of who liked — only the count and whether the
    // current viewer liked it (so the heart can fill for them).
    likes: undefined,
    likeCount: post.likes?.length || 0,
    likedByMe: viewer ? (post.likes || []).includes(viewer) : false,
    comments: post.comments.map((comment) => ({
      ...comment,
      user: profiles.get(comment.email) || { username: "villager", name: "Village resident", profile: "" },
    })),
  }));
};

export async function GET(request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view") || "active";
    const period = searchParams.get("period") || "all";
    const value = Number(searchParams.get("value") || 0);
    const viewer = searchParams.get("viewer") || "";
    const query = view === "all" ? {} : { expiresAt: { $gte: new Date() } };
    if (period !== "all" && value > 0) {
      const since = new Date();
      if (period === "days") since.setDate(since.getDate() - value);
      if (period === "months") since.setMonth(since.getMonth() - value);
      if (period === "years") since.setFullYear(since.getFullYear() - value);
      query.createdAt = { $gte: since };
    }
    const posts = await CommunityPost.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(await hydratePosts(posts, viewer));
  } catch (error) {
    return NextResponse.json({ message: error.message || "Could not load community posts" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDB();
    const { email, title, caption, media = [] } = await request.json();
    if (!(await isAdmin(email))) return NextResponse.json({ message: "Only a system administrator can publish posts" }, { status: 403 });
    if (!title?.trim()) return NextResponse.json({ message: "A post title is required" }, { status: 400 });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const post = await CommunityPost.create({ title, caption, media, authorEmail: email, expiresAt });
    return NextResponse.json({ message: "Community post published", post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message || "Could not publish post" }, { status: 400 });
  }
}
