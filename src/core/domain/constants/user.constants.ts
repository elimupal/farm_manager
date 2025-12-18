/**
 * Domain constants for User/Employee aggregate
 */

export enum UserRole {
    OWNER = 'OWNER',
    MANAGER = 'MANAGER',
    SUPERVISOR = 'SUPERVISOR',
    WORKER = 'WORKER',
    AGRONOMIST = 'AGRONOMIST',
}

export enum EmployeeStatus {
    ACTIVE = 'ACTIVE',
    ON_LEAVE = 'ON_LEAVE',
    TERMINATED = 'TERMINATED',
}

export const USER_CONSTRAINTS = {
    PASSWORD_MIN_LENGTH: 8,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
} as const;

export const USER_ROLE_LABELS: Record<UserRole, string> = {
    [UserRole.OWNER]: 'Owner',
    [UserRole.MANAGER]: 'Manager',
    [UserRole.SUPERVISOR]: 'Supervisor',
    [UserRole.WORKER]: 'Worker',
    [UserRole.AGRONOMIST]: 'Agronomist',
};

export const EMPLOYEE_STATUS_LABELS: Record<EmployeeStatus, string> = {
    [EmployeeStatus.ACTIVE]: 'Active',
    [EmployeeStatus.ON_LEAVE]: 'On Leave',
    [EmployeeStatus.TERMINATED]: 'Terminated',
};
