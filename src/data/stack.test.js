import { describe, expect, it } from "vitest";
import { brandIcons, fallbackIcons } from "./icons.js";
import { stack } from "./stack.js";

describe("stack data", () => {
  it("has a unique, non-empty name for every item", () => {
    const names = stack.map((item) => item.name);
    expect(names.every((name) => typeof name === "string" && name.length > 0)).toBe(true);
    expect(new Set(names).size).toBe(names.length);
  });

  it.each(stack.map((item) => [item.name, item.icon]))("%s has an icon that can be rendered", (_name, icon) => {
    expect(brandIcons[icon] ?? fallbackIcons[icon]).toBeDefined();
  });

  it("only uses brand icons that carry an SVG path and a hex color", () => {
    for (const icon of Object.values(brandIcons)) {
      expect(icon.path.length).toBeGreaterThan(10);
      expect(icon.hex).toMatch(/^[0-9A-Fa-f]{6}$/);
    }
  });

  it("keeps every item from the original list", () => {
    expect(stack.map((item) => item.name)).toEqual([
      "JavaScript",
      "TypeScript",
      "PHP",
      "Dart",
      "Java",
      "Node.js",
      "NestJS",
      "React",
      "Vue",
      "Nuxt",
      "Next.js",
      "Laravel",
      "PostgreSQL",
      "MySQL",
      "Redis",
      "MongoDB",
      "Docker",
      "Kafka",
      "AWS Lambda",
      "Unreal Engine",
    ]);
  });
});
