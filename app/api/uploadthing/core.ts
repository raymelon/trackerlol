import { getCurrentUser } from "@/actions/get-current-user";
import { redirect } from "next/navigation";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/login");
  }
  return { userId: user.id };
};

export const ourFileRouter = {
  receiptImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  receiptFile: f(["image", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
