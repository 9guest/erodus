import axios from "axios";

const DL_SITE_API_BASE = "https://www.dlsite.com/maniax/api/=/product.json";

function normalizeProductId(productId) {
  const value = String(productId || "").trim();

  if (!value) {
    return "";
  }

  const match = value.match(/^([rv]j\d{6,8})$/i);
  if (match) {
    return match[1].toUpperCase();
  }

  return value.toUpperCase();
}

/**
 * Fetch raw product information directly from DLsite API
 * @param {string} productId - DLsite product ID (e.g., RJ01546453)
 * @returns {Promise<Array<Object>>} Raw DLsite API data array
 */
export async function getFullProductInfo(productId) {
  const normalizedProductId = normalizeProductId(productId);

  if (!normalizedProductId) {
    throw new Error("productId is required");
  }

  try {
    const url = `${DL_SITE_API_BASE}?workno=${encodeURIComponent(normalizedProductId)}`;
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7"
      },
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching raw product info for ${normalizedProductId}:`, error);
    throw error;
  }
}

/**
 * Fetch and prettify product information by DLSite product ID locally
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
    const data = await getFullProductInfo(normalizedProductId);

    if (Array.isArray(data) && data.length > 0) {
      const thisData = data[0];
      const createdBy = thisData.creaters?.created_by?.map((c) => c.name) || [];
      const scenarioBy = thisData.creaters?.scenario_by?.map((c) => c.name) || [];
      const illustBy = thisData.creaters?.illust_by?.map((c) => c.name) || [];
      const voiceBy = thisData.creaters?.voice_by?.map((c) => c.name) || [];
      const genres = thisData.genres?.map((g) => g.name) || [];

      const mainImageUrl = thisData.image_main?.url || "";
      const productImage = {
        file_name: thisData.image_main?.file_name || null,
        url: mainImageUrl ? (mainImageUrl.startsWith("//") ? `https:${mainImageUrl}` : mainImageUrl) : null
      };

      const imageSamples = (thisData.image_samples || []).map(({ file_name, url }) => ({
        file_name: file_name || null,
        url: url ? (url.startsWith("//") ? `https:${url}` : url) : ""
      }));

      const fileSize = thisData.contents && thisData.contents[0]
        ? thisData.contents[0].file_size_unit
        : (thisData.file_size || null);

      return {
        age_category: thisData.age_category_string || null,
        product_id: thisData.workno || normalizedProductId,
        product_name: thisData.product_name || null,
        product_alt_name: thisData.alt_name || null,
        product_intro: thisData.intro_s || null,
        product_image: productImage,
        product_image_samples: imageSamples,
        product_price: thisData.price ?? null,
        product_official_price: thisData.official_price ?? null,
        circle_id: thisData.circle_id || null,
        maker_id: thisData.maker_id || null,
        maker_name: thisData.maker_name || null,
        created_by: createdBy,
        scenario_by: scenarioBy,
        illust_by: illustBy,
        voice_by: voiceBy,
        genres,
        update_date: thisData.update_date || null,
        regist_date: thisData.regist_date || null,
        file_size: fileSize,
        url: `https://www.dlsite.com/maniax/work/=/product_id/${thisData.workno || normalizedProductId}.html`
      };
    } else {
      throw new Error(`Product not found for ${normalizedProductId}`);
    }
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

