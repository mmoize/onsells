

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface ProductLocation extends Coordinates {
    address: string;
    staticMapImageUrl: string;
}
