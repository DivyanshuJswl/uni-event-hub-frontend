import React, { useMemo, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useTable, usePagination, useGlobalFilter, useAsyncDebounce, useSortBy } from "react-table";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Icon from "@mui/material/Icon";
import Autocomplete from "@mui/material/Autocomplete";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDPagination from "components/MDPagination";
import { useMaterialUIController } from "context";

// DataTableHeadCell Component
function DataTableHeadCell({ width, children, sorted, align, darkMode, ...rest }) {
  const [controller] = useMaterialUIController();
  const { darkMode: contextDarkMode } = controller;
  const isDark = darkMode !== undefined ? darkMode : contextDarkMode;
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const isTextOverflowing = textRef.current.scrollWidth > textRef.current.clientWidth;
      setIsOverflowing(isTextOverflowing);
    }
  }, [children]);

  const cellContent = (
    <MDBox
      ref={textRef}
      sx={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        maxWidth: "100%",
        display: "block",
      }}
    >
      {children}
    </MDBox>
  );

  return (
    <MDBox
      component="th"
      width={width}
      py={1.5}
      px={2}
      sx={({ palette: { light }, borders: { borderWidth } }) => ({
        borderBottom: `${borderWidth[1]} solid ${light.main}`,
      })}
    >
      <MDBox
        {...rest}
        position="relative"
        textAlign={align}
        color={isDark ? "white" : "black"}
        sx={({ typography: { size, fontWeightBold } }) => ({
          fontSize: size.xxs,
          fontWeight: fontWeightBold,
          textTransform: "uppercase",
          cursor: sorted && "pointer",
          userSelect: sorted && "none",
        })}
      >
        {isOverflowing ? (
          <Tooltip title={children} placement="top" arrow>
            {cellContent}
          </Tooltip>
        ) : (
          cellContent
        )}

        {sorted && (
          <MDBox
            position="absolute"
            top={0}
            right={align !== "right" ? "16px" : 0}
            left={align === "right" ? "-5px" : "unset"}
            sx={({ typography: { size } }) => ({
              fontSize: size.lg,
            })}
          >
            <MDBox
              position="absolute"
              top={-6}
              color={sorted === "asce" ? "text" : "secondary"}
              opacity={sorted === "asce" ? 1 : 0.5}
            >
              <Icon>arrow_drop_up</Icon>
            </MDBox>
            <MDBox
              position="absolute"
              top={0}
              color={sorted === "desc" ? "text" : "secondary"}
              opacity={sorted === "desc" ? 1 : 0.5}
            >
              <Icon>arrow_drop_down</Icon>
            </MDBox>
          </MDBox>
        )}
      </MDBox>
    </MDBox>
  );
}

DataTableHeadCell.defaultProps = {
  width: "auto",
  sorted: "none",
  align: "left",
  darkMode: undefined,
};

DataTableHeadCell.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node.isRequired,
  sorted: PropTypes.oneOf([false, "none", "asce", "desc"]),
  align: PropTypes.oneOf(["left", "right", "center"]),
  darkMode: PropTypes.bool,
};

// DataTableBodyCell Component
function DataTableBodyCell({ noBorder, align, children, darkMode }) {
  const [controller] = useMaterialUIController();
  const { darkMode: contextDarkMode } = controller;
  const isDark = darkMode !== undefined ? darkMode : contextDarkMode;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const isTextOverflowing = textRef.current.scrollWidth > textRef.current.clientWidth;
      setIsOverflowing(isTextOverflowing);
    }
  }, [children]);

  // For PC, allow text to wrap as paragraphs
  // For mobile, keep the existing behavior
  const cellContent = (
    <MDBox
      ref={textRef}
      sx={{
        overflow: "hidden",
        textOverflow: isMobile ? "ellipsis" : "clip",
        whiteSpace: isMobile ? "nowrap" : "normal",
        wordBreak: "break-word",
        display: "block",
        lineHeight: 1.4,
      }}
    >
      {children}
    </MDBox>
  );

  return (
    <MDBox
      component="td"
      textAlign={align}
      py={1.5}
      px={2}
      sx={({ palette: { light }, typography: { size }, borders: { borderWidth } }) => ({
        fontSize: size.sm,
        borderBottom: noBorder ? "none" : `${borderWidth[1]} solid ${light.main}`,
        color: isDark ? "white" : "text.primary",
      })}
    >
      <MDBox display="inline-block" width="100%" sx={{ verticalAlign: "middle" }}>
        {isOverflowing && !isMobile ? (
          <Tooltip title={children} placement="top" arrow>
            {cellContent}
          </Tooltip>
        ) : (
          cellContent
        )}
      </MDBox>
    </MDBox>
  );
}

