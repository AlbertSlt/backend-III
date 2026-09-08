import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { config } from "./env.config.js";

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: "red bold",
        error: "red",
        warning: "yellow",
        info: "green",
        http: "magenta",
        debug: "blue",
    },
};

winston.addColors(customLevels.colors);

const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}] ${message}`;
    })
);

const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}] ${message}`;
    })
);

const isProduction = config.NODE_ENV === "production";

const transports = [
    new DailyRotateFile({
        filename: "logs/error-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        level: "error",
        maxFiles: "14d",
        format: fileFormat,
    }),
    new DailyRotateFile({
        filename: "logs/combined-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        maxFiles: "14d",
        format: fileFormat,
    }),
];

if (!isProduction) {
    transports.push(
        new winston.transports.Console({
            format: consoleFormat,
        })
    );
}

const logger = winston.createLogger({
    levels: customLevels.levels,
    level: isProduction ? "info" : "debug",
    transports,
});

export default logger;