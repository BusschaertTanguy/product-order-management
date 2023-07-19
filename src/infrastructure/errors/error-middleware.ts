import { ValidationError } from './validation-error';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

const errorMiddleware = (err: ValidationError | ZodError | Error, req: Request, res: Response, next: NextFunction) => {
    if (!err) {
        next(req);
    }

    if (err instanceof ValidationError) {
        res.status(404).send({ errors: [err.message] });
    } else if (err instanceof ZodError) {
        res.status(404).send({ errors: err.errors.map((e) => e.message) });
    } else {
        res.status(500).send({ errors: ['An error occurred, please contact the administrator'] });
    }
};

export default errorMiddleware;
