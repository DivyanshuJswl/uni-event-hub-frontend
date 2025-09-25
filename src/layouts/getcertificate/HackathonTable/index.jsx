import PropTypes from "prop-types";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, Chip } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import CertificateActions from "../CertificateAction";

function HeaderCell({ children }) {
  return (
    <TableCell align="center">
      <MDTypography variant="h6" fontWeight="bold">
        {children}
      </MDTypography>
    </TableCell>
  );
}

HeaderCell.propTypes = { children: PropTypes.node.isRequired };

function WinnerCell({ name }) {
  return (
    <TableCell>
      <MDBox display="flex" gap={1} alignItems="center">
        <Icon color="info">person</Icon>
        <MDTypography variant="body2" fontWeight="medium">{name}</MDTypography>
      </MDBox>
    </TableCell>
  );
}

WinnerCell.propTypes = { name: PropTypes.string.isRequired };

function MetamaskCell({ metamaskId }) {
  return (
    <TableCell>
      <Tooltip title="View on Blockchain">
        <Chip label={metamaskId} size="small" sx={{ bgcolor: "secondary.main", color: "white", fontFamily: "monospace" }} />
      </Tooltip>
    </TableCell>
  );
}

MetamaskCell.propTypes = { metamaskId: PropTypes.string.isRequired };

function CertificateIdCell({ certificateId }) {
  return (
    <TableCell>
      <MDTypography variant="caption" fontFamily="monospace">{certificateId}</MDTypography>
    </TableCell>
  );
}

CertificateIdCell.propTypes = { certificateId: PropTypes.string.isRequired };

function ActionsCell({ certificateId }) {
  return (
    <TableCell>
      <MDBox display="flex" justifyContent="center">
        <CertificateActions certificateId={certificateId} />
      </MDBox>
    </TableCell>
  );
}

ActionsCell.propTypes = { certificateId: PropTypes.string.isRequired };

function TimestampCell({ timestamp }) {
  return (
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
        }).format(new Date(timestamp))}
      </MDTypography>
    </TableCell>
  );
}

TimestampCell.propTypes = { timestamp: PropTypes.string.isRequired };

export default function HackathonTable({ data }) {
  return (
    <TableContainer component={Paper} sx={{ boxShadow: "none", backgroundColor: "transparent" }}>
      <MDBox mb={2}>
        <Table aria-label="hackathon winners table">
          <TableHead>
            <TableRow>
              {["Winner", "Metamask ID", "Certificate ID", "Actions", "Timestamp"].map((header) => (
                <HeaderCell key={header}>{header}</HeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <WinnerCell name={row.name} />
                <MetamaskCell metamaskId={row.metamaskId} />
                <CertificateIdCell certificateId={row.certificateId} />
                <ActionsCell certificateId={row.certificateId} />
                <TimestampCell timestamp={row.timestamp} />
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
};
