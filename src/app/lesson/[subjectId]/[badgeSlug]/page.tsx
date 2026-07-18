import LessonPlayer from "@/components/lesson/LessonPlayer";

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ subjectId: string; badgeSlug: string }>;
  searchParams: Promise<{ lesson?: string | string[] }>;
}) {
  const [{ subjectId, badgeSlug }, query] = await Promise.all([params, searchParams]);
  const requested = Array.isArray(query.lesson) ? query.lesson[0] : query.lesson;
  const lessonOrder = requested === undefined ? undefined : Number(requested);

  return (
    <LessonPlayer
      key={`${subjectId}:${badgeSlug}:${lessonOrder ?? "next"}`}
      subjectId={subjectId}
      badgeSlug={badgeSlug}
      lessonOrder={Number.isInteger(lessonOrder) ? lessonOrder : undefined}
    />
  );
}
