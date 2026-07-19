class BaseError extends Error {
  name: string;
  action: string;
  statusCode: number;

  constructor({
    message,
    cause,
    statusCode,
  }: {
    message?: string;
    cause?: Error;
    action?: string;
    statusCode?: number;
  }) {
    super(message || "A generic error occurred", { cause });
    this.name = "BaseError";
    this.action = "Contact the support team";
    this.statusCode = statusCode || 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class InternalServerError extends BaseError {
  constructor({ cause, statusCode }: { cause?: Error; statusCode?: number }) {
    super({ message: "A not handled error occurred", cause });
    this.name = "InternalServerError";
    this.action = "Contact the support team";
    this.statusCode = statusCode || 500;
  }
}

export class ServiceError extends BaseError {
  constructor({ cause, message }: { cause?: Error; message?: string }) {
    super({ message: message || "Service unavailable in this moment", cause });
    this.name = "ServiceError";
    this.action = "Verify if the service is available";
    this.statusCode = 503;
  }
}

export class ValidationError extends BaseError {
  constructor({
    cause,
    message,
    action,
  }: {
    cause?: Error;
    message?: string;
    action?: string;
  }) {
    super({ message: message || "A validation error occurred", cause });
    this.name = "ValidationError";
    this.action = action || "Verify sent data and try again";
    this.statusCode = 400;
  }
}

export class MethodNotAllowedError extends BaseError {
  constructor() {
    super({ message: "A not allowed method was used on this endpoint" });
    this.name = "MethodNotAllowedError";
    this.action = "Verify your request method is valid for this endpoint";
    this.statusCode = 405;
  }
}
