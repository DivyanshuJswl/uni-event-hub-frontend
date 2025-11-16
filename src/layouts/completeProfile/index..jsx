import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useAuth } from "context/AuthContext";
import { useNotifications } from "context/NotifiContext";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";
import FacebookIcon from "@mui/icons-material/Facebook";
import PinterestIcon from "@mui/icons-material/Pinterest";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import CodeIcon from "@mui/icons-material/Code";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

// Constants
const ALLOWED_BRANCHES = ["CSE", "ECE", "EEE", "ME", "CE", "IT", "OTHERS"];
const MIN_YEAR = 1;
const MAX_YEAR = 5;

// Social platform configurations
const SOCIAL_PLATFORMS = {
  linkedin: {
    label: "LinkedIn",
    icon: <LinkedInIcon />,
    color: "#0077B5",
    placeholder: "https://linkedin.com/in/username",
  },
  github: {
    label: "GitHub",
    icon: <GitHubIcon />,
    color: "#24292E",
    placeholder: "https://github.com/username",
  },
  twitter: {
    label: "Twitter",
    icon: <TwitterIcon />,
    color: "#1DA1F2",
    placeholder: "https://twitter.com/username",
  },
  facebook: {
    label: "Facebook",
    icon: <FacebookIcon />,
    color: "#3B5998",
    placeholder: "https://facebook.com/username",
  },
  instagram: {
    label: "Instagram",
    icon: <InstagramIcon />,
    color: "#E1306C",
    placeholder: "https://instagram.com/username",
  },
  pinterest: {
    label: "Pinterest",
    icon: <PinterestIcon />,
    color: "#E60023",
    placeholder: "https://pinterest.com/username",
  },
  youtube: {
    label: "YouTube",
    icon: <YouTubeIcon />,
    color: "#FF0000",
    placeholder: "https://youtube.com/@username",
  },
  leetcode: {
    label: "LeetCode",
    icon: <CodeIcon />,
    color: "#FFA116",
    placeholder: "https://leetcode.com/username",
  },
  website: {
    label: "Website",
    icon: <LanguageIcon />,
    color: "#666666",
    placeholder: "https://yourwebsite.com",
  },
};

// Validators
const validators = {
  email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  year: (year) => year >= MIN_YEAR && year <= MAX_YEAR,
  branch: (branch) => ALLOWED_BRANCHES.includes(branch.toUpperCase()),
  name: (name) => name.trim().length >= 2 && name.trim().length <= 50,
  username: (username) => /^[a-zA-Z0-9_]{4,24}$/.test(username),
  bio: (bio) => bio.length <= 200,
  url: (url) => {
    if (!url) return true;
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  },
};

