import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./config";

export async function uploadFile(
  file: File,
  userId: string,
  onProgress?: (percent: number) => void
): Promise<{ url: string; storagePath: string }> {
  const storagePath = `media/${userId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, storagePath);
  const task = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) => {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(percent);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve({ url, storagePath });
      }
    );
  });
}

export async function deleteFile(storagePath: string) {
  const storageRef = ref(storage, storagePath);
  await deleteObject(storageRef);
}
