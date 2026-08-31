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
  archived_at: string | null;
};

export type Subscriber = {
  id: string;
  created_at: string;
  email: string;
};

export type ContactQuery = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
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
  // FormData bodies must NOT get a manual Content-Type — the browser sets its
  // own multipart boundary, and overriding it here would break the upload.
  const isFormData = init?.body instanceof FormData;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body && !isFormData ? { "Content-Type": "application/json" } : {}),
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

// No refreshToken field — it never reaches client-side JS. The backend
// keeps it in an httpOnly cookie (see Backend/src/routes/admin.ts), which
// the browser sends automatically on login/refresh/logout calls below via
// credentials: "include"; nothing else needs to know it exists.
export type AdminSession = { token: string; expiresAt: number };

export async function loginAdmin(email: string, password: string): Promise<AdminSession> {
  const res = await fetch(`${API_URL}/api/admin/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Invalid email or password");
  }
  return { token: data.token, expiresAt: data.expiresAt };
}

// Called proactively, shortly before the current token expires — see
// admin-auth.tsx's refresh timer. Returns null rather than throwing so a
// failed refresh (e.g. the refresh token was itself revoked or the cookie
// is gone) reads as "time to log out" rather than an error to surface. No
// argument needed — the browser attaches the refresh-token cookie itself.
export async function refreshAdminSession(): Promise<AdminSession | null> {
  const res = await fetch(`${API_URL}/api/admin/refresh`, {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok || !data.success) return null;
  return { token: data.token, expiresAt: data.expiresAt };
}

// Clears the httpOnly refresh-token cookie server-side — the frontend has
// no way to remove it itself, since httpOnly means no JS can touch it.
export async function logoutAdmin(): Promise<void> {
  await fetch(`${API_URL}/api/admin/logout`, { method: "POST", credentials: "include" }).catch(() => {});
}

export async function fetchRegistrations(token: string, options?: { archived?: boolean }) {
  const query = options?.archived ? "?archived=true" : "";
  const data = await adminFetch<{ registrations: Registration[] }>(`/api/registrations${query}`, token);
  return data.registrations;
}

export async function archiveRegistration(token: string, id: string) {
  await adminFetch(`/api/registrations/${id}/archive`, token, { method: "PATCH" });
}

export async function unarchiveRegistration(token: string, id: string) {
  await adminFetch(`/api/registrations/${id}/unarchive`, token, { method: "PATCH" });
}

export async function fetchSubscribers(token: string) {
  const data = await adminFetch<{ subscribers: Subscriber[] }>("/api/newsletter", token);
  return data.subscribers;
}

export async function fetchQueries(token: string) {
  const data = await adminFetch<{ queries: ContactQuery[] }>("/api/queries", token);
  return data.queries;
}

export async function deleteSubscriber(token: string, id: string) {
  await adminFetch(`/api/newsletter/${id}`, token, { method: "DELETE" });
}

export async function deleteQuery(token: string, id: string) {
  await adminFetch(`/api/queries/${id}`, token, { method: "DELETE" });
}

export async function sendNewsletterBroadcast(token: string, subject: string, message: string, files: File[]) {
  const formData = new FormData();
  formData.append("subject", subject);
  formData.append("message", message);
  for (const file of files) formData.append("files", file);

  const data = await adminFetch<{ sent: number; failedBatches: number }>("/api/newsletter/broadcast", token, {
    method: "POST",
    body: formData,
  });
  return data;
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

export async function uploadTeacherPhoto(token: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const data = await adminFetch<{ url: string }>("/api/teachers/upload-photo", token, {
    method: "POST",
    body: formData,
  });
  return data.url;
}

export type AnalyticsOverview = {
  activeUsers: number;
  newUsers: number;
  sessions: number;
  screenPageViews: number;
  cached: boolean;
};

export async function fetchAnalyticsOverview(token: string) {
  return adminFetch<AnalyticsOverview>("/api/analytics", token);
}
