export const appConfig = {
  name: "Fatima Yaghi",
  description: "Life coaching for Lebanese women ready to unlock their potential",
  supportEmail: "fatima.ali.yaghi.1987@gmail.com",

  brand: {
    name: "Fatima Yaghi",
    shortName: "Fatima",
    tagline: "Unlock Your Potential | أطلقي إمكاناتك",
  },

  auth: {
    enableSignUp: false,
    enablePasswordReset: true,
  },

  dashboard: {
    defaultRoute: "/dashboard/sessions",
    showSettings: true,
    navigation: [
      { title: "My Sessions", url: "/dashboard/sessions" },
      { title: "Tools", url: "/dashboard/tools" },
      { title: "Settings", url: "/dashboard/settings" },
    ],
  },
} as const;

export type AppConfig = typeof appConfig;
