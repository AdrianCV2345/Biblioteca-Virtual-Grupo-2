import BookDetailPage from "@/pages/BookDetail";
import Main from "@/main";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <Main>
      <BookDetailPage workId={id} />
    </Main>
  );
}