export interface Thumbnail {
    url: string;
    height: number;
    width: number;
}

export interface Thumbnails {
    large: Thumbnail;
    medium: Thumbnail;
    small: Thumbnail;
}