import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

interface SearchInputProps {
  onSearch: (city: string) => void;
  onLocationSearch: () => void;
  isLoading: boolean;
}

const SearchInput = ({ onSearch, onLocationSearch, isLoading }: SearchInputProps) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="bg-weather-input border-weather-input-border text-weather-primary placeholder:text-weather-secondary/70 rounded-full pl-6 pr-12 py-4 text-center focus:bg-white/30 transition-colors w-full"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="sm" 
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent hover:bg-white/20 text-weather-primary p-2 rounded-full"
          disabled={isLoading || !city.trim()}
        >
          <Search className="w-4 h-4" />
        </Button>
      </form>
      
      <Button
        onClick={onLocationSearch}
        variant="outline"
        className="w-full bg-weather-input border-weather-input-border text-weather-primary hover:bg-white/30 rounded-full py-3"
        disabled={isLoading}
      >
        <MapPin className="w-4 h-4 mr-2" />
        Use Current Location
      </Button>
    </div>
  );
};

export default SearchInput;