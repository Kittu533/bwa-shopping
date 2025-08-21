export type actionResult = {
    success?: boolean
    message?: string
    error?: string
}

export type Tproduct = {
  id: number;
  image_url: string[]; // ubah jadi array of string
  name: string;
  category_name: string;
  price: number;
};
