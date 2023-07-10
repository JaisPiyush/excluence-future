import { server } from "./server";
import {Server} from "@hapi/hapi";
import {Logger} from "logger";
import { BaseApiModule } from "./modules/base";
import { StoreFrontModule } from "./modules/store-front.module";
import { getPrismaClient } from "scanner-store";

const modules: typeof BaseApiModule[] = [
    StoreFrontModule
];

const registerAllModules = (server: Server) => {
    const prisma = getPrismaClient()
    modules.forEach((module) => {
        const moduleInstance = new module(prisma);
        moduleInstance.registerHandle(server);
    })
}
export const start = async () => {
    registerAllModules(server)
    Logger.info(`Listening on ${server.settings.host}:${server.settings.port}`);
    return server.start();
}

process.on('unhandledRejection', (err) => {
    Logger.error("unhandledRejection");
    Logger.error(err);
    process.exit(1);
});

process.on("uncaughtException", (err) => {
    Logger.error("unhandledRejection");
    Logger.error(err);
    process.exit(1);
})

try {
    start()
}catch(e) {
    Logger.error(e);
}


