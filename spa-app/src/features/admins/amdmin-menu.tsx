import React, { useEffect, useState } from "react";
import { deleteMenuItem, getMenu } from "../../api/menu-api";
import { MenuItem, PaginationParams } from "../../types/menu-Item";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const intialParams: PaginationParams = {
  pageIndex: 1,
  pageSize: 8,
  sort: "name",
  search: "",
  category: "",
};
export default function AmdminMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [params, setParams] = useState<PaginationParams>(intialParams);
  const [rowsPerPage, setRowsPerPage] = useState(intialParams.pageSize);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  
 


  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setParams({ ...params, pageIndex: newPage + 1 });
  };
  const handleDelete  = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this menu item?",
    );
      if (confirmDelete) {
         try {
      await deleteMenuItem(id);

      setMenuItems((prev) => {
        const updated = prev.filter((item) => item.id !== id);

        if (updated.length === 0 && params.pageIndex > 1) {
          setParams((prev) => ({
            ...prev,
            pageIndex: prev.pageIndex - 1,
          }));
        }

        return updated;
      });
    } catch (error) {
      console.error("Error deleting menu item:", error);
    } 
    }
  
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, intialParams.pageSize));
    setParams({
      ...params,
      pageSize: parseInt(event.target.value, intialParams.pageSize),
    });
  };
  useEffect(() => {
    
    const fetchMenuItems = async () => {
      try {
        const response = await getMenu({ ...params });
        setCount(response.count);
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, [params]);
  return (
    
    <TableContainer component={Paper} sx={{ mt: 15, width: "80%", mx: "auto" }}>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => navigate("/admin/form")}
      >
        Add New Item
      </Button>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Pictures</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Category</TableCell>
            <TableCell sx={{ textAlign: "center" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {menuItems.map((item) => (
            <TableRow
              key={item.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {item.id}
              </TableCell>
              <TableCell>
                <img src={item.pictureUrl} alt={item.name} width={50} />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>${item.price}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  onClick={() => navigate(`/admin/form/`, { state: item })}
                >
                  Edit
                </Button >
                      <Button sx={{ zIndex: 999 }} variant="outlined" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={count}
        page={params.pageIndex - 1}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer >
      
  );
}
