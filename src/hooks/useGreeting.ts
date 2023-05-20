import { useEffect, useState } from "react";
import { getHours } from "date-fns";
import { moonOutline, partlySunnyOutline, sunnyOutline } from "ionicons/icons";

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
      icon: partlySunnyOutline,
    };

  if (hours < 18)
    return {
      label: "Boa tarde",
      icon: sunnyOutline,
    };

  return {
    label: "Boa noite",
    icon: moonOutline,
  };
};
