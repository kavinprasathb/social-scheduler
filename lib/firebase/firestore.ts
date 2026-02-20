import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./config";
import type { Post, Media, User } from "@/types";

// ─── User Profile ───────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as User) : null;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Omit<User, "createdAt">>
) {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ─── Posts ───────────────────────────────────────────────────

export async function createPost(
  data: Omit<Post, "id" | "createdAt" | "updatedAt">
) {
  const ref = await addDoc(collection(db, "posts"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updatePost(
  id: string,
  data: Partial<Omit<Post, "id" | "createdAt">>
) {
  await updateDoc(doc(db, "posts", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePost(id: string) {
  await deleteDoc(doc(db, "posts", id));
}

export async function getUserPosts(
  userId: string,
  statusFilter?: string
): Promise<(Post & { id: string })[]> {
  const constraints = [
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  ];

  if (statusFilter && statusFilter !== "All") {
    constraints.splice(
      1,
      0,
      where("status", "==", statusFilter.toLowerCase())
    );
  }

  const q = query(collection(db, "posts"), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Post, "id">) }));
}

export function onUserPosts(
  userId: string,
  callback: (posts: (Post & { id: string })[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "posts"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    const posts = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Post, "id">),
    }));
    callback(posts);
  });
}

export async function getPostsByDateRange(
  userId: string,
  start: Date,
  end: Date
): Promise<(Post & { id: string })[]> {
  const q = query(
    collection(db, "posts"),
    where("userId", "==", userId),
    where("scheduledAt", ">=", Timestamp.fromDate(start)),
    where("scheduledAt", "<=", Timestamp.fromDate(end)),
    orderBy("scheduledAt", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Post, "id">) }));
}

// ─── Media ──────────────────────────────────────────────────

export async function getUserMedia(
  userId: string
): Promise<(Media & { id: string })[]> {
  const q = query(
    collection(db, "media"),
    where("userId", "==", userId),
    orderBy("uploadedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Media, "id">) }));
}

export async function createMediaRecord(
  data: Omit<Media, "id" | "uploadedAt">
) {
  const ref = await addDoc(collection(db, "media"), {
    ...data,
    uploadedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteMediaRecord(id: string) {
  await deleteDoc(doc(db, "media", id));
}
