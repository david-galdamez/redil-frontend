export const publicRoutes = [
    /^\/login$/,
    /^\/redil\/student\/[^/]+$/
];

export const roleRoutes = [
    {
        pattern: /^\/redil\/register$/,
        roles: ["Admin"],
    },
    {
        pattern: /^\/redil\/[^/]+$/,
        roles: ["Admin"]
    },
    {
        pattern: /^\/teacher(\/.*)?$/,
        roles: ["Admin"],
    },
    {
        pattern: /^\/class\/register$/,
        roles: ["Admin", "Maestro"],
    }
]