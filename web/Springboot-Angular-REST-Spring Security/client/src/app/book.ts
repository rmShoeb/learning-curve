import { Author } from "./author";

export interface Book{
    id: number,
    title: string,
    published: Date,
    author: Author
}
