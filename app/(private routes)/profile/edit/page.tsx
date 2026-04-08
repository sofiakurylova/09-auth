"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/authStore";
import { updateMe } from "@/lib/api/clientApi";
import css from "./ProfileEdit.module.css";

export default function ProfileEditPage() {
  const { user, setUser } = useAuthStore();
  const [username, setUsername] = useState(user?.username || "");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) setUsername(user.username);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedUser = await updateMe({ username });
      setUser(updatedUser);
      router.push("/profile");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>
        <Image
          src={user?.avatar || "/default-avatar.png"}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />
        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <p>Email: {user?.email}</p>
          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
