import { FC, useEffect, useState } from "react";

export const Clock: FC<{
  options?: Intl.DateTimeFormatOptions;
}> = ({ options }) => {
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setToday(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const displayTime = new Intl.DateTimeFormat("default", {
    day: options?.day,
    month: options?.month,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(today);

  return <>{displayTime}</>;
};
