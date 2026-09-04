import Faculty from "@/components/sections/about/faculty";
import type { Teacher } from "@/lib/admin-api";

// TEMPORARY verification page — delete after checking the Faculty carousel.
const NAMES = ["Arif Hussain", "Sana Khan", "Bilal Ahmed", "Mehwish Ali", "Danish Raza", "Farah Iqbal", "Usman Tariq"];

const teachers: Teacher[] = NAMES.map((name, i) => ({
  id: String(i),
  name,
  bio: "Teaches the syllabus topic by topic and drills past papers under timed conditions until the paper is familiar rather than a surprise on the day.",
  photoUrl: null,
  courses: [{ id: String(i), name: i % 2 ? "Physics" : "Mathematics", code: "0000", level: "O Level", description: null }],
})) as Teacher[];

export default function Preview({ searchParams }: { searchParams: Promise<{ n?: string }> }) {
  return <Content searchParams={searchParams} />;
}

async function Content({ searchParams }: { searchParams: Promise<{ n?: string }> }) {
  const { n } = await searchParams;
  const count = Math.min(Math.max(Number(n) || 7, 1), NAMES.length);
  return <Faculty teachers={teachers.slice(0, count)} />;
}
