import { useMemo, useState } from "react";

// Bungkus state pencarian + filter array berdasarkan kata kunci.
// `getSearchableText` menentukan bagian mana dari tiap item yang dicocokkan.
export default function useSearchFilter<T>(
  items: T[],
  getSearchableText: (item: T) => string[]
) {
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((item) =>
      getSearchableText(item).some((text) => text.toLowerCase().includes(keyword))
    );
  }, [items, query, getSearchableText]);

  return { query, setQuery, filteredItems };
}
