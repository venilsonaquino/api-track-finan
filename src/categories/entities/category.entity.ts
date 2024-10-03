import { ulid } from "ulid";

export class CategoryEntity {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    userId?: string;

    constructor(params: Partial<{
        id: string;
        name: string;
        description: string;
        icon?: string;
        userId?: string;
    }>){
        this.id = params.id || ulid();
        this.name = params.name;
        this.description = params.description;
        this.icon = params.icon;
        this.userId = params.userId;
    }
}
