export const publicRoutes = [
    /^\/login$/,
    /^\/redil\/[^/]+$/
];

export const roleRoutes = [
    {
        pattern: /^\/redil\/register$/,
        roles: ["Admin"],
    },
    {
        pattern: /^\/teacher\/register$/,
        roles: ["Admin"],
    },
    {
        pattern: /^\/class\/register$/,
        roles: ["Admin", "Maestro"],
    }
]