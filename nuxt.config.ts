// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
import { resolve } from "path";

export default defineNuxtConfig({
  devtools: { enabled: true },
  alias: {
    "@": resolve(__dirname, "/"),
  },
  app: {
    head: {
      charset: "utf-8",
      title: "ville",
      viewport: "width=device-width, initial-scale=1",
    },
  },
  css: ["~/assets/main.scss"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ["nuxt-icon"],
  runtimeConfig: {
    public: {
      host: process.env.BACKEND_HOST,
    },
  },
});
