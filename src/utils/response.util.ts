import { Response } from 'express';

export class ResponseFormatter {
  
  static success(res: Response, message: string, data: object = {}, statusCode: number = 200) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data,
    });
  }

  static error(res: Response, statusCode: number = 500, message: string, errors: object = {}) {
    return res.status(statusCode).json({
      status: 'error',
      message,
      errors,
    });
  }

  static created(res: Response, message: string, data: object = {}) {
    return this.success(res, message, data, 201);
  }

  static validationError(res: Response, errors: object = {}) {
    return this.error(res, 400, 'Validation error', errors);
  }
}