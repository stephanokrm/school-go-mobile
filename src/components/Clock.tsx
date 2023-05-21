import { FC, useEffect, useState } from "react";

const format = (date: Date, options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("default", {
    day: options?.day,
    month: options?.month,
    hour: "numeric",
    minute: "numeric",
  }).format(date);

export const Clock: FC<{
  options?: Intl.DateTimeFormatOptions;
}> = ({ options }) => {
  const [dateTime, setDateTime] = useState(() => format(new Date(), options));

  useEffect(() => {
    const interval = setInterval(
      () => setDateTime(format(new Date(), options)),
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [options]);

  return <>{dateTime}</>;
};
