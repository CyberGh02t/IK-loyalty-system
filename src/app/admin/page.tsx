"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // LOGIN
    const { error } =
      await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

    if (error) {
      alert(error.message);
      return;
    }

    // GET AUTH USER
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("User not found");
      return;
    }

    // CHECK ADMINS TABLE
    const {
      data: admin,
      error: adminError,
    } = await supabase
      .from("admins")
      .select("*")
      .eq("auth_id", user.id)
      .single();

    if (adminError || !admin) {
      alert("Access denied");
      return;
    }

    // SUCCESS
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white shadow-2xl">

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">
            🛠️
          </div>

          <h1 className="text-4xl font-bold mb-2">
            Admin Panel
          </h1>

          <p className="text-gray-400">
            Staff access only
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
        >
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="bg-white/5 border border-white/10 rounded-2xl p-4 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="bg-white/5 border border-white/10 rounded-2xl p-4 outline-none"
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-4 font-bold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}