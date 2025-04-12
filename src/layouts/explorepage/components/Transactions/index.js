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
          Trending Skills
        </MDTypography>
      </MDBox>
      <MDBox pt={1} px={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          <Bill
            name="Generative AI (ChatGPT, Midjourney, etc.)"
            description="Leverage AI to create text, images, code, and more. Used in automation, content creation, and enhancing productivity."
          />
          <Bill
            name="Data Science & Machine Learning"
            description="Extract insights from large datasets using Python/R. Build predictive models for business, healthcare, and finance."
          />
          <Bill
            name="Cybersecurity (Ethical Hacking, Zero Trust)"
            description="Protect systems from cyber threats with penetration testing and secure frameworks. High demand due to increasing digital risks."
          />
          <Bill
            name=" Blockchain & Web3 Development"
            description="Build decentralized apps (dApps) and smart contracts. Growing demand in finance, NFTs, and decentralized systems."
          />
          <Bill
            name="Generative AI (ChatGPT, Midjourney, etc.)"
            description="Leverage AI to create text, images, code, and more. Used in automation, content creation, and enhancing productivity."
          />
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default BillingInformation;
