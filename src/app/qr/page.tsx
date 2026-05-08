"use client";

import QRCode from "react-qr-code";

export default function QRPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
        <h1 className="text-3xl font-bold mb-4">
          Loyalty Program
        </h1>

        <p className="text-gray-500 mb-8">
          Scan QR code to join and collect coffee rewards ☕
        </p>

        <div className="bg-white p-4 rounded-2xl inline-block">
          <QRCode
            value="http://localhost:3000/register"
            size={220}
          />
        </div>

        <p className="mt-6 text-sm text-gray-400">
          Powered by Ilkin Karimli
        </p>
      </div>
    </div>
  );
}