"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("users")
      .insert([
  {
    name: firstName,
    surname: surname,
    phone: phone,
  },
])
.select()
.single();

    if (error) {
      alert(error.message);
      return;
    }

    console.log(data);

    router.push(`/profile/${data.id}`);
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
            Join our loyalty program and earn free coffee
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) =>
              setFirstName(e.target.value)
            }
            className="bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-orange-400 transition"
          />

          <input
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={(e) =>
              setSurname(e.target.value)
            }
            className="bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-orange-400 transition"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            className="bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-orange-400 transition"
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-amber-600 hover:opacity-90 transition rounded-2xl p-4 font-bold text-lg mt-2"
          >
            Join Loyalty Program
          </button>
        </form>
      </div>
    </div>
  );
}