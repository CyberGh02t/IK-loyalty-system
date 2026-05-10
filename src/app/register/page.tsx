"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [surname, setSurname] =
    useState("");

  const [phone, setPhone] = useState("");

  const [password, setPassword] =
    useState("");

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const fakeEmail =
      `${phone}@loyalty.app`;

    // AUTH REGISTER
    const { data, error } =
      await supabase.auth.signUp({
        email: fakeEmail,
        password,
      });

    if (error) {
      alert(error.message);
      return;
    }

    const userId = data.user?.id;

    if (!userId) {
      alert("User creation failed");
      return;
    }

    // PROFILE TABLE
    const { error: profileError } =
      await supabase.from("users").insert([
        {
          auth_id: userId,
          name,
          surname,
          phone,
          bonus_count: 0,
          free_reward: false,
        },
      ]);

    if (profileError) {
      alert(profileError.message);
      return;
    }

    router.push("/");
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
            Create your account
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="First Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="bg-white/5 border border-white/10 rounded-2xl p-4 outline-none"
          />

          <input
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={(e) =>
              setSurname(e.target.value)
            }
            className="bg-white/5 border border-white/10 rounded-2xl p-4 outline-none"
          />

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
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}