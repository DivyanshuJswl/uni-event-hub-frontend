/**
 * Styled root component for MDPagination items
 * @module components/MDPagination/MDPaginationItemRoot
 */

import { styled } from "@mui/material/styles";
import MDButton from "components/MDButton";

// Size configuration map
const PAGINATION_SIZE_MAP = {
  small: 30,
  medium: 36,
  large: 46,
};

const MDPaginationItemRoot = styled(MDButton)(({ theme, ownerState }) => {
  const { borders, functions, typography, palette } = theme;
  const { variant, paginationSize, active } = ownerState;

  const { borderColor } = borders;
  const { pxToRem } = functions;
  const { fontWeightRegular, size: fontSize } = typography;
  const { light } = palette;

  // Get size value from map
  const sizeConfig = PAGINATION_SIZE_MAP[paginationSize] || PAGINATION_SIZE_MAP.medium;
  const sizeValue = pxToRem(sizeConfig);

  return {
    borderColor,
    margin: `0 ${pxToRem(2)}`,
    pointerEvents: active ? "none" : "auto",
    fontWeight: fontWeightRegular,
    fontSize: fontSize.sm,
    width: sizeValue,
    minWidth: sizeValue,
    height: sizeValue,
    minHeight: sizeValue,

    "&:hover, &:focus, &:active": {
      transform: "none",
      boxShadow: variant !== "gradient" && variant !== "contained" ? "none !important" : undefined,
      opacity: "1 !important",
    },

    "&:hover": {
      backgroundColor: light.main,
      borderColor,
    },
  };
});

MDPaginationItemRoot.displayName = "MDPaginationItemRoot";

export default MDPaginationItemRoot;