DataTableBodyCell.defaultProps = {
  noBorder: false,
  align: "left",
  darkMode: undefined,
};

DataTableBodyCell.propTypes = {
  children: PropTypes.node.isRequired,
  noBorder: PropTypes.bool,
  align: PropTypes.oneOf(["left", "right", "center"]),
  darkMode: PropTypes.bool,
};

// Main DataTable Component
function DataTable({
  entriesPerPage,
  canSearch,
  showTotalEntries,
  table,
  pagination,
  isSorted,
  noEndBorder,
}) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const defaultValue = entriesPerPage.defaultValue ? entriesPerPage.defaultValue : 5;
  const entries = entriesPerPage.entries
    ? entriesPerPage.entries.map((el) => el.toString())
    : ["5", "10", "15", "20", "25"];

  const columns = useMemo(() => table.columns, [table]);
  const data = useMemo(() => table.rows, [table]);

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    pageOptions,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = tableInstance;

  useEffect(() => setPageSize(defaultValue || 5), [defaultValue]);

  const setEntriesPerPage = (value) => setPageSize(value);

  const renderPagination = pageOptions.map((option) => (
    <MDPagination
      item
      key={option}
      onClick={() => gotoPage(Number(option))}
      active={pageIndex === option}
    >
      {option + 1}
    </MDPagination>
  ));

  const handleInputPagination = ({ target: { value } }) =>
    value > pageOptions.length || value < 0 ? gotoPage(0) : gotoPage(Number(value));

  const customizedPageOptions = pageOptions.map((option) => option + 1);

  const handleInputPaginationValue = ({ target: value }) => gotoPage(Number(value.value - 1));

  const [search, setSearch] = useState(globalFilter);

  const onSearchChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 100);

  const setSortedValue = (column) => {
    let sortedValue;

    if (isSorted && column.isSorted) {
      sortedValue = column.isSortedDesc ? "desc" : "asce";
    } else if (isSorted) {
      sortedValue = "none";
    } else {
      sortedValue = false;
    }

    return sortedValue;
  };

  const entriesStart = pageIndex === 0 ? pageIndex + 1 : pageIndex * pageSize + 1;
  let entriesEnd;

  if (pageIndex === 0) {
    entriesEnd = pageSize;
  } else if (pageIndex === pageOptions.length - 1) {
    entriesEnd = rows.length;
  } else {
    entriesEnd = pageSize * (pageIndex + 1);
  }

  return (
    <TableContainer sx={{ boxShadow: "none", overflowX: "auto" }}>
      {entriesPerPage || canSearch ? (
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={isMobile ? 1 : 3}
          sx={{
            backgroundColor: darkMode ? "background.default" : "background.paper",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 2 : 0,
          }}
        >
          {entriesPerPage && (
            <MDBox display="flex" alignItems="center">
              <Autocomplete
                disableClearable
                value={pageSize.toString()}
                options={entries}
                onChange={(event, newValue) => {
                  setEntriesPerPage(parseInt(newValue, 10));
                }}
                size="small"
                sx={{
                  width: "5rem",
                  "& .MuiInputBase-root": {
                    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                    color: darkMode ? "white" : "text.primary",
                  },
                }}
                renderInput={(params) => (
                  <MDInput
                    {...params}
                    sx={{
                      "& .MuiInputBase-input": {
                        color: darkMode ? "white" : "text.primary",
                      },
                    }}
                  />
                )}
              />
              <MDTypography variant="caption" color="text">
                &nbsp;&nbsp;entries per page
              </MDTypography>
            </MDBox>
          )}
          {canSearch && (
            <MDBox width={isMobile ? "100%" : "12rem"} ml={isMobile ? 0 : "auto"}>
              <MDInput
                placeholder="Search..."
                value={search}
                size="small"
                fullWidth
                onChange={({ currentTarget }) => {
                  setSearch(currentTarget.value);
                  onSearchChange(currentTarget.value);
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    color: darkMode ? "white" : "text.primary",
                  },
                }}
              />
            </MDBox>
          )}
        </MDBox>
      ) : null}
      <Table {...getTableProps()} sx={{ tableLayout: isMobile ? "auto" : "fixed" }}>
        <MDBox component="thead">
          {headerGroups.map((headerGroup) => {
            const { key: headerGroupKey, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
            return (
              <TableRow
                key={headerGroupKey}
                {...headerGroupProps}
                sx={{
                  backgroundColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.2)",
                }}
              >
                {headerGroup.headers.map((column) => {
                  const { key: headerKey, ...headerProps } = column.getHeaderProps(
                    isSorted && column.getSortByToggleProps()
                  );
                  return (
                    <DataTableHeadCell
                      key={headerKey}
                      {...headerProps}
                      width={column.width ? column.width : "auto"}
                      align={column.align ? column.align : "left"}
                      sorted={setSortedValue(column)}
                      darkMode={darkMode}
                    >
                      {column.render("Header")}
                    </DataTableHeadCell>
                  );
                })}
              </TableRow>
            );
          })}
        </MDBox>
        <TableBody {...getTableBodyProps()}>
          {page.map((row, rowIndex) => {
            prepareRow(row);
            const { key: rowKey, ...rowProps } = row.getRowProps();
            return (
              <TableRow
                key={rowKey}
                {...rowProps}
                sx={{
                  backgroundColor: darkMode ? "background.default" : "background.paper",
                  "&:hover": {
                    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
                  },
                }}
              >
                {row.cells.map((cell) => {
                  const { key: cellKey, ...cellProps } = cell.getCellProps();
                  return (
                    <DataTableBodyCell
                      key={cellKey}
                      noBorder={noEndBorder && rows.length - 1 === rowIndex}
                      align={cell.column.align ? cell.column.align : "left"}
                      darkMode={darkMode}
                      {...cellProps}
                    >
                      {cell.render("Cell")}
                    </DataTableBodyCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <MDBox
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        p={!showTotalEntries && pageOptions.length === 1 ? 0 : isMobile ? 1 : 3}
        sx={{
          backgroundColor: darkMode ? "background.default" : "background.paper",
        }}
      >
        {showTotalEntries && (
          <MDBox mb={{ xs: 3, sm: 0 }}>
            <MDTypography variant="button" color="text" fontWeight="regular">
              Showing {entriesStart} to {entriesEnd} of {rows.length} entries
            </MDTypography>
          </MDBox>
        )}
        {pageOptions.length > 1 && (
          <MDPagination
            variant={pagination.variant ? pagination.variant : "gradient"}
            color={pagination.color ? pagination.color : "info"}
          >
            {canPreviousPage && (
              <MDPagination item onClick={() => previousPage()}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
              </MDPagination>
            )}
            {renderPagination.length > 6 ? (
              <MDBox width="5rem" mx={1}>
                <MDInput
                  inputProps={{
                    type: "number",
                    min: 1,
                    max: customizedPageOptions.length,
                  }}
                  value={customizedPageOptions[pageIndex]}
                  onChange={(handleInputPagination, handleInputPaginationValue)}
                  sx={{
                    "& .MuiInputBase-input": {
                      color: darkMode ? "white" : "text.primary",
                    },
                  }}
                />
              </MDBox>
            ) : (
              renderPagination
            )}
            {canNextPage && (
              <MDPagination item onClick={() => nextPage()}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
              </MDPagination>
            )}
          </MDPagination>
        )}
      </MDBox>
    </TableContainer>
  );
}

DataTable.defaultProps = {
  entriesPerPage: { defaultValue: 10, entries: [5, 10, 15, 20, 25] },
  canSearch: false,
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  isSorted: true,
  noEndBorder: false,
};

DataTable.propTypes = {
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.shape({
      defaultValue: PropTypes.number,
      entries: PropTypes.arrayOf(PropTypes.number),
    }),
    PropTypes.bool,
  ]),
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  table: PropTypes.objectOf(PropTypes.array).isRequired,
  pagination: PropTypes.shape({
    variant: PropTypes.oneOf(["contained", "gradient"]),
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
  }),
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
};

export default DataTable;
