import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

// Data
import data from "layouts/dashboard/components/Leaderboard/data";
import EmojiEvents from "@mui/icons-material/EmojiEvents";
import FilterList from "@mui/icons-material/FilterList";
import { useMaterialUIController } from "context";

const LeaderboardTable = () => {
  const { columns, rows } = data();
  const [menu, setMenu] = useState(null);
  const [filterMenu, setFilterMenu] = useState(null);
  const [timeFilter, setTimeFilter] = useState("6 months");
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const openFilterMenu = ({ currentTarget }) => setFilterMenu(currentTarget);
  const closeFilterMenu = () => setFilterMenu(null);

  const handleTimeFilterChange = (period) => {
    setTimeFilter(period);
    closeFilterMenu();
    // Here you would typically refetch data based on the selected time period
  };

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: darkMode ? "background.default" : "background.paper",
          color: darkMode ? "white" : "text.primary",
          boxShadow: darkMode ? "0 8px 24px rgba(0, 0, 0, 0.3)" : "0 8px 24px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <MenuItem onClick={closeMenu} sx={{ py: 1.5 }}>
        <Icon sx={{ mr: 1 }}>download</Icon>
        Export Data
      </MenuItem>
      <MenuItem onClick={closeMenu} sx={{ py: 1.5 }}>
        <Icon sx={{ mr: 1 }}>refresh</Icon>
        Refresh
      </MenuItem>
      <MenuItem onClick={closeMenu} sx={{ py: 1.5 }}>
        <Icon sx={{ mr: 1 }}>settings</Icon>
        Configure
      </MenuItem>
    </Menu>
  );

  const renderFilterMenu = (
    <Menu
      id="filter-menu"
      anchorEl={filterMenu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(filterMenu)}
      onClose={closeFilterMenu}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: darkMode ? "background.default" : "background.paper",
          color: darkMode ? "white" : "text.primary",
          boxShadow: darkMode ? "0 8px 24px rgba(0, 0, 0, 0.3)" : "0 8px 24px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <MenuItem
        onClick={() => handleTimeFilterChange("7 days")}
        selected={timeFilter === "7 days"}
        sx={{ py: 1.5 }}
      >
        Last 7 days
      </MenuItem>
      <MenuItem
        onClick={() => handleTimeFilterChange("30 days")}
        selected={timeFilter === "30 days"}
        sx={{ py: 1.5 }}
      >
        Last 30 days
      </MenuItem>
      <MenuItem
        onClick={() => handleTimeFilterChange("3 months")}
        selected={timeFilter === "3 months"}
        sx={{ py: 1.5 }}
      >
        Last 3 months
      </MenuItem>
      <MenuItem
        onClick={() => handleTimeFilterChange("6 months")}
        selected={timeFilter === "6 months"}
        sx={{ py: 1.5 }}
      >
        Last 6 months
      </MenuItem>
      <MenuItem
        onClick={() => handleTimeFilterChange("1 year")}
        selected={timeFilter === "1 year"}
        sx={{ py: 1.5 }}
      >
        Last year
      </MenuItem>
    </Menu>
  );

  // Custom styling for the table
  const tableStyles = {
    backgroundColor: darkMode ? "background.default" : "background.paper",
    "& .MuiTableRow-root:hover": {
      backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
    },
    "& .MuiTableRow-head": {
      backgroundColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
    },
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: darkMode ? "0 8px 32px rgba(0, 0, 0, 0.24)" : "0 8px 32px rgba(0, 0, 0, 0.08)",
        overflow: "hidden",
            backgroundColor: darkMode ? "background.default" : "background.paper",

      }}
    >
      {/* Header Section */}
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={3}
        sx={{
          borderBottom: darkMode
            ? "1px solid rgba(255, 255, 255, 0.12)"
            : "1px solid rgba(0, 0, 0, 0.08)",
          backgroundColor: darkMode ? "background.default" : "background.paper",
        }}
      >
        <MDBox>
          <MDTypography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            color={darkMode ? "white" : "dark"}
          >
            Top Participants
          </MDTypography>
          <MDBox display="flex" alignItems="center" gap={1}>
            <Tooltip title="Leaderboard ranking based on participation and achievements">
              <EmojiEvents
                sx={{
                  color: ({ palette: { info } }) => info.main,
                  fontSize: "1.2rem",
                }}
              />
            </Tooltip>
            <MDBox display="flex" alignItems="center" gap={1}>
              <MDTypography variant="button" fontWeight="medium" color="text">
                Showing from last
              </MDTypography>
              <Chip
                label={timeFilter}
                size="small"
                onClick={openFilterMenu}
                icon={<FilterList fontSize="small" />}
                variant="outlined"
                sx={{
                  color: darkMode ? "#fff" : "text.primary",
                  backgroundColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                  borderColor: darkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.06)",
                  },
                }}
              />
            </MDBox>
          </MDBox>
        </MDBox>

        <MDBox display="flex" alignItems="center" gap={1}>
          <Tooltip title="Filter options">
            <Icon
              sx={{
                cursor: "pointer",
                color: "text",
                "&:hover": {
                  color: "primary.main",
                },
              }}
              fontSize="small"
              onClick={openFilterMenu}
            >
              filter_list
            </Icon>
          </Tooltip>
          <Tooltip title="More options">
            <Icon
              sx={{
                cursor: "pointer",
                color: "text",
                "&:hover": {
                  color: "primary.main",
                },
              }}
              fontSize="small"
              onClick={openMenu}
            >
              more_vert
            </Icon>
          </Tooltip>
        </MDBox>

        {renderMenu}
        {renderFilterMenu}
      </MDBox>

      {/* Data Table Section */}
      <MDBox sx={tableStyles}>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={true}
          isSorted={true}
          noEndBorder={false}
          entriesPerPage={false}
          canSearch={false}
          pagination={{
            variant: "gradient",
            color: darkMode ? "secondary" : "info",
          }}
        />
      </MDBox>
    </Card>
  );
};

export default LeaderboardTable;
