/// <reference types="astro/client" />

import type { JwtUser } from "./types/user";

declare module "astro" {
    interface Locals {
        user: JwtUser | null;
    }
}