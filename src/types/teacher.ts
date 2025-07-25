import type { BaseEntity } from "./common";

// Teacher entity
export interface Teacher extends BaseEntity {
    name: string;
    subject: string;
}
