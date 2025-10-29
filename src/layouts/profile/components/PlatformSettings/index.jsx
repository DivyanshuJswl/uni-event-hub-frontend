import { useState, useCallback, useMemo, memo } from "react";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useNotifications } from "context/NotifiContext";

// Memoized Setting Item Component
const SettingItem = memo(({ label, checked, onChange }) => (
  <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
    <MDBox mt={0.5}>
      <Switch checked={checked} onChange={onChange} />
    </MDBox>
    <MDBox width="80%" ml={0.5}>
      <MDTypography variant="button" fontWeight="regular" color="text">
        {label}
      </MDTypography>
    </MDBox>
  </MDBox>
));

SettingItem.displayName = "SettingItem";

const PlatformSettings = memo(() => {
  const { showToast } = useNotifications();

  // Consolidated settings state
  const [settings, setSettings] = useState({
    followsMe: true,
    answersPost: false,
    mentionsMe: true,
    newLaunches: false,
    productUpdate: true,
    newsletter: false,
  });

  // Memoized toggle handler factory
  const createToggleHandler = useCallback(
    (settingKey, settingLabel) => {
      return () => {
        setSettings((prev) => {
          const newValue = !prev[settingKey];
          showToast(
            `${settingLabel} ${newValue ? "enabled" : "disabled"}`,
            "info",
            "Settings Updated"
          );
          return { ...prev, [settingKey]: newValue };
        });
      };
    },
    [showToast]
  );

  // Memoized account settings
  const accountSettings = useMemo(
    () => [
      {
        key: "followsMe",
        label: "Email me when someone follows me",
        checked: settings.followsMe,
        onChange: createToggleHandler("followsMe", "Follow notifications"),
      },
      {
        key: "answersPost",
        label: "Notify me when followed organizer post an event",
        checked: settings.answersPost,
        onChange: createToggleHandler("answersPost", "Event notifications"),
      },
      {
        key: "mentionsMe",
        label: "Email me when someone mentions me",
        checked: settings.mentionsMe,
        onChange: createToggleHandler("mentionsMe", "Mention notifications"),
      },
    ],
    [settings.followsMe, settings.answersPost, settings.mentionsMe, createToggleHandler]
  );

  // Memoized application settings
  const applicationSettings = useMemo(
    () => [
      {
        key: "newLaunches",
        label: "New projects and hackathons",
        checked: settings.newLaunches,
        onChange: createToggleHandler("newLaunches", "Project notifications"),
      },
      {
        key: "productUpdate",
        label: "Monthly top participant updates",
        checked: settings.productUpdate,
        onChange: createToggleHandler("productUpdate", "Monthly updates"),
      },
      {
        key: "newsletter",
        label: "Email me when certificates arrive",
        checked: settings.newsletter,
        onChange: createToggleHandler("newsletter", "Certificate notifications"),
      },
    ],
    [settings.newLaunches, settings.productUpdate, settings.newsletter, createToggleHandler]
  );

  return (
    <Card sx={{ boxShadow: "none" }}>
      <MDBox p={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Platform Settings
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
        {/* Account Settings */}
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Account
        </MDTypography>
        {accountSettings.map(({ key, ...settingProps }) => (
          <SettingItem key={key} {...settingProps} />
        ))}

        {/* Application Settings */}
        <MDBox mt={3}>
          <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
            Application
          </MDTypography>
        </MDBox>
        {applicationSettings.map(({ key, ...settingProps }) => (
          <SettingItem key={key} {...settingProps} />
        ))}
      </MDBox>
    </Card>
  );
});

PlatformSettings.displayName = "PlatformSettings";

export default PlatformSettings;
