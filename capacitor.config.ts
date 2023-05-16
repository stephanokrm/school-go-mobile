import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "SchoolGo",
  webDir: "dist",
  server: {
    androidScheme: "https",
    hostname: "mobile.schoolgo.com.br",
  },
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
  },
};

export default config;
