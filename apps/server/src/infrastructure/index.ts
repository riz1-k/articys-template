import { closeCache, connectCache } from "./cache";
import { closeDatabase } from "./database";

await connectCache();

export { closeCache, closeDatabase };
