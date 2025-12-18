/**
 * Result type for handling success/failure in a type-safe way
 * Inspired by Rust's Result<T, E> type
 */

export class Result<T, E = Error> {
    private constructor(
        private readonly success: boolean,
        private readonly _value?: T,
        private readonly _error?: E
    ) { }

    /**
     * Create a successful result
     */
    static ok<T, E = Error>(value: T): Result<T, E> {
        return new Result<T, E>(true, value, undefined);
    }

    /**
     * Create a failed result
     */
    static fail<T, E = Error>(error: E): Result<T, E> {
        return new Result<T, E>(false, undefined, error);
    }

    /**
     * Check if result is successful
     */
    get isSuccess(): boolean {
        return this.success;
    }

    /**
     * Check if result is a failure
     */
    get isFailure(): boolean {
        return !this.success;
    }

    /**
     * Get the value (throws if result is a failure)
     */
    get value(): T {
        if (!this.success) {
            throw new Error('Cannot get value from failed result');
        }
        return this._value!;
    }

    /**
     * Get the error (throws if result is successful)
     */
    get error(): E {
        if (this.success) {
            throw new Error('Cannot get error from successful result');
        }
        return this._error!;
    }

    /**
     * Map the value if successful
     */
    map<U>(fn: (value: T) => U): Result<U, E> {
        if (this.isFailure) {
            return Result.fail(this._error!);
        }
        return Result.ok(fn(this._value!));
    }

    /**
     * Map the error if failed
     */
    mapError<F>(fn: (error: E) => F): Result<T, F> {
        if (this.isSuccess) {
            return Result.ok(this._value!);
        }
        return Result.fail(fn(this._error!));
    }

    /**
     * Chain operations
     */
    flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
        if (this.isFailure) {
            return Result.fail(this._error!);
        }
        return fn(this._value!);
    }

    /**
     * Get value or default
     */
    getOrElse(defaultValue: T): T {
        return this.isSuccess ? this._value! : defaultValue;
    }

    /**
     * Get value or compute default
     */
    getOrElseCompute(fn: (error: E) => T): T {
        return this.isSuccess ? this._value! : fn(this._error!);
    }
}
