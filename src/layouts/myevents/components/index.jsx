// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext"; // Import auth context

function MyParticipatedEvents() {
  const { token, user } = useAuth(); // Use auth context
  const defaultEventImage =
    "https://res.cloudinary.com/dh5cebjwj/image/upload/v1750793771/samples/animals/kitten-playing.gif";
  const [tableData, setTableData] = useState({
    columns: [
      { Header: "event", accessor: "event", width: "35%", align: "left" },
      { Header: "organizer", accessor: "organizer", width: "25%", align: "left" },
      { Header: "date", accessor: "date", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "actions", accessor: "actions", align: "center" },
    ],
    rows: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to get user data from various storage locations
  const getUserData = () => {
    // Check for regular login (student data)
    if (user) {
      try {
        return { id: user.id, token, type: "regular" };
      } catch (e) {
        console.error("Error parsing student data:", e);
      }
    }

    // Check for user profile data (common in many apps)
    const userProfile = sessionStorage.getItem("userProfile") || null;
    if (userProfile) {
      try {
        const user = JSON.parse(userProfile);
        return { id: user.id || user._id, type: "profile" };
      } catch (e) {
        console.error("Error parsing user profile:", e);
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchParticipatedEvents = async () => {
      try {
        const userData = getUserData();

        if (!userData) {
          throw new Error("Please log in to view your events");
        }

        setLoading(true);
        setError(null);

        let response;

        if (userData.type === "regular" && userData.token) {
          // Regular login with token
          response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/events/students/${userData.id}`,
            {
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            }
          );
        } else {
          // Google OAuth or other auth - use cookie authentication
          response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/events/students/${userData.id}`,
            {
              withCredentials: true, // Send cookies for authentication
            }
          );
        }

        const events = response.data.data?.events || [];
        const rows = events.map((event) => createEventRow(event));

        setTableData((prev) => ({ ...prev, rows }));
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipatedEvents();
  }, []);

  // Function to create a table row from event data
  const createEventRow = (event) => {
    // Event component
    const Event = ({ image, name, description }) => (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDAvatar src={image || defaultEventImage} name={name} size="sm" variant="rounded" />
        <MDBox ml={2} lineHeight={1} textAlign="left">
          <MDTypography display="block" variant="button" fontWeight="medium">
            {name}
          </MDTypography>
          <MDTypography variant="caption">{description}</MDTypography>
        </MDBox>
      </MDBox>
    );

    Event.propTypes = {
      image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    };

    // Organizer component
    const Organizer = ({ name, email }) => (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDBox ml={2} lineHeight={1}>
          <MDTypography display="block" variant="button" fontWeight="medium">
            {name}
          </MDTypography>
          <MDTypography variant="caption">{email}</MDTypography>
        </MDBox>
      </MDBox>
    );

    Organizer.propTypes = {
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    };

    // Action buttons component
    const ActionButtons = ({ eventId }) => (
      <MDBox display="flex" justifyContent="space-around">
        <Tooltip title="View Details" placement="top">
          <MDButton
            variant="text"
            color="info"
            size="small"
            onClick={() => navigate(`/events/${eventId}`)}
          >
            <Icon>visibility</Icon>
          </MDButton>
        </Tooltip>
        <Tooltip title="Unenroll" placement="top">
          <MDButton
            variant="text"
            color="error"
            size="small"
            onClick={() => handleUnenroll(eventId)}
          >
            <Icon>delete</Icon>
          </MDButton>
        </Tooltip>
      </MDBox>
    );

    ActionButtons.propTypes = {
      eventId: PropTypes.string.isRequired,
    };

    // Determine status
    const getStatusBadge = () => {
      const now = new Date();
      const startDate = new Date(event.date);
      const endDate = new Date(event.endDate || event.date);

      if (event.status === "cancelled") {
        return <MDBadge badgeContent="cancelled" color="error" variant="gradient" size="sm" />;
      }

      if (now > endDate) {
        return <MDBadge badgeContent="completed" color="success" variant="gradient" size="sm" />;
      }

      if (now >= startDate && now <= endDate) {
        return <MDBadge badgeContent="ongoing" color="warning" variant="gradient" size="sm" />;
      }

      return <MDBadge badgeContent="upcoming" color="info" variant="gradient" size="sm" />;
    };

    return {
      id: event._id,
      event: (
        <Event
          image={event.featuredImage?.url || event.images?.[0]?.url}
          name={event.title}
          description={event.description || "No description available"}
        />
      ),
      organizer: (
        <Organizer
          name={event.organizer?.name || "Unknown Organizer"}
          email={event.organizer?.email || "N/A"}
        />
      ),
      date: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {new Date(event.date).toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </MDTypography>
      ),
      status: <MDBox ml={-1}>{getStatusBadge()}</MDBox>,
      actions: <ActionButtons eventId={event._id} />,
    };
  };

  const handleUnenroll = async (eventId) => {
    try {
      const userData = getUserData();

      if (!userData) {
        throw new Error("Please log in to unenroll from events");
      }

      if (userData.type === "regular" && userData.token) {
        // Regular login with token
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/api/students/${userData.id}/events/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );
      } else {
        // Google OAuth - use cookie authentication
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/api/students/${userData.id}/events/${eventId}`,
          {
            withCredentials: true,
          }
        );
      }

      // Update UI
      setTableData((prev) => ({
        ...prev,
        rows: prev.rows.filter((row) => row.id !== eventId),
      }));

      // Show success message
      alert("Successfully unenrolled from event");
    } catch (error) {
      console.error("Error unenrolling:", error);
      alert("Failed to unenroll: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <MDBox
        pt={6}
        pb={3}
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <MDTypography variant="body2" color="text">
          Loading your events...
        </MDTypography>
      </MDBox>
    );
  }

  if (error) {
    return (
      <MDBox pt={6} pb={3}>
        <MDTypography variant="h6" color="error" gutterBottom>
          Error
        </MDTypography>
        <MDTypography variant="body2" color="text">
          {error}
        </MDTypography>
        <MDButton variant="gradient" color="info" onClick={() => navigate("/login")} sx={{ mt: 2 }}>
          Log In
        </MDButton>
      </MDBox>
    );
  }

  return (
    <MDBox pt={6} pb={3}>
      <MDBox mb={3}>
        <MDTypography variant="h3" textTransform="capitalize">
          My Participated Events
        </MDTypography>
        <MDTypography variant="body2" color="text">
          Events you&apos;ve registered for
        </MDTypography>
      </MDBox>
      <MDBox>
        {tableData.rows.length > 0 ? (
          <DataTable
            table={tableData}
            isSorted={false}
            entriesPerPage={{ defaultValue: 5, entries: [5, 10, 15, 20, 25] }}
            showTotalEntries={true}
            noEndBorder
            canSearch
          />
        ) : (
          <MDBox textAlign="center" py={4}>
            <MDTypography variant="h6" color="text" gutterBottom>
              No events found
            </MDTypography>
            <MDTypography variant="body2" color="text" sx={{ mb: 2 }}>
              You haven&apos;t enrolled in any events yet.
            </MDTypography>
            <MDButton variant="gradient" color="info" onClick={() => navigate("/explore")}>
              Browse Events
            </MDButton>
          </MDBox>
        )}
      </MDBox>
    </MDBox>
  );
}

export default MyParticipatedEvents;
// // Material Dashboard 2 React components
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import MDAvatar from "components/MDAvatar";
// import MDBadge from "components/MDBadge";
// import MDButton from "components/MDButton";
// import PropTypes from "prop-types";
// import { useState, useEffect } from "react";
// import Icon from "@mui/material/Icon";
// import Tooltip from "@mui/material/Tooltip";
// import DataTable from "examples/Tables/DataTable";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "context/AuthContext"; // Import auth context

// function MyParticipatedEvents() {
//   const defaultEventImage =
//     "https://res.cloudinary.com/dh5cebjwj/image/upload/v1750793771/samples/animals/kitten-playing.gif";
//   const [tableData, setTableData] = useState({
//     columns: [
//       { Header: "event", accessor: "event", width: "35%", align: "left" },
//       { Header: "organizer", accessor: "organizer", width: "25%", align: "left" },
//       { Header: "date", accessor: "date", align: "center" },
//       { Header: "status", accessor: "status", align: "center" },
//       { Header: "actions", accessor: "actions", align: "center" },
//     ],
//     rows: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const { user, isAuthenticated } = useAuth(); // Use auth context

//   useEffect(() => {
//     const fetchParticipatedEvents = async () => {
//       try {
//         if (!isAuthenticated || !user) {
//           throw new Error("Please log in to view your events");
//         }

//         setLoading(true);
//         setError(null);

//         // Use credentials: 'include' to send cookies for Google OAuth users
//         const response = await axios.get(
//           `${import.meta.env.VITE_BASE_URL}/api/events/students/${user.id}`,
//           {
//             withCredentials: true, // This sends cookies for authenticated requests
//           }
//         );

//         const events = response.data.data?.events || [];
//         const rows = events.map((event) => createEventRow(event));

//         setTableData((prev) => ({ ...prev, rows }));
//       } catch (error) {
//         console.error("Error fetching events:", error);
//         setError(error.response?.data?.message || error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (isAuthenticated) {
//       fetchParticipatedEvents();
//     } else {
//       setLoading(false);
//       setError("Please log in to view your events");
//     }
//   }, [isAuthenticated, user]);

//   // Function to create a table row from event data
//   const createEventRow = (event) => {
//     // Event component
//     const Event = ({ image, name, description }) => (
//       <MDBox display="flex" alignItems="center" lineHeight={1}>
//         <MDAvatar src={image || defaultEventImage} name={name} size="sm" variant="rounded" />
//         <MDBox ml={2} lineHeight={1} textAlign="left">
//           <MDTypography display="block" variant="button" fontWeight="medium">
//             {name}
//           </MDTypography>
//           <MDTypography variant="caption">{description}</MDTypography>
//         </MDBox>
//       </MDBox>
//     );

//     Event.propTypes = {
//       image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
//       name: PropTypes.string.isRequired,
//       description: PropTypes.string.isRequired,
//     };

//     // Organizer component
//     const Organizer = ({ name, email }) => (
//       <MDBox display="flex" alignItems="center" lineHeight={1}>
//         <MDBox ml={2} lineHeight={1}>
//           <MDTypography display="block" variant="button" fontWeight="medium">
//             {name}
//           </MDTypography>
//           <MDTypography variant="caption">{email}</MDTypography>
//         </MDBox>
//       </MDBox>
//     );

//     Organizer.propTypes = {
//       name: PropTypes.string.isRequired,
//       email: PropTypes.string.isRequired,
//     };

//     // Action buttons component
//     const ActionButtons = ({ eventId }) => (
//       <MDBox display="flex" justifyContent="space-around">
//         <Tooltip title="View Details" placement="top">
//           <MDButton
//             variant="text"
//             color="info"
//             size="small"
//             onClick={() => navigate(`/events/${eventId}`)}
//           >
//             <Icon>visibility</Icon>
//           </MDButton>
//         </Tooltip>
//         <Tooltip title="Unenroll" placement="top">
//           <MDButton
//             variant="text"
//             color="error"
//             size="small"
//             onClick={() => handleUnenroll(eventId)}
//           >
//             <Icon>delete</Icon>
//           </MDButton>
//         </Tooltip>
//       </MDBox>
//     );

//     ActionButtons.propTypes = {
//       eventId: PropTypes.string.isRequired,
//     };

//     // Determine status
//     const getStatusBadge = () => {
//       const now = new Date();
//       const startDate = new Date(event.date);
//       const endDate = new Date(event.endDate || event.date); // Use endDate if available

//       if (event.status === "cancelled") {
//         return <MDBadge badgeContent="cancelled" color="error" variant="gradient" size="sm" />;
//       }

//       if (now > endDate) {
//         return <MDBadge badgeContent="completed" color="success" variant="gradient" size="sm" />;
//       }

//       if (now >= startDate && now <= endDate) {
//         return <MDBadge badgeContent="ongoing" color="warning" variant="gradient" size="sm" />;
//       }

//       return <MDBadge badgeContent="upcoming" color="info" variant="gradient" size="sm" />;
//     };

//     return {
//       id: event._id,
//       event: (
//         <Event
//           image={event.featuredImage?.url || event.images?.[0]?.url}
//           name={event.title}
//           description={event.description || "No description available"}
//         />
//       ),
//       organizer: (
//         <Organizer
//           name={event.organizer?.name || "Unknown Organizer"}
//           email={event.organizer?.email || "N/A"}
//         />
//       ),
//       date: (
//         <MDTypography variant="caption" color="text" fontWeight="medium">
//           {new Date(event.date).toLocaleString("en-US", {
//             month: "long",
//             day: "numeric",
//             year: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//           })}
//         </MDTypography>
//       ),
//       status: <MDBox ml={-1}>{getStatusBadge()}</MDBox>,
//       actions: <ActionButtons eventId={event._id} />,
//     };
//   };

//   const handleUnenroll = async (eventId) => {
//     try {
//       if (!isAuthenticated || !user) {
//         throw new Error("Please log in to unenroll from events");
//       }

//       // Call API to unenroll using cookies for authentication
//       await axios.delete(
//         `${import.meta.env.VITE_BASE_URL}/api/students/${user.id}/events/${eventId}`,
//         {
//           withCredentials: true, // Send cookies for authentication
//         }
//       );

//       // Update UI
//       setTableData((prev) => ({
//         ...prev,
//         rows: prev.rows.filter((row) => row.id !== eventId),
//       }));

//       // Show success message
//       alert("Successfully unenrolled from event");
//     } catch (error) {
//       console.error("Error unenrolling:", error);
//       alert("Failed to unenroll: " + (error.response?.data?.message || error.message));
//     }
//   };

//   if (loading) {
//     return (
//       <MDBox pt={6} pb={3}>
//         <MDTypography variant="body2" color="text">
//           Loading your events...
//         </MDTypography>
//       </MDBox>
//     );
//   }

//   if (error) {
//     return (
//       <MDBox pt={6} pb={3}>
//         <MDTypography variant="h6" color="error" gutterBottom>
//           Error
//         </MDTypography>
//         <MDTypography variant="body2" color="text">
//           {error}
//         </MDTypography>
//         {!isAuthenticated && (
//           <MDButton
//             variant="gradient"
//             color="info"
//             onClick={() => navigate("/login")}
//             sx={{ mt: 2 }}
//           >
//             Log In
//           </MDButton>
//         )}
//       </MDBox>
//     );
//   }

//   return (
//     <MDBox pt={6} pb={3}>
//       <MDBox mb={3}>
//         <MDTypography variant="h3" textTransform="capitalize">
//           My Participated Events
//         </MDTypography>
//         <MDTypography variant="body2" color="text">
//           Events you&apos;ve registered for
//         </MDTypography>
//       </MDBox>
//       <MDBox>
//         {tableData.rows.length > 0 ? (
//           <DataTable
//             table={tableData}
//             isSorted={false}
//             entriesPerPage={{ defaultValue: 5, entries: [5, 10, 15, 20, 25] }}
//             showTotalEntries={true}
//             noEndBorder
//             canSearch
//           />
//         ) : (
//           <MDBox textAlign="center" py={4}>
//             <MDTypography variant="h6" color="text" gutterBottom>
//               No events found
//             </MDTypography>
//             <MDTypography variant="body2" color="text" sx={{ mb: 2 }}>
//               You haven&apos;t enrolled in any events yet.
//             </MDTypography>
//             <MDButton variant="gradient" color="info" onClick={() => navigate("/explore")}>
//               Browse Events
//             </MDButton>
//           </MDBox>
//         )}
//       </MDBox>
//     </MDBox>
//   );
// }

// export default MyParticipatedEvents;
