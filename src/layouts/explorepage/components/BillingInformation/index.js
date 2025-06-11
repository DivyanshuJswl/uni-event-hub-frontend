// // @mui material components
// import Card from "@mui/material/Card";

// // Material Dashboard 2 React components
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import Bill from "../Bill";

// function BillingInformation() {
//   return (
//     <Card>
//       <MDBox pt={3} px={2}>
//         <MDTypography variant="h4" fontWeight="medium">
//           Latest Tech News
//         </MDTypography>
//       </MDBox>
//       <MDBox pt={1} px={2}>
//         <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
//           <Bill
//             name="New AI benchmarks test speed of running AI applications"
//             description="For the new test, Nvidia's latest generation of artificial intelligence servers - called Grace Blackwell, which have 72 Nvidia graphics processing units (GPUs) inside - was 2.8 to 3.4 times faster than the previous generation, even when only using eight GPUs in the newer server to create a direct comparison to the older model, the company said at a briefing on Tuesday."
//             link="https://www.reuters.com/technology/artificial-intelligence/new-ai-benchmarks-test-speed-running-ai-applications-2025-04-02/"
//           />
//           <Bill
//             name="SpaceX rocket cargo project puts Pacific seabirds in jeopardy"
//             description="A project proposed by Elon Musk's SpaceX and the U.S. Air Force to test hypersonic rocket cargo deliveries from a remote Pacific atoll could harm the many seabirds that nest at the wildlife refuge, according to biologists and experts who have spent more than a decade working to protect them."
//             link="https://www.reuters.com/technology/space/spacex-rocket-cargo-project-puts-pacific-seabirds-jeopardy-2025-04-02/"
//           />
//           <Bill
//             name="EU to invest $1.4 billion in artificial intelligence, cybersecurity and digital skills"
//             description="'Securing European tech sovereignty starts with investing in advanced technologies and in making it possible for people to improve their digital competences,' European Commission digital chief Henna Virkkunen said."
//             link="https://www.reuters.com/technology/artificial-intelligence/eu-invest-14-billion-artificial-intelligence-cybersecurity-digital-skills-2025-03-28/"
//           />
//         </MDBox>
//       </MDBox>
//     </Card>
//   );
// }

// export default BillingInformation;
// @mui material components
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Bill component
import Bill from "../Bill";

import { useState, useEffect } from "react";

function BillingInformation() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTechNews = async () => {
      try {
        setLoading(true);
        const apiKey = process.env.NEWS_API_KEY || ""; // Fallback to hardcoded key if env variable is not set
        const response = await fetch(
          "https://newsapi.org/v2/top-headlines?category=technology&pageSize=8&apiKey=" + apiKey
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setNews(data.articles);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tech news:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTechNews();
  }, []);

  const refreshNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        "https://newsapi.org/v2/top-headlines?category=technology&pageSize=8&apiKey=" + apiKey
      );
      const data = await response.json();
      setNews(data.articles);
      setLoading(false);
    } catch (err) {
      console.error("Error refreshing news:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Card>
      <MDBox pt={3} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h4" fontWeight="medium">
          Top Tech Headlines
        </MDTypography>
        <Button
          variant="outlined"
          color="primary"
          onClick={refreshNews}
          disabled={loading}
          startIcon={<Icon>refresh</Icon>}
        >
          Refresh
        </Button>
      </MDBox>

      <MDBox pt={1} px={2}>
        {loading ? (
          <MDBox display="flex" justifyContent="center" py={4}>
            <CircularProgress color="info" />
          </MDBox>
        ) : error ? (
          <MDBox py={2}>
            <MDTypography variant="body2" color="error">
              Error loading news: {error}
            </MDTypography>
            <Button
              variant="text"
              color="info"
              onClick={refreshNews}
              startIcon={<Icon>refresh</Icon>}
            >
              Try Again
            </Button>
          </MDBox>
        ) : (
          <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
            {news.map((article, index) => (
              <Bill
                key={index}
                name={article.title}
                description={article.description}
                link={article.url}
                image={article.urlToImage}
                author={article.author}
                source={article.source?.name}
                publishedAt={article.publishedAt}
              />
            ))}
          </MDBox>
        )}
      </MDBox>

      <MDBox p={2} display="flex" justifyContent="center">
        <MDTypography variant="button" color="text">
          {news.length} of {news.length} shown
        </MDTypography>
      </MDBox>
    </Card>
  );
}

export default BillingInformation;
