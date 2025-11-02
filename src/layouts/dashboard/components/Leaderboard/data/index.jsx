// @mui material components
import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";
import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";

import { useMaterialUIController } from "context";
import { Box } from "@mui/system";

const data = () => {
  // Images - using existing team images as student profile pictures
  const team1 = "https://res.cloudinary.com/dh5cebjwj/image/upload/v1757375373/team-1_a7rqfy.jpg";
  const team2 = "https://res.cloudinary.com/dh5cebjwj/image/upload/v1757375373/team-2_aq8yoc.jpg";
  const team3 = "https://res.cloudinary.com/dh5cebjwj/image/upload/v1757375373/team-5_lbc0wn.jpg";
  const team4 = "https://res.cloudinary.com/dh5cebjwj/image/upload/v1757375373/team-4_efvdcl.jpg";
  const team5 = "https://res.cloudinary.com/dh5cebjwj/image/upload/v1757375375/team-3_njhtzr.jpg";
  // Student profile component
  const Student = ({ image, name, department }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={1} lineHeight={1}>
        <MDTypography variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption" color="text">
          {department}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  // Add PropTypes validation
  Student.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
  };

  // Enhanced rank badge component with special styling for top 3
  const RankBadge = ({ rank }) => {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    // Define colors based on rank
    let backgroundColor = "#344767"; // Default dark
    let textColor = darkMode ? "white" : "dark"; // White text for dark mode, default for light mode
    let borderColor = "transparent";
    let width = "28px";
    let height = "28px";
    let boxShadow = "none";

    // Special styling for top 3 ranks
    if (rank === 1) {
      backgroundColor = "#FFD700"; // Gold
      borderColor = "#FFC000";
      boxShadow = "0 0 10px rgba(255, 215, 0, 0.6)";
      width = "32px";
      height = "32px";
    } else if (rank === 2) {
      backgroundColor = "#C0C0C0"; // Brighter silver
      borderColor = "#A0A0A0";
      boxShadow = "0 0 8px rgba(192, 192, 192, 0.6)";
      width = "30px";
      height = "30px";
    } else if (rank === 3) {
      backgroundColor = "#CD7F32"; // Bronze
      borderColor = "#A05A2C";
      boxShadow = "0 0 8px rgba(205, 127, 50, 0.6)";
      width = "30px";
      height = "30px";
    }

    return (
      <MDBox display="flex" justifyContent="center">
        <MDBox
          backgroundColor={backgroundColor}
          borderRadius="50%"
          width={width}
          height={height}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            border: `2px solid ${borderColor}`,
            boxShadow: boxShadow,
            transition: "transform 0.2s",
            "&:hover": {
              transform: rank <= 3 ? "scale(1.1)" : "none",
            },
          }}
        >
          <MDTypography
            variant="button"
            fontWeight="bold"
            color={textColor}
            sx={{ fontSize: rank === 1 ? "14px" : "12px" }}
          >
            {rank}
          </MDTypography>
        </MDBox>
      </MDBox>
    );
  };

  RankBadge.propTypes = {
    rank: PropTypes.number.isRequired,
  };

  // Success rate progress component
  const SuccessRate = ({ rate }) => (
    <MDBox width="8rem" textAlign="center">
      <Box width="100%">
        <MDProgress
          value={rate}
          color={rate > 70 ? "success" : rate > 50 ? "info" : "warning"}
          variant="gradient"
          label
        />
      </Box>
    </MDBox>
  );

  SuccessRate.propTypes = {
    rate: PropTypes.number.isRequired,
  };

  return {
    columns: [
      { Header: "rank", accessor: "rank", width: "10%", align: "center" },
      { Header: "student", accessor: "student", width: "30%", align: "left" },
      {
        Header: "participated events",
        accessor: "participatedEvents",
        width: "20%",
        align: "center",
      },
      { Header: "events won", accessor: "eventsWon", width: "15%", align: "center" },
      { Header: "success rate", accessor: "successRate", width: "15%", align: "center" },
      { Header: "achievement", accessor: "achievement", width: "10%", align: "center" },
    ],

    rows: [
      {
        rank: <RankBadge rank={1} />,
        student: <Student image={team1} name="Sneha Sharma" department=" - Computer Science" />,
        participatedEvents: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            24
          </MDTypography>
        ),
        eventsWon: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            18
          </MDTypography>
        ),
        successRate: <SuccessRate rate={75} />,
        achievement: (
          <MDBox display="flex" justifyContent="center">
            <Tooltip title="Annual Hackathon Winner">
              <Icon fontSize="default" color="info">
                emoji_events
              </Icon>
            </Tooltip>
          </MDBox>
        ),
      },
      {
        rank: <RankBadge rank={2} />,
        student: <Student image={team2} name="Keshav Garg" department=" - Data Science" />,
        participatedEvents: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            21
          </MDTypography>
        ),
        eventsWon: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            15
          </MDTypography>
        ),
        successRate: <SuccessRate rate={71} />,
        achievement: (
          <MDBox display="flex" justifyContent="center">
            <Tooltip title="Best Presenter Award">
              <Icon fontSize="default" color="secondary">
                workspace_premium
              </Icon>
            </Tooltip>
          </MDBox>
        ),
      },
      {
        rank: <RankBadge rank={3} />,
        student: (
          <Student image={team3} name="Loveleen Kaur" department=" - Electrical Engineering" />
        ),
        participatedEvents: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            19
          </MDTypography>
        ),
        eventsWon: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            12
          </MDTypography>
        ),
        successRate: <SuccessRate rate={63} />,
        achievement: (
          <MDBox display="flex" justifyContent="center">
            <Tooltip title="Innovation Prize">
              <Icon fontSize="default" color="info">
                lightbulb
              </Icon>
            </Tooltip>
          </MDBox>
        ),
      },
      {
        rank: <RankBadge rank={4} />,
        student: <Student image={team4} name="Sunil Rathore" department=" - Applied Mathematics" />,
        participatedEvents: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            17
          </MDTypography>
        ),
        eventsWon: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            10
          </MDTypography>
        ),
        successRate: <SuccessRate rate={59} />,
        achievement: (
          <MDBox display="flex" justifyContent="center">
            <Tooltip title="Team Leadership Award">
              <Icon fontSize="default" color="warning">
                diversity_3
              </Icon>
            </Tooltip>
          </MDBox>
        ),
      },
      {
        rank: <RankBadge rank={5} />,
        student: (
          <Student image={team5} name="Radhika Pandit" department=" - Artificial Intelligence" />
        ),
        participatedEvents: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            15
          </MDTypography>
        ),
        eventsWon: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            8
          </MDTypography>
        ),
        successRate: <SuccessRate rate={53} />,
        achievement: (
          <MDBox display="flex" justifyContent="center">
            <Tooltip title="Best Research Paper">
              <Icon fontSize="default" color="error">
                description
              </Icon>
            </Tooltip>
          </MDBox>
        ),
      },
    ],
  };
};

export default data;
