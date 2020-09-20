import { ProductLocation } from './location.model';
export class Post {
    constructor(
        public id: string,
        public product: [],
        public owner: [],
        // public productimages: [],
        public location: ProductLocation,
        public created_at: Date,
        public updated_at: Date,
        public viewcount: string,


    ) {}
}
