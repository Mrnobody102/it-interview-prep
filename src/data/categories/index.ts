import { systemCategory } from "./system";
import { backend } from "./backend";
import { frontend } from "./frontend";
import { database } from "./database";
import { devops } from "./devops";
import { aiRobotics } from "./ai-robotics";
import { otherSkills } from "./other-skills";

export const categories = [
  systemCategory,
  backend,
  frontend,
  database,
  devops,
  aiRobotics,
  otherSkills,
];

export type { Topic, Category } from "./types";
