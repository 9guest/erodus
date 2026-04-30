import colors from 'colors';
import { app } from 'electron';

const log = {
    info: (...args) => {
        console.log(colors.blue('[INFO]'), colors.blue(...args));
    },
    warn: (...args) => {
        console.warn(colors.yellow('[WARN]'), colors.yellow(...args));
    },
    error: (...args) => {
        console.error(colors.red('[ERROR]'), colors.red(...args));
    },
    success: (...args) => {
        console.log(colors.green('[SUCCESS]'), colors.green(...args));
    },
    debug: (...args) => {
        console.debug(colors.cyan('[DEBUG]'), colors.cyan(...args));
    },
    file: (...args) => {
        console.log(colors.magenta('[FILE]'), colors.magenta(...args));
    },
    app: (...args) => {
        console.log(colors.white('[APP]'), colors.white(...args));
    },
    ipc: (...args) => {
        console.log(colors.gray('[IPC]'), colors.gray(...args));
    },
    settings: (...args) => {
        console.log(colors.rainbow('[SETTINGS]'), colors.rainbow(...args));
    }
};

export default log;