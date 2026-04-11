import { PaginationParams } from "../types/menu-Item";

const API_URL = process.env.APP_URL || 'https://localhost:5001';



export async function getMenu(params: PaginationParams) {
  try {
    const query = new URLSearchParams();

    query.append("pageIndex", params.pageIndex.toString());
    query.append("pageSize", params.pageSize.toString());

    if (params.sort) query.append("sort", params.sort);
    if (params.search) query.append("search", params.search);
    if (params.category) query.append("category", params.category);

    const res = await fetch(`${API_URL}/api/menu?${query.toString()}`);

    if (!res.ok) throw new Error("Failed to fetch menu");

    return await res.json();

  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
export async function getMenuById(id:number) {
  const res = await fetch(`${API_URL}/api/menu/${id}`,{
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
}
export async function createMenuItem(item:any) {
  const res = await fetch(`${API_URL}/api/menu`, {
    method: "POST",
    body: JSON.stringify(item),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to create menu item");
  }

  return await res.json();
}
export async function updateMenuItem(id:number, item:any) {
  const res = await fetch(`${API_URL}/api/menu/${id}`, {
    method: "PUT",
    body: JSON.stringify(item),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to update menu item");
  }

  return await res.json();
}
export async function deleteMenuItem(id:number) {
  const res = await fetch(`${API_URL}/api/menu/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete menu item");
  }

  
}