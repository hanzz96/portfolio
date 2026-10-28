import { Bot, Cloud, Coffee, Route } from "@lucide/vue";
import {
  siApachekafka,
  siClaude,
  siDart,
  siDocker,
  siJavascript,
  siLaravel,
  siMongodb,
  siMysql,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siNuxt,
  siPhp,
  siPostgresql,
  siReact,
  siRedis,
  siTypescript,
  siUnrealengine,
  siVuedotjs,
} from "simple-icons";

// Named imports keep the bundle to just these icons (CC0, from simple-icons).
export const brandIcons = {
  javascript: siJavascript,
  typescript: siTypescript,
  php: siPhp,
  dart: siDart,
  nodejs: siNodedotjs,
  nestjs: siNestjs,
  react: siReact,
  vue: siVuedotjs,
  nuxt: siNuxt,
  nextjs: siNextdotjs,
  laravel: siLaravel,
  postgresql: siPostgresql,
  mysql: siMysql,
  redis: siRedis,
  mongodb: siMongodb,
  docker: siDocker,
  kafka: siApachekafka,
  unreal: siUnrealengine,
  claude: siClaude,
};

// simple-icons has no logo for these (its "Hermes" is a different brand), so they use a generic Lucide icon.
export const fallbackIcons = {
  java: { component: Coffee, hex: "ED8B00" },
  lambda: { component: Cloud, hex: "FF9900" },
  hermes: { component: Bot, hex: "F2C94C" },
  ninerouter: { component: Route, hex: "4ADE80" },
};
