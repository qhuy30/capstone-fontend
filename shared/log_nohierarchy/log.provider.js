class LogProvider {
    static info(message, path, system, action) {
        console.log(`[INFO] [${system}] ${message} (${path} - ${action})`);
    }
}
module.exports = { LogProvider };