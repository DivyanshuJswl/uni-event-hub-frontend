import PropTypes from "prop-types";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { useMaterialUIController } from "context";
import MDBox from "components/MDBox";

const CategoryFilter = ({ categoryFilter, setCategoryFilter, setPage }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  {
    /* "workshop", "seminar", "social", "hackathon", "cultural", "technology", */
  }

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "workshop", label: "Workshop" },
    { value: "seminar", label: "Seminar" },
    { value: "social", label: "Social" },
    { value: "hackathon", label: "Hackathon" },
    { value: "cultural", label: "Cultural" },
    { value: "technology", label: "Technology" },
  ];

  const handleChange = (event) => {
    setCategoryFilter(event.target.value);
    setPage(1); // Reset to first page when filtering
  };

  return (
    <MDBox sx={{ width: "100%", height: "50%" }}>
      <FormControl fullWidth>
        <InputLabel
          id="category-filter-label"
          sx={{
            fontSize: "0.95rem",
            transform: "translate(14px, 16px) scale(1)", // Adjust for taller field
            "&.MuiInputLabel-shrink": {
              transform: "translate(14px, -6px) scale(0.75)",
            },
            color: darkMode ? "white" : "primary",
            "&.Mui-focused": {
              color: darkMode ? "white" : "primary.dark",
            },
          }}
        >
          Filter by Category
        </InputLabel>
        <Select
          labelId="category-filter-label"
          value={categoryFilter}
          onChange={handleChange}
          label="Filter by Category"
          sx={{
            color: darkMode ? "white" : "primary.dark",
            height: "48px", // Increased from default height
            borderRadius: "8px",
            border: "2px",
            // Better vertical centering of content
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              padding: "14px 14px", // Increased vertical padding
            },
          }}
          // Rest of your props remain the same
        >
          {categories.map((category) => (
            <MenuItem
              key={category.value}
              value={category.value}
              sx={{
                fontWeight: categoryFilter === category.value ? 600 : 400,
                color: darkMode ? "white" : "primary",
              }}
            >
              {category.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </MDBox>
  );
};

CategoryFilter.propTypes = {
  categoryFilter: PropTypes.string.isRequired,
  setCategoryFilter: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default CategoryFilter;
