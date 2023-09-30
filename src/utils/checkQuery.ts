import { RouteLocationNormalizedLoaded } from "vue-router";

export function isHasQuery(route: RouteLocationNormalizedLoaded): {
  hasQuery: boolean;
  query: string;
} {
  if (!!route.query) {
    const fullPath = route.fullPath;
    const index = fullPath.indexOf("?");

    if (index > -1) {
      return {
        hasQuery: true,
        query: fullPath.substring(index + 1),
      };
    } else {
      return {
        hasQuery: false,
        query: "",
      };
    }
  } else {
    return {
      hasQuery: false,
      query: "",
    };
  }
}
