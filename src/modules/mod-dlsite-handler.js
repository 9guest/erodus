import axios from "axios";

const baseURL = "https://dls-worker.ycstation.workers.dev/";
const prettyEndpoint = "pretty";

function normalizeProductId(productId) {
  const value = String(productId || "").trim();

  if (!value) {
    return "";
  }

  const match = value.match(/^([rv]j\d{8})$/i);
  if (match) {
    return match[1].toUpperCase();
  }

  return value.toUpperCase();
}

/**
 * Fetch product information by DLSite product ID
 * @param {string} productId - DLSite product ID (e.g., RJ01546453)
 * @returns {Promise<Object>} Prettified product data
 * 
 * @example
 * const product = await getProductInfo('RJ01546453');
 * console.log(product.product_name, product.product_price);
 */
export async function getProductInfo(productId) {
  const normalizedProductId = normalizeProductId(productId);

  if (!normalizedProductId) {
    throw new Error("productId is required");
  }

  try {
    const url = `${baseURL}${prettyEndpoint}/${encodeURIComponent(normalizedProductId)}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product info for ${normalizedProductId}:`, error);
    throw error;
  }
}

/**
 * Fetch multiple products information
 * @param {Array<string>} productIds - Array of DLSite product IDs
 * @returns {Promise<Array<Object>>} Array of prettified product data
 * 
 * @example
 * const products = await getProductsInfo(['RJ01546453', 'RJ01609739']);
 */
export async function getProductsInfo(productIds = []) {
  try {
    const requests = productIds.map((id) => getProductInfo(id));
    return await Promise.all(requests);
  } catch (error) {
    console.error("Error fetching multiple products:", error);
    throw error;
  }
}

/**
 * Extract key metadata from product data
 * @param {Object} productData - Product data from API
 * @returns {Object} Simplified product metadata
 */
export function extractProductMetadata(productData) {
  if (!productData) {
    return null;
  }

  return {
    productId: productData.product_id || null,
    productName: productData.product_name || null,
    productIntro: productData.product_intro || null,
    ageCategory: productData.age_category || null,
    price: productData.product_price || null,
    officialPrice: productData.product_official_price || null,
    mainImage: productData.product_image?.url || null,
    sampleImages: productData.product_image_samples?.map((img) => img.url) || [],
    makerName: productData.maker_name || null,
    makerId: productData.maker_id || null,
    circleId: productData.circle_id || null,
    voiceActors: productData.voice_by || [],
    genres: productData.genres || [],
    createdBy: productData.created_by || [],
    scenarioBy: productData.scenario_by || [],
    illustBy: productData.illust_by || [],
    createdDate: productData.regist_date || null,
    updatedDate: productData.update_date || null,
  };
}

/**
 * Get all image URLs (main + samples)
 * @param {Object} productData - Product data from API
 * @returns {Array<string>} Array of all image URLs
 */
export function getAllProductImages(productData) {
  if (!productData) {
    return [];
  }

  const images = [];
  
  if (productData.product_image?.url) {
    images.push(productData.product_image.url);
  }

  if (productData.product_image_samples && Array.isArray(productData.product_image_samples)) {
    images.push(...productData.product_image_samples.map((img) => img.url));
  }

  return images;
}

