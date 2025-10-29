import { useState, useMemo, useCallback } from "react";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import data from "layouts/dashboard/components/Leaderboard/data";
import EmojiEvents from "@mui/icons-material/EmojiEvents";
import FilterList from "@mui/icons-material/FilterList";
import { useMaterialUIController } from "context";

const LeaderboardTable = () => {
  // ✅ Memoize the table data to prevent recreation
  const tableData = useMemo(() => data(), []);
  const { columns, rows } = tableData;

  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Consolidated menu state
  const [menuState, setMenuState] = useState({
    main: null,
    filter: null,
  });
  const [timeFilter, setTimeFilter] = useState("6 months");

  // Memoized menu handlers
  const openMenu = useCallback((event) => {
    setMenuState((prev) => ({ ...prev, main: event.currentTarget }));
  }, []);

  const closeMenu = useCallback(() => {
    setMenuState((prev) => ({ ...prev, main: null }));
  }, []);

  const openFilterMenu = useCallback((event) => {
    setMenuState((prev) => ({ ...prev, filter: event.currentTarget }));
  }, []);

  const closeFilterMenu = useCallback(() => {
    setMenuState((prev) => ({ ...prev, filter: null }));
  }, []);

  const handleTimeFilterChange = useCallback(
    (period) => {
      setTimeFilter(period);
      closeFilterMenu();
    },
    [closeFilterMenu]
  );

  // Memoized menu styles
  const menuPaperStyles = useMemo(
    () => ({
      backgroundColor: "background.default",
      color: "text.main",
      boxShadow: darkMode ? "0 8px 24px rgba(0, 0, 0, 0.3)" : "0 8px 24px rgba(0, 0, 0, 0.1)",
    }),
    [darkMode]
  );

  // Memoized table styles
  const tableStyles = useMemo(
    () => ({
      backgroundColor: "background.default",
      "& .MuiTableRow-root:hover": {
        backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
      },
      "& .MuiTableRow-head": {
        backgroundColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
      },
    }),
    [darkMode]
  );

  // Memoized card styles
  const cardStyles = useMemo(
    () => ({
      borderRadius: 2,
      boxShadow: darkMode ? "0 8px 32px rgba(0, 0, 0, 0.24)" : "0 8px 32px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      backgroundColor: "background.default",
    }),
    [darkMode]
  );

  // Time filter options
  const timeFilters = useMemo(() => ["7 days", "30 days", "3 months", "6 months", "1 year"], []);

  return (
    <Card sx={cardStyles}>
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
          backgroundColor: "background.default",
        }}
      >
        <MDBox>
          <MDTypography variant="h5" fontWeight="bold" gutterBottom>
            Top Participants
          </MDTypography>
          <MDBox display="flex" alignItems="center" gap={1}>
            <Tooltip title="Leaderboard ranking based on participation and achievements">
              <EmojiEvents sx={{ color: "info.main", fontSize: "1.2rem" }} />
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
                "&:hover": { color: "primary.main" },
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
                "&:hover": { color: "primary.main" },
              }}
              fontSize="small"
              onClick={openMenu}
            >
              more_vert
            </Icon>
          </Tooltip>
        </MDBox>

        {/* Main Menu */}
        <Menu
          anchorEl={menuState.main}
          open={Boolean(menuState.main)}
          onClose={closeMenu}
          sx={{ "& .MuiPaper-root": menuPaperStyles }}
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

        {/* Filter Menu */}
        <Menu
          anchorEl={menuState.filter}
          open={Boolean(menuState.filter)}
          onClose={closeFilterMenu}
          sx={{ "& .MuiPaper-root": menuPaperStyles }}
        >
          {timeFilters.map((period) => (
            <MenuItem
              key={period}
              onClick={() => handleTimeFilterChange(period)}
              selected={timeFilter === period}
              sx={{ py: 1.5 }}
            >
              Last {period}
            </MenuItem>
          ))}
        </Menu>
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
        />
      </MDBox>
    </Card>
  );
};

export default LeaderboardTable;
