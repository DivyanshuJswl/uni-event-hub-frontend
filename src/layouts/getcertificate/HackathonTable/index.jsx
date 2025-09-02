import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Chip,
  CircularProgress,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import CertificateActions from "../CertificateAction";
import MDAlert from "components/MDAlert";

function HackathonTable({ data, loading, error }) {
  if (loading) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress sx={{ color: "white" }} />
      </MDBox>
    );
  }

  if (error) {
    return (
      <MDBox mx="auto" p={3} maxWidth="800px">
        <MDAlert color="error">
          <MDTypography variant="h6" color="white">
            Error
          </MDTypography>
          {error}
        </MDAlert>
      </MDBox>
    );
  }

  if (data.length === 0) {
    return (
      <MDBox mx="auto" p={3} textAlign="center" maxWidth="800px">
        <MDTypography variant="h5" gutterBottom color="white">
          No Data Available
        </MDTypography>
        <MDTypography variant="body2" color="white">
          The Google Sheet is empty or couldn&apos;t be loaded.
        </MDTypography>
      </MDBox>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ boxShadow: "none", backgroundColor: "transparent" }}>
      <MDBox mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Table aria-label="hackathon winners table">
          <TableHead>
            <TableRow>
              {["Winner", "Metamask ID", "Certificate ID", "Actions"].map((header, index) => (
                <TableCell key={index} align="center">
                  <MDTypography variant="h6" fontWeight="bold">
                    {header}
                  </MDTypography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {row.metamaskId && (
                  <TableCell>
                    <MDBox display="flex">
                      <Icon color="info">person</Icon>
                      <MDTypography variant="body2" fontWeight="medium">
                        {row.name}
                      </MDTypography>
                    </MDBox>
                  </TableCell>
                )}

                {row.metamaskId && (
                  <TableCell>
                    <Tooltip title="View on Blockchain">
                      <Chip
                        label={row.metamaskId}
                        size="small"
                        sx={{ bgcolor: "secondary.main", color: "white", fontFamily: "monospace" }}
                      />
                    </Tooltip>
                  </TableCell>
                )}
                <TableCell>
                  <MDTypography variant="caption" fontFamily="monospace">
                    {row.certificateId}
                  </MDTypography>
                </TableCell>

                <TableCell>
                  <MDBox display="flex" justifyContent="center">
                    <CertificateActions certificateId={row.certificateId} />
                  </MDBox>
                </TableCell>
                <TableCell>
                  <MDTypography variant="body2">
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    }).format(new Date(row.timestamp))}
                  </MDTypography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </MDBox>
    </TableContainer>
  );
}

HackathonTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      metamaskId: PropTypes.string.isRequired,
      certificateId: PropTypes.string.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};
HackathonTable.defaultProps = {
  error: null,
};
export default HackathonTable;
