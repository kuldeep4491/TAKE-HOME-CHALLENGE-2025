import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

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

interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchCoordinates = async (cityName: string): Promise<Location> => {
    const response = await fetch(`${GEOCODING_API}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`);
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error("City not found");
    }

    const result = data.results[0];
    return {
      latitude: result.latitude,
      longitude: result.longitude,
      city: result.name,
      country: result.country || "Unknown"
    };
  };

  const fetchWeatherData = async (latitude: number, longitude: number): Promise<any> => {
    const response = await fetch(
      `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,apparent_temperature&timezone=auto`
    );
    const data = await response.json();
    return data;
  };

  const getWeatherCondition = (weatherCode: number): string => {
    if (weatherCode === 0) return "Clear";
    if (weatherCode <= 3) return "Partly Cloudy";
    if (weatherCode <= 48) return "Cloudy";
    if (weatherCode <= 67) return "Rainy";
    if (weatherCode <= 77) return "Snowy";
    return "Stormy";
  };

  const searchWeather = useCallback(async (cityName: string) => {
    setIsLoading(true);
    try {
      const location = await fetchCoordinates(cityName);
      const weather = await fetchWeatherData(location.latitude, location.longitude);
      
      const currentHour = new Date().getHours();
      const humidity = weather.hourly.relativehumidity_2m[currentHour] || 50;
      const feelsLike = weather.hourly.apparent_temperature[currentHour] || weather.current_weather.temperature;

      const weatherData: WeatherData = {
        city: location.city,
        country: location.country,
        temperature: weather.current_weather.temperature,
        condition: getWeatherCondition(weather.current_weather.weathercode),
        feelsLike: feelsLike,
        windSpeed: weather.current_weather.windspeed,
        humidity: Math.round(humidity),
        icon: "☁️",
        timestamp: weather.current_weather.time
      };

      setWeatherData(weatherData);
      toast({
        title: "Weather Updated",
        description: `Found weather data for ${location.city}, ${location.country}`,
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch weather data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const searchWeatherByLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Error",
        description: "Geolocation is not supported by this browser",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weather = await fetchWeatherData(latitude, longitude);
          
          // Try to get city name from reverse geocoding
          const geoResponse = await fetch(`${GEOCODING_API}?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`);
          const geoData = await geoResponse.json();
          
          const currentHour = new Date().getHours();
          const humidity = weather.hourly.relativehumidity_2m[currentHour] || 50;
          const feelsLike = weather.hourly.apparent_temperature[currentHour] || weather.current_weather.temperature;
          
          const cityName = geoData.results?.[0]?.name || "Current Location";
          const country = geoData.results?.[0]?.country || "Unknown";

          const weatherData: WeatherData = {
            city: cityName,
            country: country,
            temperature: weather.current_weather.temperature,
            condition: getWeatherCondition(weather.current_weather.weathercode),
            feelsLike: feelsLike,
            windSpeed: weather.current_weather.windspeed,
            humidity: Math.round(humidity),
            icon: "☁️",
            timestamp: weather.current_weather.time
          };

          setWeatherData(weatherData);
          toast({
            title: "Location Weather",
            description: `Found weather data for your current location`,
          });
        } catch (error) {
          console.error("Error fetching weather:", error);
          toast({
            title: "Error",
            description: "Failed to fetch weather for your location",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);
        toast({
          title: "Location Error",
          description: "Unable to access your location",
          variant: "destructive",
        });
      }
    );
  }, [toast]);

  return {
    weatherData,
    isLoading,
    searchWeather,
    searchWeatherByLocation,
  };
};