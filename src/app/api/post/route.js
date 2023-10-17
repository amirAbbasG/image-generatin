import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

import Post from "@/lib/models/post";
import { connectToDB } from "@/lib/mongodb";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function getHandler(request) {
  await connectToDB();
  try {
    const posts = await Post.find({});
    return NextResponse.json({ success: true, data: posts }, { status: 200 });
  } catch (e) {
    throw e;
  }
}

async function postHandler(request) {
  await connectToDB();
  try {
    console.log("here");
    const { name, prompt, photo } = await request.json();
    console.log({ name, prompt, photo });

    const photoUrl = await cloudinary.uploader.upload(photo);

    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.url,
    });

    return NextResponse.json({ success: true, data: newPost }, { status: 200 });
  } catch (e) {
    throw e;
  }
}

export { getHandler as GET, postHandler as POST };
