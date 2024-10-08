import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/helper/db";
import Blog from "@/models/blog";

connectDb();
export async function GET(req: NextRequest) {
  const {
    search,
    page = 1,
    limit = 10,
  } = Object.fromEntries(new URL(req.url).searchParams);
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  try {
    let query = {};
    if (search) {
      query = { tags: { $regex: search, $options: "i" } };
    }
    const blogs = await Blog.find(query)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ _id: -1 });
    const totalBlogs = await Blog.countDocuments(query);
    return NextResponse.json(
      {
        success: true,
        data: blogs,
        total: totalBlogs,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalBlogs / limitNumber),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
