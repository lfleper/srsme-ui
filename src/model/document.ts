import { Chapter } from "./chapter";

export interface Document {
    id: string;
    title: string;
    description: string;
    ownerId: string;
    chapters: Chapter[];
}