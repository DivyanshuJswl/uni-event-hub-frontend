import { memo, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useMaterialUIController } from "context";
import MDBox from "components/MDBox";

const CategoryFilter = memo(({ categoryFilter, setCategoryFilter, setPage }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Memoized categories
  const categories = useMemo(
    () => [
      { value: "all", label: "All Categories" },
      { value: "workshop", label: "Workshop" },
      { value: "seminar", label: "Seminar" },
      { value: "social", label: "Social" },
      { value: "hackathon", label: "Hackathon" },
      { value: "cultural", label: "Cultural" },
      { value: "technology", label: "Technology" },
    ],
    []
  );

  // Memoized change handler
  const handleChange = useCallback(
    (event) => {
      setCategoryFilter(event.target.value);
      setPage(1);
    },
    [setCategoryFilter, setPage]
  );

  // Memoized label styles
  const labelStyles = useMemo(
    () => ({
      transform: "translate(14px, 16px) scale(1)",
      "&.MuiInputLabel-shrink": {
        transform: "translate(14px, -6px) scale(0.75)",
      },
      color: darkMode ? "white" : "primary.main",
      "&.Mui-focused": {
        color: darkMode ? "white" : "primary.dark",
      },
    }),
    [darkMode]
  );

  // Memoized select styles
  const selectStyles = useMemo(
    () => ({
      color: darkMode ? "white" : "primary.dark",
      height: "2.6rem",
      borderRadius: "0.5rem",
      "& .MuiSelect-select": {
        display: "flex",
        alignItems: "center",
        padding: "14px 14px",
      },
    }),
    [darkMode]
  );

  return (
    <MDBox sx={{ width: "100%", height: "50%" }}>
      <FormControl fullWidth>
        <InputLabel id="category-filter-label" sx={labelStyles}>
          Filter by Category
        </InputLabel>
        <Select
          labelId="category-filter-label"
          value={categoryFilter}
          onChange={handleChange}
          label="Filter by Category"
          sx={selectStyles}
        >
          {categories.map((category) => (
            <MenuItem
              key={category.value}
              value={category.value}
              sx={{
                fontWeight: categoryFilter === category.value ? 600 : 400,
                color: darkMode ? "white" : "primary.main",
              }}
            >
              {category.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </MDBox>
  );
});

CategoryFilter.propTypes = {
  categoryFilter: PropTypes.string.isRequired,
  setCategoryFilter: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
};

CategoryFilter.displayName = "CategoryFilter";

export default CategoryFilter;
