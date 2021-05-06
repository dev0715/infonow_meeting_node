'use strict';

import GlobalConfig from './configs'
import { ConnectionPool } from './database';
import { Logger, LogType } from "./app/utils/logger";
import * as App from './app';

require('source-map-support').install();

export async function Start(): Promise<boolean> {
    let severStarted = false
    try {
        Logger.successBold("* -------------------------------------------------------- *");
        Logger.successBold("|              Attempting to start the Server              |");
        Logger.successBold("* -------------------------------------------------------- *");

        const HttpServerConfig = GlobalConfig?.HTTPServerConfigurations;

        // Initilizing Connection Pool
        await ConnectionPool.init();

        // Enabling Types of Logs Printed
        Logger.logConfig = [LogType.Error, LogType.Debug, LogType.Success, LogType.Info];

        Logger.infoBright("* Attempting to start the Server");
        Logger.info("* This process will start HTTP server...");

        // Starting Http Server
        let expressApp = App.create(HttpServerConfig);
        App.start(expressApp);

        severStarted = true;
    }
    catch (err) {
        Logger.fatalError("* -------------------------------------------------------- *");
        Logger.fatalError("|                Failed to start the Server                |");
        Logger.fatalError("* -------------------------------------------------------- *");
        severStarted = false;
    }
    finally {
        return severStarted
    }
}


(async ()=> {
    Start()
})();





