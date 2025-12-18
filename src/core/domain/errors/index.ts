/**
 * Business logic errors - should not be caught internally
 */

export class DomainError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DomainError';
        Object.setPrototypeOf(this, DomainError.prototype);
    }
}

export class ValidationError extends DomainError {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export class BusinessRuleViolationError extends DomainError {
    constructor(message: string) {
        super(message);
        this.name = 'BusinessRuleViolationError';
        Object.setPrototypeOf(this, BusinessRuleViolationError.prototype);
    }
}

export class NotFoundError extends DomainError {
    constructor(
        public readonly entityName: string,
        public readonly entityId?: string
    ) {
        const message = entityId
            ? `${entityName} with id ${entityId} not found`
            : `${entityName} not found`;
        super(message);
        this.name = 'NotFoundError';
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export class ConflictError extends DomainError {
    constructor(message: string) {
        super(message);
        this.name = 'ConflictError';
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}

/**
 * Infrastructure errors - can be caught and handled
 */
export class InfrastructureError extends Error {
    constructor(message: string, public readonly cause?: Error) {
        super(message);
        this.name = 'InfrastructureError';
        Object.setPrototypeOf(this, InfrastructureError.prototype);
    }
}
