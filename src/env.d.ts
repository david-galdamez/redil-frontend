/// <reference types="astro/client" />

import type { JwtUser, UserDetailsDto } from "./types/user";

declare module "astro" {
  interface Locals {
    user: JwtUser | null;
    token: string | null;
    userProfile: UserDetailsDto | null;
  }
}
