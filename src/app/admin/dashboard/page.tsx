"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] =
    useState("");

  useEffect(() => {
    checkAdmin();
    fetchUsers();
  }, []);

  // CHECK ADMIN ACCESS
  const checkAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/admin");
      return;
    }

    const { data: admin } =
      await supabase
        .from("admins")
        .select("*")
        .eq("auth_id", user.id)
        .single();

    if (!admin) {
      router.push("/admin");
    }
  };

  // FETCH USERS
  const fetchUsers = async () => {
    const { data, error } =
      await supabase
        .from("users")
        .select("*");

    if (error) return;

    setUsers(data);
  };

  // ADD BONUS
  const addCoffee = async (
    userId: number,
    currentBonus: number
  ) => {
    const newBonus =
      currentBonus + 1;

    const freeReward =
      newBonus >= 5;

    await supabase
      .from("users")
      .update({
        bonus_count: newBonus,
        free_reward: freeReward,
      })
      .eq("id", userId);

    fetchUsers();
  };

  // FILTER
  const filteredUsers =
    users.filter((user) =>
      user.phone.includes(search)
    );

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              Admin Dashboard
            </h1>

            <p className="text-gray-400 mt-2">
              Loyalty system management
            </p>
          </div>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/admin");
            }}
            className="bg-red-500 px-5 py-3 rounded-2xl font-bold"
          >
            Logout
          </button>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-3xl p-6 mb-6">

          <input
            type="text"
            placeholder="Search by phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 outline-none"
          />
        </div>

        <div className="grid gap-4">

          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white/10 border border-white/10 rounded-3xl p-6 flex items-center justify-between"
            >
              <div>
                <h2 className="text-2xl font-bold">
                  {user.name}
                </h2>

                <p className="text-gray-400">
                  {user.phone}
                </p>

                <p className="mt-2">
                  ☕ {user.bonus_count} / 5
                </p>

                {user.free_reward && (
                  <p className="text-green-400 font-bold mt-2">
                    FREE COFFEE READY 🎉
                  </p>
                )}
              </div>

              <button
                onClick={() =>
                  addCoffee(
                    user.id,
                    user.bonus_count
                  )
                }
                className="bg-orange-500 hover:bg-orange-600 transition px-6 py-4 rounded-2xl font-bold text-lg"
              >
                +1 Coffee
              </button>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}