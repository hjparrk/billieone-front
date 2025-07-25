import type { BaseEntity } from "./common";

export interface Student extends BaseEntity {
    name: string;
    email: string;
}