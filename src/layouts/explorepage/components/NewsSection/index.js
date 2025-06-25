// @mui material components
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import NewsCard from "../NewsCard";

import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { useMaterialUIController } from "context";

function NewsSection() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [articlesPerPage, setArticlesPerPage] = useState(3);
  const [inputValue, setInputValue] = useState("3");
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  useEffect(() => {
    const fetchTechNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/tech-news`);
        const data = await response.json();
        setNews(data.articles || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tech news:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchTechNews();
  }, []);

  const handleArticlesPerPageChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Only update if the value is a positive number
    if (/^\d+$/.test(value) && parseInt(value) > 0) {
      setArticlesPerPage(parseInt(value));
      setPage(1); // Reset to first page when changing items per page
    }
  };
  const refreshNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://uni-event-hub-backend.onrender.com/api/tech-news");
      const data = await response.json();
      setNews(data.articles || []);
      setPage(1); // Reset to first page when refreshing
      setLoading(false);
    } catch (err) {
      console.error("Error refreshing news:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Calculate current articles to display
  const indexOfLastArticle = page * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = news.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(news.length / articlesPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Card>
      <MDBox pt={3} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h4" fontWeight="medium">
          Top Tech Headlines
        </MDTypography>
        <MDBox display="flex" alignItems="center">
          <TextField
            label="Items per page"
            type="number"
            value={inputValue}
            onChange={handleArticlesPerPageChange}
            inputProps={{ min: 1, max: 20 }}
            size="small"
            sx={{ width: 120, mr: 2 }}
          />
          <Button
            variant="outlined"
            sx={{
              borderRadius: "8px", // Rounded corners
              fontWeight: 300, // Thin font weight
              borderWidth: "1px", // Thin border
              color: darkMode ? "primary.main" : "text.primary", // Text color
              borderColor: darkMode ? "primary.main" : "text.primary", // Border color
              "&:hover": {
                borderColor: darkMode ? "primary.dark" : "text.secondary",
              },
              "&.Mui-disabled": {
                borderColor: darkMode ? "text.disabled" : "action.disabledBackground",
                color: darkMode ? "text.disabled" : "action.disabled",
              },
            }}
            onClick={refreshNews}
            disabled={loading}
            startIcon={<Icon>refresh</Icon>}
          >
            Refresh
          </Button>
        </MDBox>
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
          <>
            <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
              {currentArticles.map((article, index) => (
                <NewsCard
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
            {totalPages > 1 && (
              <MDBox display="flex" justifyContent="center" mt={3}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="secondary"
                  shape="rounded"
                />
              </MDBox>
            )}
          </>
        )}
      </MDBox>

      <MDBox p={2} display="flex" justifyContent="center">
        <MDTypography variant="button" color="text">
          Showing {indexOfFirstArticle + 1}-{Math.min(indexOfLastArticle, news.length)} of{" "}
          {news.length} articles
        </MDTypography>
      </MDBox>
    </Card>
  );
}

export default NewsSection;
