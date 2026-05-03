import axios from "axios";
import log from "./app-color-log.js";

const baseURL = "http://e.erovoice.us/feeds/posts/default?alt=json";
const pageSize = 20;

/**
 * 从API响应中提取条目数据
 * Extract entry data from API response
 * @param {Object} feedData - The feed data from API response
 * @returns {Array<Object>} Array of parsed entries with relevant fields
 */
export function parseEntries(feedData) {
  if (!feedData.feed || !feedData.feed.entry) {
    return [];
  }

  return feedData.feed.entry.map((entry) => ({
    id: entry.id?.$t || null,
    published: entry.published?.$t || null,
    updated: entry.updated?.$t || null,
    title: entry.title?.$t || null,
    content: parseEntryContent(entry.content?.$t || null),
    categories: entry.category?.map((cat) => cat.term) || [],
    thumbnail: entry.media$thumbnail?.url || null,
    links: entry.link?.map((link) => ({
      rel: link.rel,
      type: link.type,
      href: link.href,
      title: link.title,
    })) || [],
  }));
}

/**
 * !!!! This Function is not being used. There is a copy in the frontend renderer.js
 * 把entry.content.$t中的HTML内容解析并提取出相关的元数据（如图片、Circle、Release日期、声优、文件大小、下载链接、DLsite商品ID和链接等）
 * Parse entry content HTML and extract metadata
 * @param {string} contentHtml - The HTML content from entry.content.$t
 * @returns {Object} Extracted metadata with image, circle, release, voice actor, file size, download links, product ID, and product link
 */
