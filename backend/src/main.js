import config from "./config";
import initServer from "./server";

initServer(config).catch(console.error);