function CompleteProfile() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    year: "",
    branch: "",
  });

  const [socialLinks, setSocialLinks] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [errors, setErrors] = useState({});

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        year: user.year || "",
        branch: user.branch || "",
      });

      // Initialize social links
      if (user.social) {
        const existingLinks = [];
        Object.entries(user.social).forEach(([platform, url]) => {
          if (url) {
            existingLinks.push({
              id: Date.now() + Math.random(),
              platform,
              url,
            });
          }
        });
        setSocialLinks(existingLinks);
      }
    }
  }, [user]);

  // Available platforms
  const availablePlatforms = useMemo(() => {
    const addedPlatforms = socialLinks.map((link) => link.platform);
    return Object.keys(SOCIAL_PLATFORMS).filter((platform) => !addedPlatforms.includes(platform));
  }, [socialLinks]);

  // Year options
  const yearOptions = useMemo(
    () => Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i),
    []
  );

  // Check username availability
  const checkUsernameAvailability = useCallback(
    async (username) => {
      if (!username || username === user?.username) {
        setUsernameAvailable(null);
        return;
      }

      if (!validators.username(username)) {
        setUsernameAvailable(false);
        return;
      }

      setCheckingUsername(true);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/profile/check-username/${username}`,
          { headers: { "Content-Type": "application/json" } }
        );
        const data = await response.json();
        setUsernameAvailable(data.available);
      } catch (error) {
        console.error("Error checking username:", error);
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    },
    [user?.username]
  );

  // Debounced username check
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.username && formData.username !== user?.username) {
        checkUsernameAvailability(formData.username);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.username, checkUsernameAvailability, user?.username]);

  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  const handleAddSocialLink = useCallback(() => {
    if (!selectedPlatform) {
      showToast("Please select a platform", "warning", "Platform Required");
      return;
    }

    setSocialLinks((prev) => [
      ...prev,
      {
        id: Date.now(),
        platform: selectedPlatform,
        url: "",
      },
    ]);
    setSelectedPlatform("");
  }, [selectedPlatform, showToast]);

  const handleRemoveSocialLink = useCallback((id) => {
    setSocialLinks((prev) => prev.filter((link) => link.id !== id));
  }, []);

  const handleSocialLinkChange = useCallback((id, url) => {
    setSocialLinks((prev) => prev.map((link) => (link.id === id ? { ...link, url } : link)));
  }, []);

  const validateField = useCallback((field, value) => {
    switch (field) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (!validators.email(value.trim())) return "Please enter a valid email address";
        return "";
      case "name":
        if (!value.trim()) return "Name is required";
        if (!validators.name(value.trim())) return "Name must be between 2 and 50 characters";
        return "";
      case "username":
        if (!value.trim()) return "Username is required";
        if (!validators.username(value.trim()))
          return "Username must be 4-24 characters (letters, numbers, underscore only)";
        return "";
      case "bio":
        if (!validators.bio(value)) return "Bio must be 200 characters or less";
        return "";
      case "year":
        if (!value) return "Year is required";
        const yearNum = parseInt(value);
        if (isNaN(yearNum)) return "Year must be a number";
        if (!validators.year(yearNum)) return `Year must be between ${MIN_YEAR} and ${MAX_YEAR}`;
        return "";
      case "branch":
        if (!value) return "Branch is required";
        if (!validators.branch(value))
          return `Branch must be one of: ${ALLOWED_BRANCHES.join(", ")}`;
        return "";
      default:
        return "";
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    ["name", "username", "email", "bio", "year", "branch"].forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    // Validate social URLs
    socialLinks.forEach((link) => {
      if (link.url && !validators.url(link.url)) {
        newErrors[`social_${link.id}`] = "Please enter a valid URL";
      }
    });

    if (formData.username !== user?.username && usernameAvailable === false) {
      newErrors.username = "Username is already taken";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Please fix the errors before submitting", "error", "Validation Error");
      return;
    }

    setLoading(true);

    try {
      // Build social object
      const socialObject = {};
      socialLinks.forEach((link) => {
        if (link.url) {
          socialObject[link.platform] = link.url;
        }
      });

      const updateData = {
        name: formData.name,
        username: formData.username.toLowerCase(),
        email: formData.email,
        bio: formData.bio,
        year: parseInt(formData.year),
        branch: formData.branch,
        social: socialObject,
      };

      const response = await updateProfile(updateData);

      if (response.success) {
        showToast("Profile updated successfully!", "success", "Update Complete");
        setTimeout(() => {
          navigate(`/profile/${formData.username}`);
        }, 1500);
      } else {
        throw new Error(response.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      showToast(error.message || "Failed to update profile", "error", "Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            <Card>
              <MDBox
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                px={3}
                py={2}
                sx={{
                  background: "linear-gradient(90deg, #1976d2 0%, #21cbf3 100%)",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
              >
                <MDBox display="flex" alignItems="center" gap={1}>
                  <Icon sx={{ color: "white" }}>edit</Icon>
                  <MDTypography variant="h5" color="white" fontWeight="bold">
                    Complete Your Profile
                  </MDTypography>
                </MDBox>
              </MDBox>

              <MDBox component="form" onSubmit={handleSubmit} px={4} py={3}>
                <Grid container spacing={2}>
                  {/* Username Field */}
                  <Grid item xs={12}>
                    <MDBox mb={2}>
                      <MDTypography variant="body2" fontWeight="bold" color="text" mb={1}>
                        Username
                      </MDTypography>
                      <MDInput
                        value={formData.username}
                        onChange={(e) =>
                          handleInputChange("username", e.target.value.toLowerCase())
                        }
                        helperText={
                          <MDTypography variant="caption">
                            {errors.username ||
                              (checkingUsername ? "Checking availability..." : "") ||
                              (usernameAvailable === true ? "Username available!" : "") ||
                              (usernameAvailable === false ? "Username taken" : "")}
                          </MDTypography>
                        }
                        fullWidth
                        placeholder="Enter username (lowercase)"
                        InputProps={{
                          startAdornment: <MDTypography mr={0.5}>@</MDTypography>,
                          endAdornment: checkingUsername ? (
                            <CircularProgress size={16} />
                          ) : usernameAvailable === true ? (
                            <CheckCircleIcon color="success" fontSize="small" />
                          ) : usernameAvailable === false ? (
                            <ErrorIcon color="error" fontSize="small" />
                          ) : null,
                        }}
                      />
                    </MDBox>
                  </Grid>

                  {/* Name Field */}
                  <Grid item xs={12}>
                    <MDBox mb={2}>
                      <MDTypography variant="body2" fontWeight="bold" color="text" mb={1}>
                        Full Name
                      </MDTypography>
                      <MDInput
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        error={!!errors.name}
                        helperText={<MDTypography variant="caption">{errors.name}</MDTypography>}
                        fullWidth
                        placeholder="Enter your full name"
                      />
                    </MDBox>
                  </Grid>

                  {/* Email Field */}
                  <Grid item xs={12}>
                    <MDBox mb={2}>
                      <MDTypography variant="body2" fontWeight="bold" color="text" mb={1}>
                        Email Address
                      </MDTypography>
                      <MDInput
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        error={!!errors.email}
                        helperText={<MDTypography variant="caption">{errors.email}</MDTypography>}
                        fullWidth
                        placeholder="Enter your email address"
                      />
                    </MDBox>
                  </Grid>

                  {/* Bio Field */}
                  <Grid item xs={12}>
                    <MDBox mb={2}>
                      <MDTypography variant="body2" fontWeight="bold" color="text" mb={1}>
                        Bio ({formData.bio.length}/200)
                      </MDTypography>
                      <TextField
                        multiline
                        rows={3}
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        error={!!errors.bio}
                        helperText={<MDTypography variant="caption">{errors.bio}</MDTypography>}
                        fullWidth
                        placeholder="Tell us about yourself..."
                        inputProps={{ maxLength: 200 }}
                      />
                    </MDBox>
                  </Grid>

                  {/* Year and Branch */}
                  <Grid item xs={12} sm={6}>
                    <MDBox mb={2}>
                      <MDTypography variant="body2" fontWeight="bold" color="text" mb={1}>
                        Academic Year
                      </MDTypography>
                      <FormControl fullWidth error={!!errors.year}>
                        <Select
                          value={formData.year}
                          onChange={(e) => handleInputChange("year", e.target.value)}
                          displayEmpty
                          sx={{ height: "2.75rem" }}
                        >
                          <MenuItem value="">Select year</MenuItem>
                          {yearOptions.map((year) => (
                            <MenuItem key={year} value={year}>
                              Year {year}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.year && (
                          <MDTypography variant="caption" color="error">
                            {errors.year}
                          </MDTypography>
                        )}
                      </FormControl>
                    </MDBox>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <MDBox mb={2}>
                      <MDTypography variant="body2" fontWeight="bold" color="text" mb={1}>
                        Branch
                      </MDTypography>
                      <FormControl fullWidth error={!!errors.branch}>
                        <Select
                          value={formData.branch}
                          onChange={(e) => handleInputChange("branch", e.target.value)}
                          displayEmpty
                          sx={{ height: "2.75rem" }}
                        >
                          <MenuItem value="">Select branch</MenuItem>
                          {ALLOWED_BRANCHES.map((branch) => (
                            <MenuItem key={branch} value={branch}>
                              {branch}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.branch && (
                          <MDTypography variant="caption" color="error">
                            {errors.branch}
                          </MDTypography>
                        )}
                      </FormControl>
                    </MDBox>
                  </Grid>

                  {/* Social Links Section */}
                  <Grid item xs={12}>
                    <MDBox mt={2} mb={1}>
                      <MDBox display="flex" alignItems="center" justifyContent="space-between">
                        <MDTypography variant="body2" fontWeight="bold" color="text" mb={1}>
                          Social Links
                        </MDTypography>
                        <MDTypography variant="caption" color="text">
                          {socialLinks.length} link{socialLinks.length !== 1 ? "s" : ""} added
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                  </Grid>

                  {/* Existing Social Links */}
                  {socialLinks.map((link) => {
                    const platform = SOCIAL_PLATFORMS[link.platform];
                    return (
                      <Grid item xs={12} key={link.id}>
                        <MDBox
                          display="flex"
                          alignItems="flex-start"
                          gap={1}
                          p={1.5}
                          sx={{
                            backgroundColor: "rgba(0,0,0,0.02)",
                            borderRadius: 1,
                            border: "1px solid rgba(0,0,0,0.08)",
                          }}
                        >
                          <MDBox
                            display="flex"
                            sx={{
                              width: 35,
                              height: 35,
                              paddingTop: 1,
                              borderRadius: 1,
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: platform?.color,
                            }}
                          >
                            {" "}
                            {
                              <MDTypography variant="h4" color="white">
                                {platform?.icon}
                              </MDTypography>
                            }
                          </MDBox>
                          <MDBox flex={1}>
                            <MDTypography variant="h6" fontWeight="bold">
                              {platform?.label}
                            </MDTypography>
                            <MDInput
                              value={link.url}
                              onChange={(e) => handleSocialLinkChange(link.id, e.target.value)}
                              error={!!errors[`social_${link.id}`]}
                              helperText={errors[`social_${link.id}`]}
                              fullWidth
                              placeholder={platform?.placeholder}
                              size="medium"
                            />
                          </MDBox>
                          <IconButton
                            onClick={() => handleRemoveSocialLink(link.id)}
                            size="small"
                            color="error"
                            sx={{ mt: 0.5 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </MDBox>
                      </Grid>
                    );
                  })}

                  {/* Add Social Link */}
                  {availablePlatforms.length > 0 && (
                    <Grid item xs={12}>
                      <MDBox
                        display="flex"
                        gap={1}
                        alignItems="center"
                        p={1.5}
                        sx={{
                          backgroundColor: "rgba(33, 150, 243, 0.05)",
                          borderRadius: 1,
                          border: "1px dashed rgba(33, 150, 243, 0.3)",
                        }}
                      >
                        <FormControl fullWidth size="small">
                          <Select
                            value={selectedPlatform}
                            onChange={(e) => setSelectedPlatform(e.target.value)}
                            displayEmpty
                            renderValue={(selected) => {
                              if (!selected) {
                                return <em>Select platform to add</em>;
                              }
                              const platform = SOCIAL_PLATFORMS[selected];
                              return (
                                <MDTypography
                                  variant="body3"
                                  display="flex"
                                  alignItems="center"
                                  gap={1}
                                >
                                  {platform.icon}
                                  <span>{platform.label}</span>
                                </MDTypography>
                              );
                            }}
                            sx={{ height: "2.5rem" }}
                          >
                            {availablePlatforms.map((platformKey) => {
                              const platform = SOCIAL_PLATFORMS[platformKey];
                              return (
                                <MenuItem key={platformKey} value={platformKey}>
                                  <MDTypography
                                    variant="body3"
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                  >
                                    {platform.icon}
                                    <span>{platform.label}</span>
                                  </MDTypography>
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                        <MDButton
                          variant="gradient"
                          color="info"
                          size="medium"
                          iconOnly
                          onClick={handleAddSocialLink}
                          disabled={!selectedPlatform}
                        >
                          <AddIcon />
                        </MDButton>
                      </MDBox>
                    </Grid>
                  )}

                  {availablePlatforms.length === 0 && socialLinks.length > 0 && (
                    <Grid item xs={12}>
                      <Alert severity="" sx={{ mt: 1 }}>
                        All available platforms have been added!
                      </Alert>
                    </Grid>
                  )}
                </Grid>

                <MDBox display="flex" justifyContent="flex-end" mt={4} gap={2}>
                  <MDButton
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    Cancel
                  </MDButton>
                  <MDButton
                    type="submit"
                    variant="gradient"
                    color="info"
                    disabled={loading || usernameAvailable === false}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                  >
                    {loading ? "Saving..." : "Save Profile"}
                  </MDButton>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default CompleteProfile;
