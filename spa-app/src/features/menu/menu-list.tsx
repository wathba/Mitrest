import React, { useEffect, useState } from "react";
import { MenuItem, PaginationParams } from "../../types/menu-Item";
import { getMenu } from "../../api/menu-api";

import {
  SelectChangeEvent,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Button,
  Pagination,
  MenuItem as MuiMenuItem,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { MenuItemCard } from "./menu-Item";

const intialParams: PaginationParams = {
  pageIndex: 1,
  pageSize: 8,
  sort: "name",
  search: "",
  category: "",
};

export default function Menulist() {
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [params, setParams] = useState<PaginationParams>(intialParams);
  const isMobile = useMediaQuery("(max-width:741px)");
  const pageSizeOptions = [4, 8, 12, 16];
  const categoryOptions = [
    "All",
    "Appetizers",
    "Sandwiches",
    "Sides",
    "Desserts",
    "Entrees",
  ];

  const handelCategoryChange = (category: string) => {
    if (category === "All") {
      setParams(intialParams);
      return;
    }
    setParams((prev) => ({
      ...prev,
      category: category,
      pageIndex: 1,
    }));
  };
  useEffect(() => {
    const getMenuList = async () => {
      try {
        const data = await getMenu({ ...params });
        setMenuList(data.data);
        setTotalCount(data.count);
      } catch (error) {
        console.error(error);
      }
    };
    getMenuList();
  }, [params]);

  // 🔍 SEARCH
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams((prev) => ({
      ...prev,
      search: e.target.value,
      pageIndex: 1,
    }));
  };

  // 🔃 SORT
  const handleSort = (e: SelectChangeEvent) => {
    setParams((prev) => ({
      ...prev,
      sort: e.target.value,
      pageIndex: 1,
    }));
  };

  // 📄 PAGINATION
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setParams((prev) => ({
      ...prev,
      pageIndex: value,
    }));
  };

  return (
    <Box sx={{ mt: 12, px: 3 }}>
      {isMobile && (
        <Box sx={{ display: "block", mb: 3 }}>
          <Box sx={{ display: "flex", gap: 1, flexShrink: 2, mb: 2 }}>
            <Typography variant="h5">Filter by:</Typography>

            <FormControl sx={{ minWidth: 150 }}>
              <Select
                value={params.category}
                onChange={(e) => handelCategoryChange(e.target.value)}
              >
                {categoryOptions.map((category) => (
                  <MuiMenuItem value={category}>{category}</MuiMenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <TextField
            label="Search"
            value={params.search}
            onChange={handleSearch}
          />
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Sort</InputLabel>
              <Select value={params.sort} onChange={handleSort}>
                <MuiMenuItem value="name">Alphabetical</MuiMenuItem>
                <MuiMenuItem value="priceAsc">Low → High</MuiMenuItem>
                <MuiMenuItem value="priceDesc">High → Low</MuiMenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}
      {!isMobile && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Typography variant="h5">Filter by:</Typography>
            {categoryOptions.map((category) => (
              <Button
                key={category}
                size="small"
                title={`Show ${category} items`}
                variant={
                  params.category === category ? "contained" : "outlined"
                }
                onClick={() => handelCategoryChange(category)}
              >
                {category}
              </Button>
            ))}
          </Box>
          <TextField
            label="Search"
            value={params.search}
            onChange={handleSearch}
          />
          <Box sx={{ display: "flex", gap: 1 }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Sort</InputLabel>
              <Select value={params.sort} onChange={handleSort}>
                <MuiMenuItem value="name">Alphabetical</MuiMenuItem>
                <MuiMenuItem value="priceAsc">Low → High</MuiMenuItem>
                <MuiMenuItem value="priceDesc">High → Low</MuiMenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}
      {isMobile ? (
        <Grid container  sx={{ width: "auto", mr: "auto", ml: "auto" }}>
          {menuList.map((item) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
              key={item.id}
              sx={{ mb: 2, border: "none", width:"auto" ,mr: "auto", ml: "auto" }}
            >
              <MenuItemCard item={item} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={1} >
          {menuList.map((item) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
              key={item.id}
              sx={{display: "flex", mb: 2}}
            >
              <MenuItemCard item={item} />
            </Grid>
          ))}
        </Grid>
      )}
 {isMobile? ( <Box sx={{ display: "flex", flexDirection: "column", mb: 2,mt:2, alignItems: "center", gap: 1 }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="subtitle1" color="text.secondary">
            Page Size:
          </Typography>
          {pageSizeOptions.map((size) => (
            <Button
              key={size}
              size="small"
              title={`Show ${size} items per page`}
              variant={params.pageSize === size ? "contained" : "outlined"}
              onClick={() =>
                setParams((prev) => ({ ...prev, pageSize: size, pageIndex: 1 }))
              }
            >
              {size}
            </Button>
          ))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center",mt:4 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Page {params.pageIndex} of {Math.ceil(totalCount / params.pageSize)}
            :
          </Typography>
          <Pagination
            count={Math.ceil(totalCount / params.pageSize)}
            page={params.pageIndex}
            onChange={handlePageChange}
          />
        </Box>
      </Box>):( <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="subtitle1" color="text.secondary">
            Page Size:
          </Typography>
          {pageSizeOptions.map((size) => (
            <Button
              key={size}
              size="small"
              title={`Show ${size} items per page`}
              variant={params.pageSize === size ? "contained" : "outlined"}
              onClick={() =>
                setParams((prev) => ({ ...prev, pageSize: size, pageIndex: 1 }))
              }
            >
              {size}
            </Button>
          ))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center",mt:4 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Page {params.pageIndex} of {Math.ceil(totalCount / params.pageSize)}
            :
          </Typography>
          <Pagination
            count={Math.ceil(totalCount / params.pageSize)}
            page={params.pageIndex}
            onChange={handlePageChange}
          />
        </Box>
      </Box>)}
     
    </Box>
  );
}
