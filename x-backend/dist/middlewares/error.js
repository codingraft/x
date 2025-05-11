export const errorMiddleware = (err, req, res, next) => {
    err.message || (err.message = "Internal Server Error");
    err.statusCode || (err.statusCode = 500);
    if (err.name === "CastError")
        err.message = "Invalid ID";
    return res.status(400).json({ message: err.message });
};
// export const TryCatch =
//   (func: ControllerType) =>
//   (req: Request, res: Response, next: NextFunction) => {
//     return Promise.resolve(func(req, res, next)).catch(next);
//   };
