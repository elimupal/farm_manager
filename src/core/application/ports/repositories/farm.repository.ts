/**
 * Farm Repository Interface (Port)
 */

export interface Farm {
    id: string;
    name: string;
    totalArea: number;
}

export interface IFarmRepository {
    findById(id: string): Promise<Farm | null>;
    exists(id: string): Promise<boolean>;
}
