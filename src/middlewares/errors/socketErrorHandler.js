//Middleware de errores de socket
const socketErrorHandler = (socket, next) => {
    
    // Capturar cualquier error que ocurra en las conexiones del socket
    socket.on('server-error', (err) => {
        // Llamar al middleware de manejo de errores
        socketErrorHandler(err);
    });

    // Continuar con la ejecución del socket
    next();
};

export default socketErrorHandler;
