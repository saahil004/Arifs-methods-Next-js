const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Level = "O Level" | "A Level";

export type Registration = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  level: Level;
  subjects: string[];
  message: string | null;
};

export type Subscriber = {
  id: string;
  created_at: string;
  email: string;
};

export type Course = {
  id: string;
  created_at: string;
  code: string;
  name: string;
  level: Level;
};

export type CourseInput = {
  code: string;
  name: string;
  level: Level;
};

export type Teacher = {
  id: string;
  name: string;
  bio: string | null;
  photoUrl: string | null;
  courses: Course[];
};

export type TeacherInput = {
  name: string;
  bio?: string;
  photoUrl?: string;
  courseIds: string[];
};

// Thrown whenever the backend rejects a token (missing, invalid, expired).
// Callers should catch this specifically and log the admin out, rather than
// showing it as a generic error message.
export class UnauthorizedError extends Error {
  constructor() {
    super("Your session has expired. Please log in again.");
    this.name = "UnauthorizedError";
  }
}

async function adminFetch<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) throw new UnauthorizedError();

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }
  return data as T;
}

export async function loginAdmin(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Invalid email or password");
  }
  return { token: data.token as string, expiresAt: data.expiresAt as number };
}

export async function fetchRegistrations(token: string) {
  const data = await adminFetch<{ registrations: Registration[] }>("/api/registrations", token);
  return data.registrations;
}

export async function fetchSubscribers(token: string) {
  const data = await adminFetch<{ subscribers: Subscriber[] }>("/api/newsletter", token);
  return data.subscribers;
}

// Courses/teachers reads are public endpoints (the site's homepage and
// register form use them unauthenticated too) — only writes need a token.
export async function fetchCourses() {
  const res = await fetch(`${API_URL}/api/courses`);
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed to load courses");
  return data.courses as Course[];
}

export async function createCourse(token: string, input: CourseInput) {
  const data = await adminFetch<{ course: Course }>("/api/courses", token, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.course;
}

export async function updateCourse(token: string, id: string, input: CourseInput) {
  const data = await adminFetch<{ course: Course }>(`/api/courses/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  return data.course;
}

export async function deleteCourse(token: string, id: string) {
  await adminFetch(`/api/courses/${id}`, token, { method: "DELETE" });
}

export async function fetchTeachers() {
  const res = await fetch(`${API_URL}/api/teachers`);
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed to load teachers");
  return data.teachers as Teacher[];
}

export async function createTeacher(token: string, input: TeacherInput) {
  const data = await adminFetch<{ teacher: Teacher }>("/api/teachers", token, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.teacher;
}

export async function updateTeacher(token: string, id: string, input: TeacherInput) {
  const data = await adminFetch<{ teacher: Teacher }>(`/api/teachers/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  return data.teacher;
}

export async function deleteTeacher(token: string, id: string) {
  await adminFetch(`/api/teachers/${id}`, token, { method: "DELETE" });
}
