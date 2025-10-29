import { useState, useEffect, useCallback, useMemo, memo } from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import Pagination from "@mui/material/Pagination";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import NewsCard from "examples/Cards/NewsCard";
import { useMaterialUIController } from "context";
import { useNotifications } from "context/NotifiContext";

// Memoized skeleton component
const NewsCardSkeleton = memo(() => (
  <Card sx={{ mb: 2, boxShadow: 3, p: 2 }}>
    <Skeleton variant="rectangular" height={160} sx={{ mb: 2, borderRadius: 1 }} />
    <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
    <Skeleton variant="text" height={20} width="60%" sx={{ mb: 1 }} />
    <Skeleton variant="text" height={20} width="40%" sx={{ mb: 2 }} />
    <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={36} width={120} sx={{ borderRadius: 1 }} />
  </Card>
));

NewsCardSkeleton.displayName = "NewsCardSkeleton";

function NewsSection() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { showToast } = useNotifications();

  // Consolidated state
  const [newsState, setNewsState] = useState({
    news: [],
    loading: true,
    error: null,
    page: 1,
    articlesPerPage: 3,
    inputValue: "3",
  });

  // Memoized fetch function
  const fetchTechNews = useCallback(
    async (isRefresh = false) => {
      setNewsState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(`${BASE_URL}/api/tech-news`, { timeout: 10000 });
        const data = await response.json();

        setNewsState((prev) => ({
          ...prev,
          news: data.articles || [],
          loading: false,
          page: isRefresh ? 1 : prev.page,
        }));

        if (isRefresh) {
          showToast("News refreshed successfully", "success", "Updated");
        }
      } catch (err) {
        console.error("Error fetching tech news:", err);
        const errorMessage = err.message || "Failed to load news";

        setNewsState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));

        showToast(errorMessage, "error", "Failed to Load News");
      }
    },
    [BASE_URL, showToast]
  );

  // Initial fetch
  useEffect(() => {
    fetchTechNews();
  }, [fetchTechNews]);

  // Memoized handlers
  const handleArticlesPerPageChange = useCallback((e) => {
    const value = e.target.value;
    setNewsState((prev) => ({ ...prev, inputValue: value }));

    if (/^\d+$/.test(value) && parseInt(value) > 0) {
      setNewsState((prev) => ({
        ...prev,
        articlesPerPage: parseInt(value),
        page: 1,
      }));
    }
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setNewsState((prev) => ({ ...prev, page: value }));
  }, []);

  const refreshNews = useCallback(() => {
    fetchTechNews(true);
  }, [fetchTechNews]);

  // Memoized calculations
  const paginationData = useMemo(() => {
    const { news, page, articlesPerPage } = newsState;
    const indexOfLastArticle = page * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = news.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(news.length / articlesPerPage);

    return {
      currentArticles,
      totalPages,
      indexOfFirstArticle,
      indexOfLastArticle,
    };
  }, [newsState.news, newsState.page, newsState.articlesPerPage]);

  // Memoized styles
  const cardStyles = useMemo(
    () => ({
      borderRadius: 3,
      boxShadow: darkMode ? "0 8px 32px rgba(0, 0, 0, 0.24)" : "0 8px 32px rgba(0, 0, 0, 0.08)",
    }),
    [darkMode]
  );

  return (
    <Card sx={cardStyles}>
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
          backgroundColor: "background.default",
        }}
      >
        <MDTypography
          variant="h4"
          px="1rem"
          fontWeight="medium"
          color={darkMode ? "white" : "dark"}
        >
          Top Tech Headlines
        </MDTypography>
        <MDBox display="flex" alignItems="center" gap={2}>
          <TextField
            label="Items per page"
            type="number"
            value={newsState.inputValue}
            onChange={handleArticlesPerPageChange}
            inputProps={{ min: 1, max: 20 }}
            size="small"
            sx={{
              width: 100,
              "& .MuiInputBase-input": {
                color: darkMode ? "white" : "text.primary",
              },
            }}
          />
          <Button
            variant="outlined"
            onClick={refreshNews}
            disabled={newsState.loading}
            startIcon={<Icon>refresh</Icon>}
            sx={{
              borderRadius: "8px",
              fontWeight: 400,
              maxWidth: "110px",
              color: "primary.main",
              borderColor: "primary.main",
            }}
          >
            Refresh
          </Button>
        </MDBox>
      </MDBox>

      <MDBox pt={1} px={2}>
        {newsState.loading ? (
          <MDBox display="flex" flexDirection="column" py={4} gap={2}>
            {Array.from({ length: newsState.articlesPerPage }).map((_, index) => (
              <NewsCardSkeleton key={index} />
            ))}
          </MDBox>
        ) : newsState.error ? (
          <MDBox py={4} textAlign="center">
            <MDTypography variant="body2" color="error" sx={{ mb: 2 }}>
              Error loading news: {newsState.error}
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
        ) : newsState.news.length === 0 ? (
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
              {paginationData.currentArticles.map((article, index) => (
                <NewsCard
                  key={`${article.url}-${index}`}
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
            {paginationData.totalPages > 1 && (
              <MDBox display="flex" justifyContent="center" mt={3} mb={2}>
                <Pagination
                  count={paginationData.totalPages}
                  page={newsState.page}
                  onChange={handlePageChange}
                  variant="outlined"
                  shape="rounded"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "text.main",
                      borderColor: "primary.main",
                      "&:hover": {
                        backgroundColor: darkMode
                          ? "rgba(255, 255, 255, 0.08)"
                          : "rgba(0, 0, 0, 0.04)",
                      },
                    },
                    "& .MuiPaginationItem-page.Mui-selected": {
                      backgroundColor: "info.main",
                      color: "white",
                      borderColor: "info.main",
                      "&:hover": {
                        backgroundColor: "info.dark",
                      },
                    },
                    "& .MuiPaginationItem-ellipsis": {
                      color: "text.main",
                    },
                  }}
                />
              </MDBox>
            )}
          </>
        )}
      </MDBox>

      {!newsState.loading && newsState.news.length > 0 && (
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
            Showing {paginationData.indexOfFirstArticle + 1}-
            {Math.min(paginationData.indexOfLastArticle, newsState.news.length)} of{" "}
            {newsState.news.length} articles
          </MDTypography>
        </MDBox>
      )}
    </Card>
  );
}

export default NewsSection;
