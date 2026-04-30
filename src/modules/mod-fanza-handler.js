import axios from "axios";

const baseURL = "https://dls-worker.ycstation.workers.dev";
const prettyEndpoint = "dmm";

function normalizeCid(cid) {
	const value = String(cid || "").trim();

	if (!value) {
		return "";
	}

	if (value.startsWith("d_")) {
		return value;
	}

	return `d_${value}`;
}

/**
 * Fetch prettified FANZA/DMM product data by cid
 * @param {string} cid - DMM cid (e.g., d_734035)
 * @returns {Promise<Object>} Prettified product data
 *
 * @example
 * const product = await getFanzaInfo('d_734035');
 */
export async function getFanzaInfo(cid) {
	const normalizedCid = normalizeCid(cid);

	if (!normalizedCid) {
		throw new Error("cid is required");
	}

	try {
		const url = `${baseURL}/${prettyEndpoint}/${normalizedCid}`;
		const response = await axios.get(url);
		return response.data;
	} catch (error) {
		console.error(`Error fetching FANZA info for ${normalizedCid}:`, error);
		throw error;
	}
}

/**
 * Fetch multiple FANZA/DMM products in parallel
 * @param {Array<string>} cids - Array of cids
 * @returns {Promise<Array<Object>>} Array of prettified product data
 */
export async function getFanzaInfos(cids = []) {
	try {
		const requests = cids.map((cid) => getFanzaInfo(cid));
		return await Promise.all(requests);
	} catch (error) {
		console.error("Error fetching multiple FANZA entries:", error);
		throw error;
	}
}

/**
 * Extract simplified metadata from the FANZA/DMM API response
 * @param {Object} productData - Data returned by the pretty endpoint
 * @returns {Object} Simplified product metadata
 */
export function extractFanzaMetadata(productData) {
	if (!productData) {
		return null;
	}

	return {
		cid: productData.cid || null,
		title: productData.title || null,
		releaseDate: productData.release_date || null,
		workFormat: productData.work_format || null,
		subject: productData.subject || null,
		voiceActors: productData.voice_actor || [],
		genreTags: productData.genre_tag || [],
		filesize: productData.filesize || null,
		image: productData.image || null,
		description: productData.description || null,
		url: productData.url || null,
		ageGateDetected: Boolean(productData.debug_age_gate_detected),
		debugTitleBeforeRetry: productData.debug_title_before_retry || null,
	};
}

