import { useEffect } from "react";
import SearchInput from "@/components/SearchInput";
import WeatherCard from "@/components/WeatherCard";
import { useWeather } from "@/hooks/useWeather";
import { Cloud } from "lucide-react";

const Index = () => {
  const { weatherData, isLoading, searchWeather, searchWeatherByLocation } = useWeather();

  // Load default weather for London on initial load
  useEffect(() => {
    searchWeather("London");
  }, [searchWeather]);

  return (
    <div className="min-h-screen bg-weather-gradient flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-4xl md:text-5xl font-light text-weather-primary">Weather Now</h1>
            <Cloud className="w-8 h-8 md:w-10 md:h-10 text-weather-primary" />
          </div>
          <p className="text-weather-secondary text-lg">Check current weather conditions for any city</p>
        </div>

        {/* Search Input */}
        <SearchInput 
          onSearch={searchWeather}
          onLocationSearch={searchWeatherByLocation}
          isLoading={isLoading}
        />

        {/* Weather Card */}
        {weatherData && (
          <WeatherCard weatherData={weatherData} />
        )}

        {/* Loading State */}
        {isLoading && !weatherData && (
          <div className="text-center text-weather-primary">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-weather-primary mx-auto"></div>
            <p className="mt-2">Loading weather data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
