import { FC, useEffect, useState } from "react";

export const Clock: FC = () => {
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setToday(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const displayTime = new Intl.DateTimeFormat("default", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).format(today);

  return <>{displayTime}</>;
};