export function parseEntryContent(contentHtml) {
  const metadata = {
    image: null,
    circle: null,
    release: null,
    voiceActor: null,
    fileSize: null,
    downloadLinks: [],
    productId: null,
    productLink: null,
    source: null,
  };

  if (!contentHtml) return metadata;

  // Image
  const imgMatch = contentHtml.match(
    /src="(https:\/\/[^"]*\.(?:jpg|jpeg|png|gif|webp|svg))/i
  );
  if (imgMatch) metadata.image = imgMatch[1];

  // Circle
  const circleMatch = contentHtml.match(/Circle\s*:\s*([^<&]+)/);
  if (circleMatch) {
    metadata.circle = circleMatch[1].trim().replace(/&nbsp;/g, "");
  }

  // Release
  const releaseMatch = contentHtml.match(/Release\s*:\s*([^<]+)/);
  if (releaseMatch) metadata.release = releaseMatch[1].trim();

  // Voice Actor
  const voiceActorMatch = contentHtml.match(/Voice Actor\s*:\s*([^<]+)/);
  if (voiceActorMatch) {
    metadata.voiceActor = voiceActorMatch[1].trim().replace(/&nbsp;/g, "");
  }

  // File Size
  const fileSizeMatch = contentHtml.match(/File Size\s*:\s*([^<]+)/);
  if (fileSizeMatch) metadata.fileSize = fileSizeMatch[1].trim();

  // Download links
  const downloadRows = contentHtml.match(/<div>.*?<\/div>/g) || [];

  downloadRows.forEach((row) => {
    const links = [...row.matchAll(/<a\s+href="([^"]+)">([^<]+)<\/a>/g)];
    if (!links.length) return;

    // Multipart format
    const providerMatch = row.match(/^<div>([^|<]+)\s*\|/);

    if (providerMatch) {
      const provider = providerMatch[1].trim();

      links.forEach((match) => {
        const href = match[1];
        const label = match[2].trim();

        if (href.includes("ouo.io")) {
          const partMatch = label.match(/Part\s*(\d+)/i);

          metadata.downloadLinks.push({
            typename: partMatch
              ? `${provider}_Part${partMatch[1]}`
              : provider,
            link: href,
          });
        }
      });

      return;
    }

    // Single provider links
    links.forEach((match) => {
      const href = match[1];
      const provider = match[2].trim();

      if (href.includes("ouo.io")) {
        metadata.downloadLinks.push({
          typename: provider,
          link: href,
        });
      }
    });
  });

  // DLsite
  const dlsiteMatch = contentHtml.match(
    /(https:\/\/www\.dlsite\.com\/[^"]*product_id\/(RJ\d+)\.html)/
  );

  if (dlsiteMatch) {
    metadata.productLink = dlsiteMatch[1];
    metadata.productId = dlsiteMatch[2];
    metadata.source = "dlsite";
  }

  // DMM
  const dmmMatch = contentHtml.match(
    /(https:\/\/www\.dmm\.co\.jp\/[^"]*cid=([a-zA-Z0-9_]+)\/?)/
  );

  if (dmmMatch) {
    metadata.productLink = dmmMatch[1];
    metadata.productId = dmmMatch[2];
    metadata.source = "dmm";
  }

  return metadata;
}

/**
 * items的总数是通过API响应中的openSearch$totalResults字段提供的 （可供pagination使用）
 * Get total results count from API response
 * @param {Object} feedData - The feed data from API response
 * @returns {number} Total results available
 */
export function getTotalResults(feedData) {
  return feedData.feed?.openSearch$totalResults?.$t || 0;
}

/**
 * 此data的startIndex （可供pagination使用）
 * Get current start index from API response
 * @param {Object} feedData - The feed data from API response
 * @returns {number} Current start index
 */
export function getStartIndex(feedData) {
  return feedData.feed?.openSearch$startIndex?.$t || 1;
}

/**
 * 此data的itemsPerPage （可供pagination使用）
 * Get items per page from API response
 * @param {Object} feedData - The feed data from API response
 * @returns {number} Items per page
 */
export function getItemsPerPage(feedData) {
  return feedData.feed?.openSearch$itemsPerPage?.$t || pageSize;
}

/**
 * 直接从基础feed中获取存在的category/tag（可供过滤器使用）
 * Get category term strings from the base feed
 * @returns {Array<string>} Array of category term strings
 */
export async function getCategoryTerms() {
    
    function extractCategoryTerms(feedData) {
        if (!feedData.feed || !feedData.feed.category) {
            return [];
        }
        return feedData.feed.category.map((cat) => cat.term);
    }
    
    try {
        const response = await axios.get(baseURL);
        return extractCategoryTerms(response.data);
    } catch (error) {
        console.error("Error fetching category terms:", error);
        return [];
    }
}

/**
 * 多样化搜索
 * Combined filter search with optional parameters
 * @param {Object} filters - Filter options object
 * @param {string} filters.query - Search query (e.g., RJ01298014)
 * @param {string} filters.tag - Tag/category name (e.g., "Ear Licking")
 * @param {string} filters.publishedMin - Start date (ISO format with timezone)
 * @param {string} filters.publishedMax - End date (ISO format with timezone)
 * @param {number} filters.maxResults - Maximum results to return (default: 20)
 * @param {number} filters.startIndex - Starting index for pagination (default: 1)
 * @returns {Promise<Object>} API response with entries
 * 
 * @example
 * // Search with query and date range
 * const results = await combinedSearch({
 *   query: 'RJ01298014',
 *   publishedMin: '2026-04-29T00:00:00%2B08:00',
 *   publishedMax: '2026-04-30T23:59:59%2B08:00',
 *   maxResults: 50
 * });
 *
 * @example
 * // Search by tag with pagination
 * const results = await combinedSearch({
 *   tag: 'Ear Licking',
 *   maxResults: 30,
 *   startIndex: 1
 * });
 */
export async function combinedSearch(filters = {}) {
  try {
    let url = baseURL;
    const {
      query,
      tag,
      publishedMin,
      publishedMax,
      maxResults = pageSize,
      startIndex = 1,
    } = filters;

    // If tag is specified, use the tag endpoint instead of default
    if (tag) {
      url = `http://e.erovoice.us/feeds/posts/default/-/${encodeURIComponent(tag)}?alt=json`;
    }

    // Build query parameters
    const params = new URLSearchParams();

    if (query && !tag) {
      params.append("q", query);
    }

    if (publishedMin) {
      params.append("published-min", publishedMin);
    }

    if (publishedMax) {
      params.append("published-max", publishedMax);
    }

    params.append("max-results", maxResults);
    params.append("start-index", startIndex);

    // Construct final URL
    const finalUrl = `${url}${url.includes("?") ? "&" : "?"}${params.toString()}`;

    const response = await axios.get(finalUrl);
    return response.data;
  } catch (error) {
    console.error("Error in combined search:", error);
    throw error;
  }
}

/**
 * Build a human-readable filter description
 * @param {Object} filters - Filter options object (same structure as combinedSearch)
 * @returns {string} Human-readable description of applied filters
 */
export function getFilterDescription(filters = {}) {
  const descriptions = [];

  if (filters.query) {
    descriptions.push(`Query: "${filters.query}"`);
  }

  if (filters.tag) {
    descriptions.push(`Tag: "${filters.tag}"`);
  }

  if (filters.publishedMin || filters.publishedMax) {
    if (filters.publishedMin && filters.publishedMax) {
      descriptions.push(`Date Range: ${filters.publishedMin} to ${filters.publishedMax}`);
    } else if (filters.publishedMin) {
      descriptions.push(`From: ${filters.publishedMin}`);
    } else {
      descriptions.push(`Until: ${filters.publishedMax}`);
    }
  }

  descriptions.push(`Max Results: ${filters.maxResults || pageSize}`);
  descriptions.push(`Start Index: ${filters.startIndex || 1}`);

  return descriptions.join(" | ");
}