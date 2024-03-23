//Dependencias de node(winston, url, path)
import { createLogger, format, transports } from "winston";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';



// Obtén la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Utiliza __dirname para construir la ruta completa del archivo de registro
const logFilePath = resolve(__dirname, '../../../reports/loggers.log');

//Desestructuracion de format
const { combine, timestamp, printf, colorize } = format;

//Logger de persolanizable
const logger = createLogger({
    format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(info => `${info.timestamp} - ${info.level}: ${info.message}`),
        format.combine(format.simple())
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            maxsize: 5120000,
            maxFiles: 1000,
            filename: logFilePath,
            level: 'info',
        }),
    ]
});

//Logger de infomacion
const loggerInfo = (message) => {
    logger.info(message);
}

//Registro de información de la ruta
const loggerRouter = (req, res, next) => {
    const start = Date.now();
    const { method, url, path, ip } = req;
    const userAgent = req.get('User-Agent');

    res.on('finish', () => {
        const end = Date.now();
        const responseTime = end - start;
        const statusCode = res.statusCode;

        loggerInfo(`[${method}] ${url} - ${statusCode} - Time-response: ${responseTime}ms - User-Agent: ${userAgent} - ip: ${ip} - Path: ${path}`);
    });

    next();
}

//Registro de informacion en socket
const socketLogger = (socket, next) => {
    socket.onAny((eventName, ...args) => {
        loggerInfo(`Socket Event: ${eventName}, Data: ${JSON.stringify(args)}`);
    });
    next();
};

export { loggerRouter, socketLogger, loggerInfo };
