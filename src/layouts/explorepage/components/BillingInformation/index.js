// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Bill from "../Bill";

function BillingInformation() {
  return (
    <Card>
      <MDBox pt={3} px={2}>
        <MDTypography variant="h4" fontWeight="medium">
          Latest Tech News
        </MDTypography>
      </MDBox>
      <MDBox pt={1} px={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          <Bill
            name="New AI benchmarks test speed of running AI applications"
            description="For the new test, Nvidia's latest generation of artificial intelligence servers - called Grace Blackwell, which have 72 Nvidia graphics processing units (GPUs) inside - was 2.8 to 3.4 times faster than the previous generation, even when only using eight GPUs in the newer server to create a direct comparison to the older model, the company said at a briefing on Tuesday."
            link="https://www.reuters.com/technology/artificial-intelligence/new-ai-benchmarks-test-speed-running-ai-applications-2025-04-02/"
          />
          <Bill
            name="SpaceX rocket cargo project puts Pacific seabirds in jeopardy"
            description="A project proposed by Elon Musk's SpaceX and the U.S. Air Force to test hypersonic rocket cargo deliveries from a remote Pacific atoll could harm the many seabirds that nest at the wildlife refuge, according to biologists and experts who have spent more than a decade working to protect them."
            link="https://www.reuters.com/technology/space/spacex-rocket-cargo-project-puts-pacific-seabirds-jeopardy-2025-04-02/"
          />
          <Bill
            name="EU to invest $1.4 billion in artificial intelligence, cybersecurity and digital skills"
            description="'Securing European tech sovereignty starts with investing in advanced technologies and in making it possible for people to improve their digital competences,' European Commission digital chief Henna Virkkunen said."
            link="https://www.reuters.com/technology/artificial-intelligence/eu-invest-14-billion-artificial-intelligence-cybersecurity-digital-skills-2025-03-28/"
          />
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default BillingInformation;
