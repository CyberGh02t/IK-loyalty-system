"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] =
    useState("");

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const fakeEmail =
      `${phone}@loyalty.app`;

    const { error } =
      await supabase.auth.signInWithPassword(
        {
          email: fakeEmail,
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

    // GET PROFILE
    const { data: profile, error: profileError } =
      await supabase
        .from("users")
        .select("*")
        .eq("auth_id", user.id)
        .single();

    if (profileError || !profile) {
      alert("Profile not found");
      return;
    }

    router.push(
      `/profile/${profile.id}`
    );
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white shadow-2xl">

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">
            ☕
          </div>

          <h1 className="text-4xl font-bold mb-2">
            Coffee Rewards
          </h1>

          <p className="text-gray-400">
            Login to your account
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
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

        <button
          onClick={() =>
            router.push("/register")
          }
          className="w-full mt-4 border border-white/10 rounded-2xl p-4"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}