"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface SearchFiltersProps {
  categories: string[];
  currentSearch?: string;
  currentCategory?: string;
}

export function SearchFilters({
  categories,
  currentSearch,
  currentCategory,
}: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch || "");
  const [isPending, startTransition] = useTransition();

  const updateFilters = (newSearch: string, newCategory?: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.set("search", newSearch);
    if (newCategory) params.set("category", newCategory);

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setSearch("");
    updateFilters("");
  };

  const hasFilters = currentSearch || currentCategory;

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="搜索文章..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateFilters(search, currentCategory);
              }
            }}
            className="pl-10"
          />
        </div>
        <Button onClick={() => updateFilters(search, currentCategory)} disabled={isPending}>
          搜索
        </Button>
        {hasFilters && (
          <Button variant="outline" onClick={clearFilters} disabled={isPending}>
            <X className="h-4 w-4 mr-2" />
            清除
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={!currentCategory ? "default" : "outline"}
          size="sm"
          onClick={() => updateFilters(search || currentSearch || "", undefined)}
          disabled={isPending}
        >
          全部
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={currentCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilters(search || currentSearch || "", cat)}
            disabled={isPending}
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>
  );
}
