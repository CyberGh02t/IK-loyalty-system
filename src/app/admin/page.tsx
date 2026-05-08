"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState<any>(null);

  const findUser = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .single();

    if (error) {
      alert("User not found");
      return;
    }

    setUser(data);
  };

  const addCoffee = async () => {
  if (!user) return;

  let newBonusCount = user.bonus_count + 1;

  let freeReward = false;

  if (newBonusCount >= 5) {
    freeReward = true;
    newBonusCount = 0;
  }

  const { error } = await supabase
    .from("users")
    .update({
      bonus_count: newBonusCount,
      free_reward: freeReward,
    })
    .eq("id", user.id);

  if (error) {
    alert("Error updating bonus");
    return;
  }

  setUser((prev: any) => ({
  ...prev,
  bonus_count: newBonusCount,
  free_reward: freeReward,
}));

  alert("Coffee added!");
};

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">
          Admin Panel
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <button
            onClick={findUser}
            className="bg-black text-white p-3 rounded-lg"
          >
            Find User
          </button>
        </div>

        {user && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-2xl font-semibold">
              {user.name} {user.surname}
            </h2>

            <p className="text-gray-500 mb-4">
              {user.phone}
            </p>

            <div className="text-4xl mb-4">
              {"☕".repeat(user.bonus_count)}
            </div>

            <p className="mb-4">
              {user.bonus_count} / 5 Coffees
            </p>

            <button
  onClick={addCoffee}
  className="bg-black text-white px-4 py-3 rounded-lg w-full"
>
  +1 Coffee
</button>
          </div>
        )}
      </div>
    </div>
  );
}