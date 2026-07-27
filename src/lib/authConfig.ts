export const publicRoutes = [/^\/login$/, /^\/redil\/student\/[^/]+$/, /^\/assist\/[^/]+$/];

export const roleRoutes = [
  {
    pattern: /^\/redil\/register$/,
    roles: ["Admin"],
  },
  {
    pattern: /^\/redil\/[^/]+$/,
    roles: ["Admin"],
  },
  {
    pattern: /^\/redil$/,
    roles: ["Admin"],
  },
  {
    pattern: /^\/teacher(\/.*)?$/,
    roles: ["Admin"],
  },
  {
    pattern: /^\/class(\/.*)?$/,
    roles: ["Admin", "Maestro"],
  },
  {
    pattern: /^\/profile(\/.*)?$/,
    roles: ["Admin", "Maestro"],
  },
  {
    pattern: /^\/my-redil(\/.*)?$/,
    roles: ["Admin", "Maestro"],
  },
];
