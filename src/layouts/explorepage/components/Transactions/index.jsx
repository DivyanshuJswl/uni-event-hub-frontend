import { useState, useEffect, useCallback, useMemo, memo } from "react";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import SkillCard from "examples/Cards/SkillCard";
import { useMaterialUIController } from "context";
import { useNotifications } from "context/NotifiContext";

// Memoized skeleton component
const SkillCardSkeleton = memo(() => (
  <Card sx={{ mb: 2, boxShadow: 2, backgroundColor: "background.default", p: 2 }}>
    <Skeleton variant="text" height={30} width="80%" sx={{ mb: 1.5 }} />
    <Skeleton variant="text" height={20} sx={{ mb: 0.5 }} />
    <Skeleton variant="text" height={20} width="90%" sx={{ mb: 0.5 }} />
    <Skeleton variant="text" height={20} width="70%" sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={36} width={120} sx={{ borderRadius: 1, ml: "auto" }} />
  </Card>
));

SkillCardSkeleton.displayName = "SkillCardSkeleton";

function BillingInformation() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { showToast } = useNotifications();

  // Consolidated state
  const [skillsState, setSkillsState] = useState({
    skills: [],
    loading: true,
    error: null,
  });

  // Mock data
  const mockSkills = useMemo(
    () => [
      {
        id: 1,
        title: "Generative AI (ChatGPT, Midjourney, etc.)",
        description:
          "Leverage AI to create text, images, code, and more. Used in automation, content creation, and enhancing productivity.",
        url: "#generative-ai",
        trend: "high",
        demand: "90%",
        avgSalary: "$120,000",
      },
      {
        id: 2,
        title: "Data Science & Machine Learning",
        description:
          "Extract insights from large datasets using Python/R. Build predictive models for business, healthcare, and finance.",
        url: "#data-science",
        trend: "high",
        demand: "85%",
        avgSalary: "$110,000",
      },
      {
        id: 3,
        title: "Cybersecurity (Ethical Hacking, Zero Trust)",
        description:
          "Protect systems from cyber threats with penetration testing and secure frameworks. High demand due to increasing digital risks.",
        url: "#cybersecurity",
        trend: "rising",
        demand: "95%",
        avgSalary: "$130,000",
      },
      {
        id: 4,
        title: "Cloud Computing (AWS, Azure, GCP)",
        description:
          "Design, deploy, and manage cloud infrastructure. Essential for modern applications and scalable systems.",
        url: "#cloud-computing",
        trend: "high",
        demand: "88%",
        avgSalary: "$115,000",
      },
      {
        id: 5,
        title: "DevOps & Kubernetes",
        description:
          "Automate deployment, scaling, and management of containerized applications. Critical for CI/CD pipelines.",
        url: "#devops",
        trend: "rising",
        demand: "82%",
        avgSalary: "$125,000",
      },
    ],
    []
  );

  // Memoized fetch function
  const fetchTrendingSkills = useCallback(async () => {
    setSkillsState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 600));

      setSkillsState({
        skills: mockSkills,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error fetching trending skills:", err);
      const errorMessage = err.message || "Failed to load skills";

      setSkillsState({
        skills: [],
        loading: false,
        error: errorMessage,
      });

      showToast(errorMessage, "error", "Failed to Load Skills");
    }
  }, [mockSkills, showToast]);

  // Initial fetch
  useEffect(() => {
    fetchTrendingSkills();
  }, [fetchTrendingSkills]);

  // Memoized refresh handler
  const refreshSkills = useCallback(() => {
    fetchTrendingSkills();
    showToast("Skills data refreshed", "info", "Refreshed");
  }, [fetchTrendingSkills, showToast]);

  // Memoized card styles
  const cardStyles = useMemo(
    () => ({
      borderRadius: 3,
      boxShadow: darkMode ? "0 8px 32px rgba(0, 0, 0, 0.24)" : "0 8px 32px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
    }),
    [darkMode]
  );

  return (
    <Card sx={cardStyles}>
      <MDBox
        pt={3}
        px={2}
        sx={{
          borderBottom: darkMode
            ? "1px solid rgba(255, 255, 255, 0.12)"
            : "1px solid rgba(0, 0, 0, 0.08)",
          backgroundColor: "background.default",
        }}
      >
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h4" px="1rem" fontWeight="medium">
            Trending Skills
          </MDTypography>
          <MDTypography
            variant="caption"
            color="text"
            sx={{
              cursor: "pointer",
              "&:hover": { color: "primary.main" },
            }}
            onClick={refreshSkills}
          >
            Updated just now
          </MDTypography>
        </MDBox>
        <MDTypography variant="body2" px="1rem" color="text" sx={{ mt: 1, mb: 2 }}>
          Top in-demand skills based on current market trends
        </MDTypography>
      </MDBox>

      <MDBox pt={1} px={2} sx={{ backgroundColor: "background.default" }}>
        {skillsState.loading ? (
          <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
            {[1, 2, 3, 4].map((item) => (
              <SkillCardSkeleton key={item} />
            ))}
          </MDBox>
        ) : skillsState.error ? (
          <MDBox py={4} textAlign="center">
            <MDTypography variant="body2" color="error" sx={{ mb: 2 }}>
              Error loading skills: {skillsState.error}
            </MDTypography>
          </MDBox>
        ) : (
          <MDBox component="ul" display="flex" flexDirection="column" p={1} gap={2}>
            {skillsState.skills.map((skill) => (
              <SkillCard key={skill.id} {...skill} />
            ))}
          </MDBox>
        )}
      </MDBox>
    </Card>
  );
}

export default BillingInformation;
