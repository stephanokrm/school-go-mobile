import { useEffect, useState } from "react";
import { getHours } from "date-fns";
import { moon, partlySunny, sunny } from "ionicons/icons";

export const useGreeting = () => {
  const [today, setToday] = useState(new Date());

  const hours = getHours(today);

  useEffect(() => {
    const interval = setInterval(() => setToday(new Date()), 3600000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (hours < 12)
    return {
      label: "Bom dia",
      icon: partlySunny,
    };

  if (hours < 18)
    return {
      label: "Boa tarde",
      icon: sunny,
    };

  return {
    label: "Boa noite",
    icon: moon,
  };
};
