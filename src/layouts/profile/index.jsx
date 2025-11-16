import { useState, useEffect, useMemo, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DefaultProjectCard from "examples/Cards/EventCard/DefaultProjectCard";
import { useAuth } from "context/AuthContext";
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";
import MetaMaskIntegration from "./components/LinkMetaMask";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import { useMaterialUIController } from "context";
import {
  Alert,
  CircularProgress,
  Chip,
  Box,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  useTheme,
} from "@mui/material";
import Icon from "@mui/material/Icon";
import VerifiedIcon from "@mui/icons-material/Verified";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";
import EventIcon from "@mui/icons-material/Event";
import axios from "axios";

function UnifiedProfile() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { username } = useParams();
  const { user: currentUser, token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Determine if viewing own profile
  const isOwnProfile = useMemo(() => {
    if (!currentUser || !username) return false;
    return currentUser.username?.toLowerCase() === username.toLowerCase();
  }, [currentUser, username]);

  // Fetch profile data - RESET state when username changes
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        setProfileData(null); // Clear old data

        const apiUrl = import.meta.env.VITE_BASE_URL;
        const response = await axios.get(`${apiUrl}/api/profile/${username}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (response.data.success === false) {
          throw new Error(response.data.message || "Failed to fetch profile");
        }

        console.log("Fetched profile data:", response.data);
        setProfileData(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.message || err.message || "Failed to load profile");
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username, token]);

  // Memoized team images
  const teamImages = useMemo(
    () => ({
      team1: "https://res.cloudinary.com/dh5cebjwj/image/upload/v1757375373/team-1_a7rqfy.jpg",
      team2: "https://res.cloudinary.com/dh5cebjwj/image/upload/v1757375373/team-2_aq8yoc.jpg",
      team3: "https://res.cloudinary.com/dh5cebjwj/image/upload/v1757375375/team-3_njhtzr.jpg",
      team4: "https://res.cloudinary.com/dh5cebjwj/image/upload/v1757375373/team-4_efvdcl.jpg",
    }),
    []
  );

  const socialLinks = useMemo(() => {
    if (!profileData?.social || Object.keys(profileData.social).length === 0) {
      return [];
    }

    const socialArray = [];

    if (profileData.social.linkedin) {
      socialArray.push({
        link: profileData.social.linkedin,
        icon: <LinkedInIcon />,
        color: "linkedin",
      });
    }

    if (profileData.social.github) {
      socialArray.push({
        link: profileData.social.github,
        icon: <GitHubIcon />,
        color: "github",
      });
    }

    if (profileData.social.twitter) {
      socialArray.push({
        link: profileData.social.twitter,
        icon: <TwitterIcon />,
        color: "twitter",
      });
    }

    if (profileData.social.website) {
      socialArray.push({
        link: profileData.social.website,
        icon: <LanguageIcon />,
        color: "youtube",
      });
    }

    return socialArray;
  }, [profileData?.social]);

  const projects = useMemo(
    () => [
      {
        image:
          "https://res.cloudinary.com/dh5cebjwj/image/upload/v1756915812/home-decor-1_yioetq.jpg",
        label: "project #2",
        title: "modern",
        description: "As Uber works through a huge amount of internal management turmoil.",
        authors: [
          { image: teamImages.team1, name: "Elena Morison" },
          { image: teamImages.team2, name: "Ryan Milly" },
          { image: teamImages.team3, name: "Nick Daniel" },
          { image: teamImages.team4, name: "Peterson" },
        ],
      },
      {
        image:
          "https://res.cloudinary.com/dh5cebjwj/image/upload/v1756915817/home-decor-2_dbiguz.jpg",
        label: "project #1",
        title: "scandinavian",
        description: "Music is something that everyone has their own specific opinion about.",
        authors: [
          { image: teamImages.team3, name: "Nick Daniel" },
          { image: teamImages.team4, name: "Peterson" },
          { image: teamImages.team1, name: "Elena Morison" },
          { image: teamImages.team2, name: "Ryan Milly" },
        ],
      },
      {
        image:
          "https://res.cloudinary.com/dh5cebjwj/image/upload/v1756915827/home-decor-3_yg04jv.jpg",
        label: "project #3",
        title: "minimalist",
        description: "Different people have different taste, and various types of music.",
        authors: [
          { image: teamImages.team4, name: "Peterson" },
          { image: teamImages.team3, name: "Nick Daniel" },
          { image: teamImages.team2, name: "Ryan Milly" },
          { image: teamImages.team1, name: "Elena Morison" },
        ],
      },
      {
        image:
          "https://res.cloudinary.com/dh5cebjwj/image/upload/v1756915799/home-decor-4_awposa.jpg",
        label: "project #4",
        title: "gothic",
        description: "Why would anyone pick blue over pink? Pink is obviously a better color.",
        authors: [
          { image: teamImages.team4, name: "Peterson" },
          { image: teamImages.team3, name: "Nick Daniel" },
          { image: teamImages.team2, name: "Ryan Milly" },
          { image: teamImages.team1, name: "Elena Morison" },
        ],
      },
    ],
    [teamImages]
  );

  const events = useMemo(() => {
    if (!profileData) return [];
    return profileData.role === "organizer"
      ? profileData.organizedEvents || []
      : profileData.participatedEvents || [];
  }, [profileData]);

  // Enhanced Event Card Component
  const EventCard = memo(({ event }) => {
    const imageUrl =
      event.cover ||
      event.featuredImage?.url ||
      event.images?.[0]?.url ||
      "https://via.placeholder.com/400x300";

    return (
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "background.card",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: `0 8px 24px ${"primary.main"}40`,
          },
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={imageUrl}
          alt={event.title}
          sx={{
            objectFit: "cover",
            width: "100%",
            backgroundColor: "grey[800]",
          }}
        />
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <MDBox display="flex" alignItems="center" mb={1}>
            <EventIcon fontSize="small" sx={{ mr: 0.5, color: "info.main" }} />
            <MDTypography variant="caption" color="text">
              {new Date(event.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </MDTypography>
          </MDBox>

          <MDTypography
            variant="h6"
            fontWeight="medium"
            mb={1}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {event.title}
          </MDTypography>

          <MDTypography
            variant="button"
            color="text"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {event.description || "No description available"}
          </MDTypography>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <MDButton
            variant="gradient"
            color="info"
            size="small"
            fullWidth
            onClick={() => navigate(`/events/${event._id}`)}
          >
            View Event
          </MDButton>
        </CardActions>
      </Card>
    );
  });

  EventCard.displayName = "EventCard";

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
          flexDirection="column"
        >
          <CircularProgress sx={{ color: "info.main" }} size={60} />
          <MDTypography variant="button" color="text" mt={2}>
            Loading profile...
          </MDTypography>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox mt={5} mb={3} px={3}>
          <Alert severity="" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <MDTypography variant="h4" fontWeight="medium" textAlign="center">
            Profile Not Found
          </MDTypography>
          <MDBox textAlign="center" mt={2}>
            <MDTypography variant="body2" color="text" mb={2}>
              The profile "@{username}" could not be loaded.
            </MDTypography>
            <MDTypography
              variant="button"
              color="info"
              sx={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate("/explore")}
            >
              Go back to explore
            </MDTypography>
          </MDBox>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  if (!profileData) {
    return null;
  }

  const profileTitle =
    profileData.role === "organizer" ? "Event Organizer Profile" : "Student Profile";

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />

      <Header name={profileData.name} avatar={profileData.avatar} isOwnProfile={!!isOwnProfile}>
        {isOwnProfile && (
          <MDBox display="flex" justifyContent="flex-end" gap={2} mb={3} p={2}>
            <MDButton
              variant="outlined"
              color="info"
              size="medium"
              startIcon={<VisibilityIcon />}
              onClick={() => window.open(`/profile/${currentUser.username}`, "_blank")}
            >
              View Public
            </MDButton>
            <MDButton
              variant="gradient"
              color="info"
              size="medium"
              startIcon={<EditIcon />}
              onClick={() => navigate("/complete-profile")}
            >
              Edit Profile
            </MDButton>
          </MDBox>
        )}

        {/* FIX: Tabs - Only show for OWN profile */}
        {/* {isOwnProfile && (
          <MDBox mb={3}>
            <Tabs
              value={activeTab}
              onChange={(e, val) => setActiveTab(val)}
              sx={{
                backgroundColor: darkMode ? "background.card" : "grey[100]",
                borderRadius: 2,
                p: 0.5,
                "& .MuiTab-root": {
                  borderRadius: 1.5,
                  transition: "all 0.2s",
                  color: "text.main",
                },
                "& .Mui-selected": {
                  backgroundColor: darkMode ? "grey[800]" : "white.main",
                  color: "info.main",
                  boxShadow: darkMode ? `0 2px 8px ${"black.main"}60` : `0 2px 8px ${"grey[300]"}`,
                },
              }}
            >
              <Tab label="Profile" icon={<Icon>person</Icon>} iconPosition="start" />
              <Tab label="Settings" icon={<Icon>settings</Icon>} iconPosition="start" />
            </Tabs>
          </MDBox>
        )} */}

        {/* Profile View Tab */}
        {(activeTab === 0 || !isOwnProfile) && (
          <>
            <MDBox mt={3} mb={3}>
              <Grid container spacing={3}>
                {isOwnProfile && (
                  <Grid item xs={12} md={6} xl={4}>
                    <PlatformSettings role={profileData.role} />
                  </Grid>
                )}

                <Grid item xs={12} md={6} xl={isOwnProfile ? 4 : 6}>
                  <Box position="relative">
                    <ProfileInfoCard
                      title={profileTitle}
                      description={profileData.bio || "No bio available"}
                      info={profileData}
                      social={socialLinks}
                      shadow={true}
                    />

                    {/* Verified Badge */}
                    {profileData.isVerified && (
                      <Chip
                        icon={<VerifiedIcon />}
                        label="Verified"
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          fontWeight: "bold",
                          color: "text.main",
                        }}
                      />
                    )}
                  </Box>
                </Grid>

                {isOwnProfile && (
                  <Grid item xs={12} md={6} xl={4}>
                    <MetaMaskIntegration />
                  </Grid>
                )}

                {!isOwnProfile && profileData.role === "organizer" && (
                  <Grid item xs={12} md={6} xl={6}>
                    <Card
                      sx={{
                        height: "100%",
                        p: 2,
                        backgroundColor: "background.card",
                        borderLeft: `4px solid ${"success.main"}`,
                      }}
                    >
                      <MDBox display="flex" alignItems="center" mb={2}>
                        <Icon fontSize="large" sx={{ mr: 1, color: "success.main" }}>
                          workspace_premium
                        </Icon>
                        <MDTypography variant="h5" fontWeight="bold">
                          Verified Organizer
                        </MDTypography>
                      </MDBox>
                      <MDTypography variant="body2" color="text" mb={2}>
                        This user is a verified event organizer on the platform. They create and
                        manage events for the community.
                      </MDTypography>
                      <Chip
                        label="Trusted by Community"
                        size="small"
                        icon={<VerifiedIcon />}
                        sx={{
                          backgroundColor: "success.main",
                          color: "white.main",
                        }}
                      />
                    </Card>
                  </Grid>
                )}
              </Grid>
            </MDBox>

            {/* Events Section */}
            {!isOwnProfile && events && events.length > 0 && (
              <MDBox mt={4}>
                <MDBox
                  px={2}
                  py={2}
                  sx={{
                    background: darkMode
                      ? `linear-gradient(135deg, ${"background.card"} 0%, ${"grey[900]"} 100%)`
                      : `linear-gradient(135deg, ${"white.main"} 0%, ${"grey[100]"} 100%)`,
                    borderRadius: 2,
                    mb: 2,
                    borderLeft: `4px solid ${"info.main"}`,
                  }}
                >
                  <MDBox display="flex" alignItems="center" justifyContent="space-between">
                    <MDBox>
                      <MDTypography variant="h5" fontWeight="bold" mb={0.5}>
                        {profileData.role === "organizer"
                          ? "Organized Events"
                          : "Participated Events"}
                      </MDTypography>
                      <MDTypography variant="button" color="text">
                        {events.length} {events.length === 1 ? "event" : "events"} total
                      </MDTypography>
                    </MDBox>
                    <Chip
                      label={profileData.role === "organizer" ? "Organizer" : "Participant"}
                      size="small"
                      sx={{
                        backgroundColor: "info.main",
                        color: "white.main",
                      }}
                    />
                  </MDBox>
                </MDBox>

                <Grid container spacing={3} px={2}>
                  {events.map((event) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={event._id}>
                      <EventCard event={event} />
                    </Grid>
                  ))}
                </Grid>
              </MDBox>
            )}

            {!isOwnProfile && (!events || events.length === 0) && (
              <MDBox
                p={4}
                textAlign="center"
                sx={{
                  backgroundColor: darkMode ? "background.card" : "grey[100]",
                  borderRadius: 2,
                  mt: 3,
                }}
              >
                <Icon fontSize="large" sx={{ mb: 1, color: "grey[500]" }}>
                  event_busy
                </Icon>
                <MDTypography variant="h6" color="text" fontWeight="medium">
                  {profileData.role === "organizer"
                    ? "No organized events yet"
                    : profileData.showParticipatedPublic
                      ? "No participated events yet"
                      : "Participated events are private"}
                </MDTypography>
              </MDBox>
            )}

            {/* Projects Section */}
            <MDBox mt={6}>
              <MDBox px={2} mb={3}>
                <MDTypography variant="h5" fontWeight="bold" mb={0.5}>
                  Projects
                </MDTypography>
                <MDTypography variant="button" color="text">
                  {isOwnProfile ? "Your projects" : `${profileData.name}'s projects`}
                </MDTypography>
              </MDBox>

              <Grid container spacing={3} px={2}>
                {projects.map((project, index) => (
                  <Grid item xs={12} md={6} xl={3} key={index}>
                    <DefaultProjectCard
                      image={project.image}
                      label={project.label}
                      title={project.title}
                      description={project.description}
                      action={{
                        type: "internal",
                        route: "/pages/profile/profile-overview",
                        color: "info",
                        label: "view project",
                      }}
                      authors={project.authors}
                    />
                  </Grid>
                ))}
              </Grid>
            </MDBox>
          </>
        )}

        {/* Settings Tab - Only for OWN profile */}
        {isOwnProfile && activeTab === 1 && (
          <MDBox mt={5} mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={8}>
                <Card
                  sx={{
                    p: 3,
                    backgroundColor: "background.card",
                  }}
                >
                  <MDBox display="flex" alignItems="center" mb={3}>
                    <Icon fontSize="large" sx={{ mr: 1, color: "info.main" }}>
                      settings
                    </Icon>
                    <MDTypography variant="h4" fontWeight="bold">
                      Profile Settings
                    </MDTypography>
                  </MDBox>
                  <PlatformSettings role={profileData.role} />
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        )}
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default memo(UnifiedProfile);
