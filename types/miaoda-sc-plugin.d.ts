declare module "miaoda-sc-plugin" {
  import type { PluginOption } from "vite";

  export function miaodaDevPlugin(...args: unknown[]): PluginOption;
}
