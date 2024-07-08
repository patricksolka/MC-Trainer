/**
 * @fileoverview Diese Datei enthält die Definitionen der Klassen Category, Stats und User.
 */

/**
 * @class Category
 * @description Diese Klasse repräsentiert eine Kategorie mit ihren Eigenschaften.
 */
export class Category {
    [key: string]: any;

    id: string; // Firebase generiert automatisch eine ID
    name: string;
    questionCount?: number; // Anzahl der Fragen
    imagePath?: string;
    imageLoaded?: boolean = false;
    done?: boolean = false;

}
