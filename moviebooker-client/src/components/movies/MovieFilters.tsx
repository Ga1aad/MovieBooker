import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useState, FormEvent } from "react";

interface MovieFiltersProps {
  onSearchChange: (search: string) => void;
  onSortChange: (sort: string) => void;
  currentSort: string;
  currentSearch: string;
}

export function MovieFilters({
  onSearchChange,
  onSortChange,
  currentSort,
  currentSearch,
}: MovieFiltersProps) {
  const [searchInput, setSearchInput] = useState(currentSearch);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchChange(searchInput.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchInput.trim()) {
        onSearchChange(searchInput.trim());
      }
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    onSearchChange("");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Search className="h-5 w-5 text-gray-500" />
        <h2 className="text-lg font-semibold">Rechercher un film</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <Input
              id="search"
              placeholder="Titre du film..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-24"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-[2px] top-[2px] bottom-[2px]"
              disabled={!searchInput.trim()}
            >
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </div>

          {currentSearch && (
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-md border border-blue-100 max-w-fit">
              <p className="text-sm text-blue-600">
                Recherche : "{currentSearch}"
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="h-6 w-6 p-0 hover:bg-blue-100"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Effacer la recherche</span>
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Trier par :</span>
          </div>
          <Select value={currentSort} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularité</SelectItem>
              <SelectItem value="release_date">Date de sortie</SelectItem>
              <SelectItem value="vote_average">Note</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </form>
    </div>
  );
}
