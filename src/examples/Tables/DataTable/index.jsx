import { useMemo, useEffect, useState, useRef, useCallback } from "react";
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
    <MDTypography
      ref={textRef}
      variant="caption"
      fontWeight="bold"
      sx={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        maxWidth: "100%",
        display: "block",
        textTransform: "uppercase",
        fontSize: "0.75rem",
        letterSpacing: "0.5px",
      }}
    >
      {children}
    </MDTypography>
  );

  return (
    <MDBox
      component="th"
      width={width}
      py={1.5}
      px={2}
      sx={({ palette: { light }, borders: { borderWidth } }) => ({
        borderBottom: `${borderWidth[1]} solid ${light.main}`,
        backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
      })}
    >
      <MDBox
        {...rest}
        position="relative"
        textAlign={align}
        sx={{
          cursor: sorted && "pointer",
          userSelect: sorted && "none",
        }}
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
            sx={{ fontSize: "1.25rem" }}
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

  const cellContent = (
    <MDTypography
      component="div"
      ref={textRef}
      variant="body2"
      sx={{
        overflow: "hidden",
        textOverflow: isMobile ? "ellipsis" : "clip",
        whiteSpace: isMobile ? "nowrap" : "normal",
        wordBreak: "break-word",
        display: "block",
        lineHeight: 1.4,
        fontSize: "0.875rem",
        fontWeight: "regular",
      }}
    >
      {children}
    </MDTypography>
  );

  return (
    <MDBox
      component="td"
      textAlign={align}
      py={1.5}
      px={2}
      sx={({ palette: { light }, borders: { borderWidth } }) => ({
        borderBottom: noBorder ? "none" : `${borderWidth[1]} solid ${light.main}`,
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
  const entries = useMemo(
    () =>
      entriesPerPage.entries
        ? entriesPerPage.entries.map((el) => el.toString())
        : ["5", "10", "15", "20", "25"],
    [entriesPerPage.entries]
  );

  const columns = useMemo(() => table.columns, [table.columns]);
  const data = useMemo(() => table.rows, [table.rows]);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: defaultValue,
      },
    },
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

  const setEntriesPerPage = useCallback(
    (value) => {
      setPageSize(value);
    },
    [setPageSize]
  );

  const renderPagination = pageOptions.map((option) => (
    <MDPagination
      item
      key={option}
      onClick={() => gotoPage(Number(option))}
      active={pageIndex === option}
    >
      <MDTypography variant="button" fontWeight="medium">
        {option + 1}
      </MDTypography>
    </MDPagination>
  ));

  const handleInputPagination = useCallback(
    (event) => {
      const value = event.target.value;
      const pageNum = Number(value) - 1;

      if (value === "" || isNaN(pageNum)) return;

      if (pageNum < 0) {
        gotoPage(0);
      } else if (pageNum >= pageOptions.length) {
        gotoPage(pageOptions.length - 1);
      } else {
        gotoPage(pageNum);
      }
    },
    [gotoPage, pageOptions.length]
  );

  const customizedPageOptions = pageOptions.map((option) => option + 1);

  const [search, setSearch] = useState("");

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
    <TableContainer
      sx={{
        boxShadow: "none",
        overflowX: "auto",
        borderRadius: 2,
        border: darkMode ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.12)",
      }}
    >
      {entriesPerPage || canSearch ? (
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={isMobile ? 1.5 : 3}
          sx={{
            backgroundColor: darkMode ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 2 : 0,
            borderBottom: darkMode
              ? "1px solid rgba(255, 255, 255, 0.08)"
              : "1px solid rgba(0, 0, 0, 0.08)",
          }}
        >
          {entriesPerPage && (
            <MDBox display="flex" alignItems="center" gap={1}>
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
                    color: "text.main",
                    borderRadius: 1,
                  },
                }}
                renderInput={(params) => (
                  <MDInput
                    {...params}
                    sx={{
                      "& .MuiInputBase-input": {
                        color: "text.main",
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                )}
              />
              <MDTypography variant="button" color="text" fontWeight="regular">
                entries per page
              </MDTypography>
            </MDBox>
          )}
          {canSearch && (
            <MDBox width={isMobile ? "100%" : "16rem"}>
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
                    fontSize: "0.875rem",
                  },
                  "& .MuiInputBase-root": {
                    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
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
                  backgroundColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
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
                  backgroundColor: "background.default",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
                    transform: "translateY(-1px)",
                    boxShadow: darkMode
                      ? "0 2px 8px rgba(255, 255, 255, 0.1)"
                      : "0 2px 8px rgba(0, 0, 0, 0.1)",
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
        p={!showTotalEntries && pageOptions.length === 1 ? 0 : isMobile ? 2 : 3}
        sx={{
          backgroundColor: darkMode ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
          borderTop: darkMode
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid rgba(0, 0, 0, 0.08)",
          gap: { xs: 2, sm: 0 },
        }}
      >
        {showTotalEntries && (
          <MDBox>
            <MDTypography variant="button" color="text" fontWeight="medium">
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
                  onChange={handleInputPagination}
                  size="small"
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "text.primary",
                      fontSize: "0.875rem",
                      textAlign: "center",
                    },
                    "& .MuiInputBase-root": {
                      backgroundColor: darkMode
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.04)",
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

// Add displayName for better debugging
DataTable.displayName = "DataTable";
DataTableHeadCell.displayName = "DataTableHeadCell";
DataTableBodyCell.displayName = "DataTableBodyCell";

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
