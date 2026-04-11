export interface MenuItem {
  id: number
  name: string
  description: string
  pictureUrl: string
  price: number
  category: string
}
export interface PaginationParams{
  pageIndex: number;
  pageSize: number;
  sort?: string;
  search?: string;
  category?: string;
};