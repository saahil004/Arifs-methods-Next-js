export type Course = {
  code: string;
  name: string;
  level: "O Level" | "A Level";
};

export const courses: Course[] = [
  { code: "4024", name: "Mathematics (Syllabus D)", level: "O Level" },
  { code: "4037", name: "Additional Mathematics", level: "O Level" },
  { code: "5054", name: "Physics", level: "O Level" },
  { code: "5070", name: "Chemistry", level: "O Level" },
  { code: "2210", name: "Computer Science", level: "O Level" },
  { code: "9709", name: "Mathematics", level: "A Level" },
  { code: "9702", name: "Physics", level: "A Level" },
  { code: "9618", name: "Computer Science", level: "A Level" },
];
