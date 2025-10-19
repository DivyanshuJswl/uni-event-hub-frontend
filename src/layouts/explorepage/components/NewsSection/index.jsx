// @mui material components
import React from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import Pagination from "@mui/material/Pagination";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import NewsCard from "examples/Cards/NewsCard";
import { useState, useEffect } from "react";
import { useMaterialUIController } from "context";

function NewsSection() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
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
      const response = await fetch(`${BASE_URL}/api/tech-news`);
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

  // Skeleton loading component
  const NewsCardSkeleton = () => (
    <Card sx={{ mb: 2, boxShadow: 3, p: 2 }}>
      <Skeleton variant="rectangular" height={160} sx={{ mb: 2, borderRadius: 1 }} />
      <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="60%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="40%" sx={{ mb: 2 }} />
      <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={36} width={120} sx={{ borderRadius: 1 }} />
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
        py={2.5}
        px={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          flexDirection: { xs: "column", sm: "column", md: "row" },
          gap: 2,
          borderBottom: darkMode
            ? "1px solid rgba(255, 255, 255, 0.12)"
            : "1px solid rgba(0, 0, 0, 0.08)",
          backgroundColor: darkMode ? "background.default" : "background.paper",
        }}
      >
        <MDTypography variant="h4" px="1rem" fontWeight="medium" color={darkMode ? "white" : "dark"}>
          Top Tech Headlines
        </MDTypography>
        <MDBox display="flex" alignItems="center" gap={2}>
          <TextField
            label="Items per page"
            type="number"
            value={inputValue}
            onChange={handleArticlesPerPageChange}
            inputProps={{ min: 1, max: 20 }}
            size="small"
            sx={{
              width: 120,
              "& .MuiInputBase-input": {
                color: darkMode ? "white" : "text.primary",
              },
            }}
          />
          <Button
            variant="outlined"
            sx={{
              borderRadius: "8px",
              fontWeight: 400,
              borderWidth: "1px",
              color: darkMode ? "primary.main" : "primary.main",
              borderColor: darkMode ? "primary.main" : "primary.main",
              "&:hover": {
                borderColor: darkMode ? "primary.dark" : "primary.dark",
                backgroundColor: darkMode ? "rgba(25, 118, 210, 0.08)" : "rgba(25, 118, 210, 0.04)",
              },
              "&.Mui-disabled": {
                borderColor: darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.26)",
                color: darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.26)",
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

      <MDBox
        pt={1}
        px={2}
        sx={{
          backgroundColor: darkMode ? "background.default" : "background.paper",
        }}
      >
        {loading ? (
          <MDBox display="flex" flexDirection="column" py={4} gap={2}>
            {Array.from({ length: articlesPerPage }).map((_, index) => (
              <NewsCardSkeleton key={index} />
            ))}
          </MDBox>
        ) : error ? (
          <MDBox py={4} textAlign="center">
            <MDTypography variant="body2" color="error" sx={{ mb: 2 }}>
              Error loading news: {error}
            </MDTypography>
            <Button
              variant="contained"
              color="primary"
              onClick={refreshNews}
              startIcon={<Icon>refresh</Icon>}
              sx={{ borderRadius: 2 }}
            >
              Try Again
            </Button>
          </MDBox>
        ) : news.length === 0 ? (
          <MDBox py={4} textAlign="center">
            <MDTypography variant="body2" color="text" sx={{ mb: 2 }}>
              No news articles available at the moment.
            </MDTypography>
            <Button
              variant="outlined"
              color="primary"
              onClick={refreshNews}
              startIcon={<Icon>refresh</Icon>}
              sx={{ borderRadius: 2 }}
            >
              Refresh
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
              <MDBox display="flex" justifyContent="center" mt={3} mb={2}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: darkMode ? "white" : "text.primary",
                    },
                    "& .MuiPaginationItem-root.Mui-selected": {
                      backgroundColor: darkMode ? "primary.main" : "primary.main",
                      color: "white",
                    },
                  }}
                />
              </MDBox>
            )}
          </>
        )}
      </MDBox>

      {!loading && news.length > 0 && (
        <MDBox
          p={2}
          display="flex"
          justifyContent="center"
          sx={{
            borderTop: darkMode
              ? "1px solid rgba(255, 255, 255, 0.08)"
              : "1px solid rgba(0, 0, 0, 0.04)",
            backgroundColor: darkMode ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
          }}
        >
          <MDTypography variant="button" color="text">
            Showing {indexOfFirstArticle + 1}-{Math.min(indexOfLastArticle, news.length)} of{" "}
            {news.length} articles
          </MDTypography>
        </MDBox>
      )}
    </Card>
  );
}

export default NewsSection;
