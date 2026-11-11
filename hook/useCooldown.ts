"use client";

import { useEffect, useState } from "react";

// Jeda tombol setelah HTTP 429 (rate limit): tombol dinonaktifkan sementara dan
// TIDAK ada retry otomatis. start() dipanggil dari event handler.
export default function useCooldown() {
  const [until, setUntil] = useState(0);
  const [now, setNow] = useState(0);

  const start = (seconds = 30) => {
    const current = Date.now();
    setNow(current);
    setUntil(current + seconds * 1000);
  };

  useEffect(() => {
    if (!until) return;
    const id = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= until) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [until]);

  const remaining = until > now ? Math.ceil((until - now) / 1000) : 0;
  return { remaining, start };
}
