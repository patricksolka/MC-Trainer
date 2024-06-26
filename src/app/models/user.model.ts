import {Stats} from "./stats.model";

//TODO: Interface or class?
export class User {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    //password: string;
    stats: Stats;
    favoriteCategories: { id: string, name: string, timestamp: number}[];
    //favoriteCategories: string[] = [];
    //favoriteCategoriesWithTimestamps:{[categoryId: string]: number};
    //favoriteCategories:[]= [];

    constructor() {
        // this.favoriteCategories = [];
    }
}


