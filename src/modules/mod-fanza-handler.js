import axios from "axios";

function normalizeCid(cid) {
	const value = String(cid || "").trim().toLowerCase();

	if (!value) {
		return "";
	}

	if (value.startsWith("d_")) {
		return value;
	}

	return `d_${value}`;
}

const decodeHtml = (str = "") =>
	str
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">");

const stripTags = (str = "") =>
	decodeHtml(str.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());

const firstMatch = (patterns, source) => {
	for (const p of patterns) {
		const m = source.match(p);
		if (m && m[1]) return decodeHtml(m[1].trim());
	}
	return null;
};

const getMetaFrom = (name, source) => {
	const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return firstMatch([
		new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i"),
		new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${escaped}["']`, "i"),
		new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i"),
		new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${escaped}["']`, "i")
	], source);
};

/**
 * Fetch prettified FANZA/DMM product data by cid locally
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

	const targetUrl = `https://www.dmm.co.jp/dc/doujin/-/detail/=/cid=${normalizedCid}/`;

	try {
		const commonHeaders = {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
			"Accept-Language": "ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7"
		};

		const fetchHtml = async (cookie = "age_check_done=1; ckcy=1;") => {
			const res = await axios.get(targetUrl, {
				headers: {
					...commonHeaders,
					...(cookie ? { Cookie: cookie } : {})
				},
				timeout: 10000
			});
			return typeof res.data === "string" ? res.data : String(res.data);
		};

		let html = await fetchHtml();

		const titleBeforeRetry =
			getMetaFrom("og:title", html) ||
			firstMatch([/<title>([\s\S]*?)<\/title>/i], html);

		const isAgeGate =
			/年齢認証/.test(titleBeforeRetry || "") ||
			/18歳未満/.test(html) ||
			/アダルト商品/.test(html);

		if (isAgeGate) {
			html = await fetchHtml("age_check_done=1; ckcy=1;");
		}

		const getMeta = (name) => getMetaFrom(name, html);

		const getLabeledValue = (labels) => {
			for (const label of labels) {
				const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

				const patterns = [
					new RegExp(`<dt[^>]*>\\s*${escaped}\\s*<\\/dt>[\\s\\S]{0,80}?<dd[^>]*>([\\s\\S]{0,600}?)<\\/dd>`, "i"),
					new RegExp(`<th[^>]*>\\s*${escaped}\\s*<\\/th>[\\s\\S]{0,80}?<td[^>]*>([\\s\\S]{0,600}?)<\\/td>`, "i"),
					new RegExp(`${escaped}[\\s\\S]{0,80}?<a[^>]*>([\\s\\S]{1,200}?)<\\/a>`, "i")
				];

				for (const p of patterns) {
					const m = html.match(p);
					if (m && m[1]) return stripTags(m[1]);
				}
			}
			return null;
		};

		const getLabeledList = (labels) => {
			for (const label of labels) {
				const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

				const blockPatterns = [
					new RegExp(`<dt[^>]*>\\s*${escaped}\\s*<\\/dt>[\\s\\S]{0,100}?<dd[^>]*>([\\s\\S]{0,3000}?)<\\/dd>`, "i"),
					new RegExp(`<th[^>]*>\\s*${escaped}\\s*<\\/th>[\\s\\S]{0,100}?<td[^>]*>([\\s\\S]{0,3000}?)<\\/td>`, "i")
				];

				for (const p of blockPatterns) {
					const m = html.match(p);
					if (m && m[1]) {
						const block = m[1];

						const genreTagAnchors = [...block.matchAll(/<a[^>]*class=["'][^"']*genreTag__txt[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi)]
							.map((x) => stripTags(x[1]))
							.map((x) => x.trim())
							.filter(Boolean);

						if (genreTagAnchors.length) return [...new Set(genreTagAnchors)];

						const anchors = [...block.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi)]
							.map((x) => stripTags(x[1]))
							.map((x) => x.trim())
							.filter(Boolean);

						if (anchors.length) return [...new Set(anchors)];

						return stripTags(block)
							.split(/、|,|\/|\||\n/)
							.map((s) => s.trim())
							.filter(Boolean);
					}
				}
			}
			return [];
		};

		const getProductDescription = () => {
			const summaryBlockMatch = html.match(/<div[^>]*class=["'][^"']*m-productSummary[^"']*["'][^>]*>([\s\S]{0,20000}?)<\/div>[\s\S]{0,200}?<\/div>/i);
			
			if (summaryBlockMatch && summaryBlockMatch[1]) {
				const summaryTextMatch = summaryBlockMatch[1].match(/<p[^>]*class=["'][^"']*summary__txt[^"']*["'][^>]*>([\s\S]+?)<\/p>/i);
				
				if (summaryTextMatch && summaryTextMatch[1]) {
					return summaryTextMatch[1]
						.replace(/<br\s*\/?>/gi, '\n')
						.replace(/<script[\s\S]*?<\/script>/gi, '')
						.replace(/<style[\s\S]*?<\/style>/gi, '')
						.replace(/<[^>]+>/g, '')
						.replace(/&quot;/g, '"')
						.replace(/&#39;/g, "'")
						.replace(/&amp;/g, "&")
						.replace(/&lt;/g, "<")
						.replace(/&gt;/g, ">")
						.replace(/\n{3,}/g, '\n\n')
						.trim();
				}
			}
			
			return getMeta("og:description") || 
				getMeta("twitter:description") || 
				getMeta("description");
		};

		const title =
			getMeta("og:title") ||
			getMeta("twitter:title") ||
			firstMatch([/<title>([\s\S]*?)<\/title>/i], html);

		const image =
			getMeta("og:image") ||
			getMeta("twitter:image");

		const getPrice = () => {
			const priceMainMatch = html.match(/<p[^>]*class=["'][^"']*priceList__main[^"']*["'][^>]*>([\s\S]{0,150}?)<\/p>/i);
			
			if (priceMainMatch && priceMainMatch[1]) {
				const priceText = priceMainMatch[1]
					.replace(/<span[\s\S]*?<\/span>/gi, '')
					.replace(/<[^>]+>/g, '')
					.replace(/&nbsp;/g, '')
					.trim();
				
				return priceText;
			}
			
			const labeledPrice = getLabeledValue(["価格", "販売価格", "通常価格", "サークル設定価格"]);
			if (labeledPrice) return labeledPrice;
			
			const pricePatterns = [
				/<span[^>]*class=["'][^"']*price[^"']*["'][^>]*>([\s\S]{0,100}?)<\/span>/i,
				/<div[^>]*class=["'][^"']*price[^"']*["'][^>]*>([\s\S]{0,100}?)<\/div>/i
			];
			
			for (const p of pricePatterns) {
				const m = html.match(p);
				if (m && m[1]) return stripTags(m[1]);
			}
			
			return null;
		};

		const releaseDate = getLabeledValue(["配信開始日", "販売日", "発売日"]);
		const workFormat = getLabeledValue(["作品形式"]);
		const subject = getLabeledValue(["題材"]);
		const voiceActors = getLabeledList(["声優"]);
		const genreTags = getLabeledList(["ジャンル", "題材", "タグ"]);
		const fileSize = getLabeledValue(["ファイル容量", "容量"]);
		const productTitle = title?.replace(/\s*[-｜|].*$/, "").trim() || null;

		// If redirected to login page or failed to extract title, it indicates a regional restriction / not found
		if (!productTitle || html.includes("accounts.dmm.co.jp/service/login")) {
			throw new Error(`Failed to fetch FANZA details for ${normalizedCid}. DMM redirected to login page (Japan regional restriction). A Japan VPN or proxy is required for direct local access.`);
		}

		return {
			cid: normalizedCid,
			title: productTitle,
			release_date: releaseDate || null,
			work_format: workFormat || null,
			subject: subject || null,
			voice_actor: voiceActors,
			genre_tag: genreTags,
			price: getPrice(),
			filesize: fileSize || null,
			image: image?.startsWith("//") ? `https:${image}` : image || null,
			description: getProductDescription(),
			url: targetUrl,
			debug_title_before_retry: titleBeforeRetry || null,
			debug_age_gate_detected: isAgeGate
		};
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

