// @mui material components
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import SkillCard from "examples/Cards/SkillCard";

// React imports
import { useState, useEffect } from "react";
import { useMaterialUIController } from "context";

function BillingInformation() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  useEffect(() => {
    const fetchTrendingSkills = async () => {
      try {
        setLoading(true);
        // This would be your actual API endpoint
        // const response = await fetch('https://api.yourservice.com/trending-skills');
        // const data = await response.json();
        // setSkills(data);

        // Simulating API call with timeout
        setTimeout(() => {
          const mockSkills = [
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
          ];
          setSkills(mockSkills);
          setLoading(false);
        }, 600);
      } catch (err) {
        console.error("Error fetching trending skills:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTrendingSkills();
  }, []);

  const refreshSkills = () => {
    // This would refresh the skills data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  // Skeleton loading component
  const SkillCardSkeleton = () => (
    <Card
      sx={{
        mb: 2,
        boxShadow: 2,
        backgroundColor: "background.default",
        p: 2,
      }}
    >
      <Skeleton variant="text" height={30} width="80%" sx={{ mb: 1.5 }} />
      <Skeleton variant="text" height={20} sx={{ mb: 0.5 }} />
      <Skeleton variant="text" height={20} width="90%" sx={{ mb: 0.5 }} />
      <Skeleton variant="text" height={20} width="70%" sx={{ mb: 2 }} />
      <Skeleton
        variant="rectangular"
        height={36}
        width={120}
        sx={{ borderRadius: 1, ml: "auto" }}
      />
    </Card>
  );

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: darkMode ? "0 8px 32px rgba(0, 0, 0, 0.24)" : "0 8px 32px rgba(0, 0, 0, 0.08)",
        overflow: "hidden",
      }}
    >
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
              "&:hover": {
                color: "primary.main",
              },
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

      <MDBox
        pt={1}
        px={2}
        sx={{
          backgroundColor: "background.default",
        }}
      >
        {loading ? (
          <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
            {[1, 2, 3, 4].map((item) => (
              <SkillCardSkeleton key={item} />
            ))}
          </MDBox>
        ) : error ? (
          <MDBox py={4} textAlign="center">
            <MDTypography variant="body2" color="error" sx={{ mb: 2 }}>
              Error loading skills: {error}
            </MDTypography>
          </MDBox>
        ) : (
          <MDBox component="ul" display="flex" flexDirection="column" p={1} gap={2}>
            {skills.map((skill) => (
              <SkillCard
                key={skill.id}
                title={skill.title}
                description={skill.description}
                url={skill.url}
                trend={skill.trend}
                demand={skill.demand}
                avgSalary={skill.avgSalary}
              />
            ))}
          </MDBox>
        )}
      </MDBox>
    </Card>
  );
}

export default BillingInformation;
