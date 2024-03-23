import { app, server } from "./app.js";

server.listen(app.get('port'), () => {
    console.log('Servidor inicializado');
});