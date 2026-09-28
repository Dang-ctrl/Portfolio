import PostEditor from "@/components/admin/PostEditor";

export const metadata = { title: "Edit post" };
export const dynamic = "force-dynamic";

export default function EditPostPage({ params }: { params: { slug: string } }) {
  return <PostEditor slug={params.slug} />;
}
