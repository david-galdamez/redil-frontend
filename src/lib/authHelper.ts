export function isPublicRoute(path: string, routes: RegExp[]): boolean {
  return routes.some((pattern) => pattern.test(path));
}

export function getRoleRute(path: string, rules: { pattern: RegExp; roles: string[] }[]) {
  return rules.find((rule) => rule.pattern.test(path));
}
