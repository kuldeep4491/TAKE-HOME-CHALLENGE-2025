import { Card } from "@/components/ui/card";
import { Clock, MapPin, Wind, Droplets, Thermometer } from "lucide-react";

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  feelsLike: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  timestamp: string;
}

interface WeatherCardProps {
  weatherData: WeatherData;
}

const WeatherCard = ({ weatherData }: WeatherCardProps) => {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-weather-card/90 backdrop-blur-sm border-0 shadow-2xl p-8 text-center rounded-3xl">
      <div className="space-y-6">
        {/* Location and Date/Time */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">{weatherData.city}</h2>
          <p className="text-gray-600 text-sm">{weatherData.country}</p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatDate(weatherData.timestamp)}</span>
            </div>
            <span>{formatTime(weatherData.timestamp)}</span>
          </div>
        </div>

        {/* Weather Icon */}
        <div className="flex justify-center py-4">
          <div className="w-24 h-16 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center shadow-lg">
            <div className="text-white text-3xl">☁️</div>
          </div>
        </div>

        {/* Temperature and Condition */}
        <div className="space-y-2">
          <div className="text-6xl font-light text-gray-800">{Math.round(weatherData.temperature)}°C</div>
          <p className="text-xl text-gray-600 font-medium">{weatherData.condition}</p>
          <p className="text-sm text-gray-500">Feels like {Math.round(weatherData.feelsLike)}°C</p>
        </div>

        {/* Weather Stats */}
        <div className="grid grid-cols-3 gap-3 mt-8">
          <div className="bg-weather-stat-card/90 rounded-2xl p-4 text-center">
            <div className="text-lg font-semibold text-white">{Math.round(weatherData.feelsLike)}°C</div>
            <div className="text-xs text-white/90 mt-1">Feels Like</div>
          </div>
          <div className="bg-weather-stat-card/90 rounded-2xl p-4 text-center">
            <div className="text-lg font-semibold text-white">{Math.round(weatherData.windSpeed)}</div>
            <div className="text-xs text-white/90 mt-1">km/h Wind</div>
          </div>
          <div className="bg-weather-stat-card/90 rounded-2xl p-4 text-center">
            <div className="text-lg font-semibold text-white">{weatherData.humidity}%</div>
            <div className="text-xs text-white/90 mt-1">Humidity</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeatherCard;