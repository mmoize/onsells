import { ProductLocation } from './location.model';
export class Post {
    constructor(
        public id: string,
        public product: [],
        public owner: [],
        public location: ProductLocation,
        public created: Date,
        public updated: Date,


    ) {}
}
