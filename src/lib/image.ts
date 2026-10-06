const BASE_URL = import.meta.env.BASE_URL;

const ABSOLUTE_URL_PATTERN = /^(?:[a-z]+:)?\/\//i;

export function resolveImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    return "";
  }

  if (
    ABSOLUTE_URL_PATTERN.test(imageUrl) ||
    imageUrl.startsWith("data:") ||
    imageUrl.startsWith("blob:")
  ) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `${BASE_URL.replace(/\/$/, "")}${imageUrl}`;
  }

  return imageUrl;
}
