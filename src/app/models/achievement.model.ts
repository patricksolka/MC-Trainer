import {Stats} from './stats.model';

export interface Achievement {
    condition: (stats: Stats) => boolean;
    description: string;
    id: number;
    name: string;
    icon: string;
}
