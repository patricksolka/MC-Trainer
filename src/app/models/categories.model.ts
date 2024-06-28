
export class Category {
    [key: string]: any;

    id: string; // Firebase generiert automatisch eine ID
    name: string;
    questionCount?: number; // Anzahl der Fragen
    //lastViewed: number;
    imagePath?: string;
   imageLoaded?: boolean = false;
}
