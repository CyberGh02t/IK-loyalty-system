"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", Number(id))
        .single();

      console.log(data);
      console.log(error);

      if (error) return;

      setUser(data);
    };

    fetchUser();

    const interval = setInterval(fetchUser, 2000);

    return () => clearInterval(interval);
  }, [id]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 p-8 text-white shadow-2xl">

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-gray-400">
              Loyalty Card
            </p>

            <h1 className="text-3xl font-bold mt-1">
              {user.name}
            </h1>
          </div>

          <div className="text-5xl">
            ☕
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-700 to-orange-500 rounded-2xl p-6 mb-6">
          <p className="text-sm opacity-80 mb-2">
            Coffee Progress
          </p>

          <div className="flex gap-3 text-4xl mb-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <span key={item}>
                {item <= user.bonus_count ? "☕" : "◻️"}
              </span>
            ))}
          </div>

          <p className="font-semibold text-lg">
            {user.bonus_count} / 5 Coffees
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
          <p className="text-gray-400 text-sm mb-1">
            Phone Number
          </p>

          <p className="text-lg font-medium">
            {user.phone}
          </p>
        </div>

        {user.free_reward ? (
          <div className="bg-green-500 text-black font-bold rounded-2xl p-5 text-center text-lg animate-pulse">
            🎉 FREE COFFEE AVAILABLE
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
            <p className="text-gray-400">
              {5 - user.bonus_count} coffees until reward
            </p>
          </div>
        )}
      </div>
    </div>
  );
}