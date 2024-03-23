//Middleware de rutas erroneas  
const routersError = (req, res, next) => {

    //Extra el metodo y la url del objeto
    const { method, originalUrl } = req

    //Crea un nuevo error y le pone un mensaje
    const error = new Error(`Route not found for ${method} ${originalUrl}`);

    //Le pongo un titulo y el status
    error.title = 'Error router'
    error.status = 404;

    next(error);
}

export default routersError