// Helper untuk mode data dummy (development only).
// Aktifkan dengan menambahkan NEXT_PUBLIC_USE_MOCK_DATA=true di .env.local
export const isMockEnabled = (): boolean => process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export const mockDelay = (ms = 600): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
