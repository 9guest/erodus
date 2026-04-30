/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

const themeStorageKey = "erodus-theme";
const customThemeStorageKey = "erodus-custom-theme";

const defaultThemes = {
	dark: {
		name: "Dark",
		colors: {
			bg: "#0a0d14",
			bgAccent: "#111827",
			surface: "rgba(17, 24, 39, 0.92)",
			surfaceStrong: "#182033",
			text: "#ecf2ff",
			muted: "#9aa8c3",
			border: "rgba(154, 168, 195, 0.18)",
			accent: "#65d6c2",
			accentStrong: "#3bb7a2",
		},
	},
	light: {
		name: "Light",
		colors: {
			bg: "#f3f5f8",
			bgAccent: "#e6ebf4",
			surface: "rgba(255, 255, 255, 0.92)",
			surfaceStrong: "#ffffff",
			text: "#111827",
			muted: "#667085",
			border: "rgba(15, 23, 42, 0.12)",
			accent: "#0f8f7f",
			accentStrong: "#0b7669",
		},
	},
};

const state = {
	page: "feed",
	feedEntries: [],
	selectedFeedEntry: null,
	selectedProduct: null,
	categories: [],
	themeName: "dark",
};

const $ = (selector) => document.querySelector(selector);

const elements = {
	navItems: Array.from(document.querySelectorAll(".nav-item")),
	pageViews: Array.from(document.querySelectorAll(".page-view")),
	pageTitle: $("#page-title"),
	pageEyebrow: $("#page-eyebrow"),
	pageDescription: $("#page-description"),
	headerActions: $("#header-actions"),
	feedResults: $("#feed-results"),
	feedStatus: $("#feed-status"),
	feedFilterForm: $("#feed-filter-form"),
	feedQuery: $("#feed-query"),
	feedTag: $("#feed-tag"),
	feedCategoryList: $("#feed-category-list"),
	feedPublishedMin: $("#feed-published-min"),
	feedPublishedMax: $("#feed-published-max"),
	feedMaxResults: $("#feed-max-results"),
	feedStartIndex: $("#feed-start-index"),
	refreshFeedBtn: $("#refresh-feed-btn"),
	clearFeedBtn: $("#clear-feed-btn"),
	detailsSource: $("#details-source"),
	detailsContent: $("#details-content"),
	detailsModalOverlay: $("#details-modal-overlay"),
	detailsModal: $("#details-modal"),
	detailsModalCloseBtn: $("#details-modal-close-btn"),
	detailsModalSource: $("#details-modal-source"),
	detailsModalContent: $("#details-modal-content"),
	productSearchForm: $("#product-search-form"),
	productSearchInput: $("#product-search-input"),
	productStatus: $("#product-status"),
	productResult: $("#product-result"),
	themeButtons: Array.from(document.querySelectorAll(".theme-button")),
	themeJson: $("#theme-json"),
	applyThemeJson: $("#apply-theme-json"),
	importThemeBtn: $("#import-theme-btn"),
	themeJsonFile: $("#theme-json-file"),
	resetThemeBtn: $("#reset-theme-btn"),
	floatingFilterBtn: $("#floating-filter-btn"),
	filterModalOverlay: $("#filter-modal-overlay"),
	filterModal: $("#filter-modal"),
	modalCloseBtn: $("#modal-close-btn"),
	feedFilterFormModal: $("#feed-filter-form-modal"),
	feedQueryModal: $("#feed-query-modal"),
	feedTagModal: $("#feed-tag-modal"),
	feedCategoryListModal: $("#feed-category-list-modal"),
	feedPublishedMinModal: $("#feed-published-min-modal"),
	feedPublishedMaxModal: $("#feed-published-max-modal"),
	feedMaxResultsModal: $("#feed-max-results-modal"),
	feedStartIndexModal: $("#feed-start-index-modal"),
	clearFeedBtnModal: $("#clear-feed-btn-modal"),
	refreshFeedBtnModal: $("#refresh-feed-btn-modal"),
	feedLoadMoreContainer: $("#feed-load-more"),
	feedLoadMoreBtn: $("#feed-load-more-btn"),
};

function isNarrowViewport() {
	return window.matchMedia("(max-width: 1200px)").matches;
}

function openDetailsModal() {
	if (!elements.detailsModalOverlay || !elements.detailsModal) return;
	elements.detailsModalOverlay.style.display = "block";
	elements.detailsModal.style.display = "block";
	requestAnimationFrame(() => {
		elements.detailsModal.classList.add("is-open");
	});
}

function closeDetailsModal() {
	if (!elements.detailsModalOverlay || !elements.detailsModal) return;
	elements.detailsModal.classList.remove("is-open");
	elements.detailsModalOverlay.style.display = "none";
	elements.detailsModal.style.display = "none";
}

function buildDetailsMarkup(entry) {
	if (!entry) {
		return '<p class="empty-state">Select a feed item or product to inspect the metadata here.</p>';
	}

	return `
		<div class="detail-group">
			<h3>${safeText(entry.title)}</h3>
			<p class="detail-list">Published: ${formatDateDisplay(entry.published)}</p>
			<p class="detail-list">Updated: ${formatDateDisplay(entry.updated)}</p>
			<div class="chip-row">${(entry.categories || []).map((category) => `<span class="chip">${category}</span>`).join("")}</div>
		</div>
		${entry.content?.image ? `<img class="details-image" src="${entry.content.image}" alt="${safeText(entry.title)}">` : ""}
		<div class="detail-group">
			<div class="detail-label">Circle</div>
			<div>${safeText(entry.content?.circle)}</div>
			<div class="detail-label" style="margin-top: .75rem;">Release</div>
			<div>${safeText(entry.content?.release)}</div>
			<div class="detail-label" style="margin-top: .75rem;">Voice Actor</div>
			<div>${safeText(entry.content?.voiceActor)}</div>
			<div class="detail-label" style="margin-top: .75rem;">File Size</div>
			<div>${safeText(entry.content?.fileSize)}</div>
		</div>
		<div class="detail-group">
			<div class="detail-label">Download Links</div>
			<div class="detail-list">${(entry.content?.downloadLinks || []).map((link) => `<div><a class="inline-link" href="#" data-open-link="${link.link}">${link.typename}</a></div>`).join("") || "—"}</div>
		</div>
		<div class="detail-group">
			<div class="detail-label">Product</div>
			<div class="detail-list">${safeText(entry.content?.productId)}</div>
			<div class="detail-list">${safeText(entry.content?.productLink)}</div>
		</div>
	`;
}

function syncDetailsMarkup(entry, sourceLabel) {
	const markup = buildDetailsMarkup(entry);
	if (elements.detailsSource) {
		elements.detailsSource.textContent = sourceLabel || "Nothing selected";
	}
	if (elements.detailsContent) {
		elements.detailsContent.innerHTML = markup;
	}
	if (elements.detailsModalSource) {
		elements.detailsModalSource.textContent = sourceLabel || "Nothing selected";
	}
	if (elements.detailsModalContent) {
		elements.detailsModalContent.innerHTML = markup;
	}
	if (entry) {
		const containers = [elements.detailsContent, elements.detailsModalContent].filter(Boolean);
		containers.forEach((container) => {
			container.querySelectorAll("[data-open-link]").forEach((link) => {
				link.addEventListener("click", async (event) => {
					event.preventDefault();
					await window.erodusAPI.openExternalLink(link.dataset.openLink);
				});
			});
		});
	}
}

function safeText(value) {
	return value == null || value === "" ? "—" : String(value);
}

function formatDateTimeLocal(value) {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	const pad = (n) => String(n).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDateDisplay(value) {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat(undefined, {
		year: "numeric",
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	}).format(date);
}

function setThemeVars(theme) {
	const root = document.documentElement;
	const colors = theme.colors || {};
	root.dataset.theme = theme.name?.toLowerCase() === "light" ? "light" : "dark";
	root.style.setProperty("--bg", colors.bg || defaultThemes.dark.colors.bg);
	root.style.setProperty("--bg-accent", colors.bgAccent || defaultThemes.dark.colors.bgAccent);
	root.style.setProperty("--surface", colors.surface || defaultThemes.dark.colors.surface);
	root.style.setProperty("--surface-strong", colors.surfaceStrong || defaultThemes.dark.colors.surfaceStrong);
	root.style.setProperty("--text", colors.text || defaultThemes.dark.colors.text);
	root.style.setProperty("--muted", colors.muted || defaultThemes.dark.colors.muted);
	root.style.setProperty("--border", colors.border || defaultThemes.dark.colors.border);
	root.style.setProperty("--accent", colors.accent || defaultThemes.dark.colors.accent);
	root.style.setProperty("--accent-strong", colors.accentStrong || defaultThemes.dark.colors.accentStrong);
}

function saveTheme(themeName, customTheme = null) {
	localStorage.setItem(themeStorageKey, themeName);
	if (customTheme) {
		localStorage.setItem(customThemeStorageKey, JSON.stringify(customTheme));
	}
}

function loadStoredTheme() {
	const savedTheme = localStorage.getItem(themeStorageKey) || "dark";
	const savedCustom = localStorage.getItem(customThemeStorageKey);
	if (savedCustom) {
		try {
			return { themeName: savedTheme, customTheme: JSON.parse(savedCustom) };
		} catch {
			return { themeName: savedTheme, customTheme: null };
		}
	}
	return { themeName: savedTheme, customTheme: null };
}

function applyTheme(themeName, customTheme = null) {
	let theme = defaultThemes[themeName] || defaultThemes.dark;

	if (themeName === "custom" && customTheme?.colors) {
		theme = customTheme;
	}

	setThemeVars(theme);
	state.themeName = themeName;
	elements.themeButtons.forEach((button) => {
		button.classList.toggle("is-active", button.dataset.themeChoice === themeName);
	});
	if (themeName !== "custom") {
		saveTheme(themeName);
	}
}

function applyCustomThemeFromJson(jsonText) {
	const parsed = JSON.parse(jsonText);
	if (!parsed?.colors) {
		throw new Error("Theme JSON must contain a colors object.");
	}

	applyTheme("custom", parsed);
	saveTheme("custom", parsed);
	return parsed;
}

function setPage(page) {
	state.page = page;
	elements.navItems.forEach((item) => item.classList.toggle("is-active", item.dataset.page === page));
	elements.pageViews.forEach((view) => view.classList.toggle("is-active", view.dataset.pageView === page));

	const config = {
		feed: {
			eyebrow: "Feed Browser",
			title: "Erovoice Feed",
			description: "Browse the feed, filter results, and inspect the selected item in the details panel.",
			actions: '<button class="ghost-button" id="reload-feed-shortcut" type="button">Reload Feed</button>',
		},
		product: {
			eyebrow: "Product Search",
			title: "Search RJ, VJ, or cid",
			description: "Query DLSite or FANZA product endpoints with one field and inspect the returned metadata.",
			actions: '',
		},
		settings: {
			eyebrow: "Settings",
			title: "Theme Preferences",
			description: "Switch between dark and light themes or paste/import a JSON theme config.",
			actions: '',
		},
	}[page];

	elements.pageEyebrow.textContent = config.eyebrow;
	elements.pageTitle.textContent = config.title;
	elements.pageDescription.textContent = config.description;
	elements.headerActions.innerHTML = config.actions;

	const reloadButton = document.getElementById("reload-feed-shortcut");
	if (reloadButton) {
		reloadButton.addEventListener("click", () => loadFeed());
	}
}

function renderFeedResults(entries) {
	if (!entries.length) {
		elements.feedResults.innerHTML = '<p class="empty-state">No entries found.</p>';
		return;
	}

	elements.feedResults.innerHTML = entries.map((entry, index) => {
		const categories = entry.categories || [];
		const image = entry.thumbnail || entry.content?.image;
		return `
			<article class="result-item" data-feed-index="${index}">
				<div class="result-item__title">${safeText(entry.title)}</div>
				<div class="result-item__meta">
					<span>${formatDateDisplay(entry.published)}</span>
					<span>${entry.content?.fileSize ? `File Size: ${safeText(entry.content.fileSize)}` : "No file size"}</span>
				</div>
				${image ? `<img class="details-image" src="${image}" alt="${safeText(entry.title)}">` : ""}
				<div class="chip-row">
					${categories.slice(0, 5).map((category) => `<span class="chip">${category}</span>`).join("")}
				</div>
			</article>
		`;
	}).join("");

	Array.from(elements.feedResults.querySelectorAll("[data-feed-index]")).forEach((item) => {
		item.addEventListener("click", () => {
			const entry = entries[Number(item.dataset.feedIndex)];
			state.selectedFeedEntry = entry;
			loadDetailsFromFeedEntry(entry);
		});
	});
}

function renderDetailsFromFeedEntry(entry) {
	if (!entry) {
		syncDetailsMarkup(null, "Nothing selected");
		return;
	}

	syncDetailsMarkup(entry, "Erovoice feed");
}

function getProductLookupInfo(productId) {
	const normalizedProductId = (productId || "").trim();
	const lowerProductId = normalizedProductId.toLowerCase();

	if (lowerProductId.startsWith("d_")) {
		return {
			sourceLabel: "FANZA / DMM",
			fetcher: window.erodusAPI.getFanzaProductInfo,
			lookupId: normalizedProductId,
		};
	}

	return {
		sourceLabel: "DLSite",
		fetcher: window.erodusAPI.getDlsiteProductInfo,
		lookupId: normalizedProductId,
	};
}

async function loadDetailsFromFeedEntry(entry) {
	if (!entry) {
		syncDetailsMarkup(null, "Nothing selected");
		return;
	}

	const lookupInfo = getProductLookupInfo(entry.content?.productId);

	if (!lookupInfo.lookupId) {
		renderDetailsFromFeedEntry(entry);
		if (isNarrowViewport()) {
			openDetailsModal();
		}
		return;
	}

	if (elements.detailsSource) elements.detailsSource.textContent = `Loading ${lookupInfo.sourceLabel}...`;
	if (elements.detailsModalSource) elements.detailsModalSource.textContent = `Loading ${lookupInfo.sourceLabel}...`;
	if (elements.detailsContent) {
		elements.detailsContent.innerHTML = '<p class="empty-state">Loading product details...</p>';
	}
	if (elements.detailsModalContent) {
		elements.detailsModalContent.innerHTML = '<p class="empty-state">Loading product details...</p>';
	}

	try {
		const productData = await lookupInfo.fetcher(lookupInfo.lookupId);
		renderProductResult(entry, productData, lookupInfo.sourceLabel);
		if (isNarrowViewport()) {
			openDetailsModal();
		}
	} catch (error) {
		const message = `Failed to load product details: ${error.message || error}`;
		if (elements.detailsSource) elements.detailsSource.textContent = lookupInfo.sourceLabel;
		if (elements.detailsModalSource) elements.detailsModalSource.textContent = lookupInfo.sourceLabel;
		if (elements.detailsContent) elements.detailsContent.innerHTML = `<p class="empty-state">${safeText(message)}</p>`;
		if (elements.detailsModalContent) elements.detailsModalContent.innerHTML = `<p class="empty-state">${safeText(message)}</p>`;
		if (isNarrowViewport()) {
			openDetailsModal();
		}
	}
}

function renderProductResult(entry, productData, sourceLabel) {
	if (!productData) {
		elements.productResult.innerHTML = '<p class="empty-state">No product data loaded yet.</p>';
		return;
	}

	state.selectedProduct = productData;
	if (elements.detailsSource) elements.detailsSource.textContent = sourceLabel;
	if (elements.detailsModalSource) elements.detailsModalSource.textContent = sourceLabel;
	elements.productResult.innerHTML = "";

	const summaryRows = [];
	const title = productData.product_name || productData.title || productData.product_title;
	const image = productData.product_image?.url || productData.image;

	if (title) {
		summaryRows.push(`<div class="product-card"><div class="product-title">${safeText(title)}</div></div>`);
	}

	if (image) {
		summaryRows.push(`<img class="product-image" src="${image}" alt="${safeText(title)}">`);
	}

	summaryRows.push(`
		<div class="product-card product-meta">
			<dl>
				<div><dt>ID</dt><dd>${safeText(productData.product_id || productData.cid)}</dd></div>
				<div><dt>Age / Format</dt><dd>${safeText(productData.age_category || productData.work_format)}</dd></div>
				<div><dt>Price</dt><dd>${safeText(productData.product_price || productData.product_official_price || productData.filesize)}</dd></div>
				<div><dt>Maker / Circle</dt><dd>${safeText(productData.maker_name || productData.circle_id || productData.subject)}</dd></div>
			</dl>
		</div>
	`);

	const tags = productData.genres || productData.genre_tag || [];
	const voices = productData.voice_by || productData.voice_actor || [];
	const chips = tags.length ? tags : voices;
	if (chips.length) {
		summaryRows.push(`
			<div class="product-card">
				<div class="chip-row">
					${chips.map((item) => `<span class="chip">${item}</span>`).join("")}
				</div>
			</div>
		`);
	}

	if (productData.url || productData.product_link) {
		summaryRows.push(`
			<div class="product-card">
				<a class="inline-link" href="#" data-open-link="${productData.url || productData.product_link}">Open product page</a>
			</div>
		`);
	}

	elements.productResult.innerHTML = summaryRows.join("");
	if (elements.detailsContent) {
		elements.detailsContent.innerHTML = `
			<div class="detail-group">
				<h3>${safeText(productData.product_name || productData.title)}</h3>
				<p class="detail-list">${safeText(productData.product_id || productData.cid)}</p>
				${productData.image || productData.product_image?.url ? `<img class="details-image" src="${productData.image || productData.product_image?.url}" alt="${safeText(productData.product_name || productData.title)}">` : ""}
			</div>
		`;
	}
	if (elements.detailsModalContent) {
		elements.detailsModalContent.innerHTML = elements.detailsContent ? elements.detailsContent.innerHTML : "";
	}
	if (isNarrowViewport()) {
		openDetailsModal();
	}
}

function getFeedFiltersFromForm() {
	// Prefer the visible modal controls when the top filter form was removed
	const q = elements.feedQuery ? elements.feedQuery.value : (elements.feedQueryModal ? elements.feedQueryModal.value : "");
	const tag = elements.feedTag ? elements.feedTag.value : (elements.feedTagModal ? elements.feedTagModal.value : "");
	const publishedMinRaw = elements.feedPublishedMin ? elements.feedPublishedMin.value : (elements.feedPublishedMinModal ? elements.feedPublishedMinModal.value : "");
	const publishedMaxRaw = elements.feedPublishedMax ? elements.feedPublishedMax.value : (elements.feedPublishedMaxModal ? elements.feedPublishedMaxModal.value : "");
	const maxResultsRaw = elements.feedMaxResults ? elements.feedMaxResults.value : (elements.feedMaxResultsModal ? elements.feedMaxResultsModal.value : "20");
	const startIndexRaw = elements.feedStartIndex ? elements.feedStartIndex.value : (elements.feedStartIndexModal ? elements.feedStartIndexModal.value : "1");

	const publishedMin = publishedMinRaw ? new Date(publishedMinRaw).toISOString() : "";
	const publishedMax = publishedMaxRaw ? new Date(publishedMaxRaw).toISOString() : "";

	return {
		query: (q || "").trim(),
		tag: (tag || "").trim(),
		publishedMin,
		publishedMax,
		maxResults: Number(maxResultsRaw) || 20,
		startIndex: Number(startIndexRaw) || 1,
	};
}

async function loadCategories() {
	try {
		const response = await window.erodusAPI.searchErovoice({ maxResults: 1, startIndex: 1 });
		const categories = response?.feed?.category?.map((category) => category.term).filter(Boolean) || [];
		state.categories = categories;
		const optionsHtml = categories.map((category) => `<option value="${category}"></option>`).join("");
		if (elements.feedCategoryList) elements.feedCategoryList.innerHTML = optionsHtml;
		if (elements.feedCategoryListModal) elements.feedCategoryListModal.innerHTML = optionsHtml;
	} catch {
		if (elements.feedCategoryList) elements.feedCategoryList.innerHTML = "";
		if (elements.feedCategoryListModal) elements.feedCategoryListModal.innerHTML = "";
	}
}

async function loadFeed() {
	elements.feedStatus.textContent = "Loading...";

	// Support appending results for "Load more" behavior
	async function doFetch(filters) {
		const response = await window.erodusAPI.searchErovoice(filters);
		const entries = (response?.feed?.entry || []).map((entry) => ({
			id: entry.id?.$t || null,
			published: entry.published?.$t || null,
			updated: entry.updated?.$t || null,
			title: entry.title?.$t || null,
			content: null,
			rawContent: entry.content?.$t || null,
			categories: entry.category?.map((cat) => cat.term) || [],
			thumbnail: entry.media$thumbnail?.url || null,
			links: entry.link?.map((link) => ({ rel: link.rel, type: link.type, href: link.href, title: link.title })) || [],
		}));

		return entries.map((entry) => ({ ...entry, content: parseFeedContent(entry.rawContent) }));
	}

	try {
		const filters = getFeedFiltersFromForm();
		// if state.currentStartIndex is set, use it; otherwise initialize
		if (!state.currentStartIndex || state.currentStartIndex < 1) state.currentStartIndex = Number(filters.startIndex) || 1;

		// always fetch starting at state.currentStartIndex
		const fetchFilters = { ...filters, startIndex: state.currentStartIndex };
		const parsedEntries = await doFetch(fetchFilters);

		// Replace entries when loading fresh (startIndex equals original requested startIndex), otherwise append
		if (Number(filters.startIndex) <= state.currentStartIndex) {
			state.feedEntries = parsedEntries;
		} else {
			state.feedEntries = (state.feedEntries || []).concat(parsedEntries);
		}

		renderFeedResults(state.feedEntries || []);
		elements.feedStatus.textContent = `${state.feedEntries.length} items`;

		// show or hide load-more button
		const moreAvailable = parsedEntries.length >= (filters.maxResults || 20);
		if (elements.feedLoadMoreContainer) elements.feedLoadMoreContainer.style.display = moreAvailable ? "block" : "none";

		if (state.feedEntries[0]) {
			state.selectedFeedEntry = state.feedEntries[0];
			renderDetailsFromFeedEntry(state.feedEntries[0]);
		}
	} catch (error) {
		elements.feedStatus.textContent = "Failed to load";
		elements.feedResults.innerHTML = `<p class="empty-state">${safeText(error.message || error)}</p>`;
	}
}

async function loadMore() {
    const filters = getFeedFiltersFromForm();
    const step = Number(filters.maxResults) || 20;
    state.currentStartIndex = (state.currentStartIndex || Number(filters.startIndex) || 1) + step;
    // fetch next page and append
    try {
        const responseFilters = { ...filters, startIndex: state.currentStartIndex };
        const newEntries = await (async (f) => {
            const r = await window.erodusAPI.searchErovoice(f);
            const e = (r?.feed?.entry || []).map((entry) => ({
                id: entry.id?.$t || null,
                published: entry.published?.$t || null,
                updated: entry.updated?.$t || null,
                title: entry.title?.$t || null,
                content: null,
                rawContent: entry.content?.$t || null,
                categories: entry.category?.map((cat) => cat.term) || [],
                thumbnail: entry.media$thumbnail?.url || null,
                links: entry.link?.map((link) => ({ rel: link.rel, type: link.type, href: link.href, title: link.title })) || [],
            }));
            return e.map((en) => ({ ...en, content: parseFeedContent(en.rawContent) }));
        })(responseFilters);

        state.feedEntries = (state.feedEntries || []).concat(newEntries);
        renderFeedResults(state.feedEntries || []);
        elements.feedStatus.textContent = `${state.feedEntries.length} items`;
        const moreAvailable = newEntries.length >= (filters.maxResults || 20);
        if (elements.feedLoadMoreContainer) elements.feedLoadMoreContainer.style.display = moreAvailable ? "block" : "none";
    } catch (error) {
        window.erodusAPI.showMessageBox?.({ type: 'error', title: 'Load more failed', message: String(error) });
    }
}

function parseFeedContent(contentHtml) {
	const metadata = {
		image: null,
		circle: null,
		release: null,
		voiceActor: null,
		fileSize: null,
		downloadLinks: [],
		productId: null,
		productLink: null,
	};

	if (!contentHtml) {
		return metadata;
	}

	// Match https image URLs with common image extensions or known hosts
	const imageMatch = contentHtml.match(/src="(https?:\/\/[^\"]+\.(?:jpg|jpeg|png|gif|webp|svg))/i);
	if (imageMatch) metadata.image = imageMatch[1];

	const circleMatch = contentHtml.match(/Circle\s*:\s*([^<&]+)/);
	if (circleMatch) metadata.circle = circleMatch[1].trim().replace(/&nbsp;/g, "");

	const releaseMatch = contentHtml.match(/Release\s*:\s*([^<]+)/);
	if (releaseMatch) metadata.release = releaseMatch[1].trim();

	const voiceMatch = contentHtml.match(/Voice Actor\s*:\s*([^<]+)/);
	if (voiceMatch) metadata.voiceActor = voiceMatch[1].trim();

	const fileSizeMatch = contentHtml.match(/File Size\s*:\s*([^<]+)/);
	if (fileSizeMatch) metadata.fileSize = fileSizeMatch[1].trim();

	const linkRegex = /<a\s+href="([^"]+)">([^<]+)<\/a>/g;
	let linkMatch;
	while ((linkMatch = linkRegex.exec(contentHtml)) !== null) {
		const href = linkMatch[1];
		const typename = linkMatch[2].trim();
		if (href.includes("ouo.io") || href.includes("dlsite")) {
			metadata.downloadLinks.push({ typename, link: href });
		}
	}

	const productMatch = contentHtml.match(/(https:\/\/www\.dlsite\.com\/[^\/]+\/work\/=[^"]+product_id\/(RJ\d+)\.html)/);
	if (productMatch) {
		metadata.productLink = productMatch[1];
		metadata.productId = productMatch[2];
	}

	return metadata;
}

async function searchProduct() {
	const rawValue = elements.productSearchInput.value.trim();
	if (!rawValue) {
		elements.productStatus.textContent = "Enter RJ, VJ, or cid";
		return;
	}

	const normalized = rawValue.toLowerCase();
	elements.productStatus.textContent = "Searching...";

	try {
		if (normalized.startsWith("d_")) {
			const product = await window.erodusAPI.getFanzaProductInfo(rawValue);
			renderProductResult(product, "FANZA / DMM");
			elements.productStatus.textContent = product?.cid || rawValue;
			return;
		}

		if (normalized.startsWith("rj") || normalized.startsWith("vj")) {
			const product = await window.erodusAPI.getDlsiteProductInfo(rawValue);
			renderProductResult(product, "DLSite");
			elements.productStatus.textContent = product?.product_id || rawValue;
			return;
		}

		elements.productStatus.textContent = "Unknown format";
	} catch (error) {
		elements.productStatus.textContent = "Search failed";
		elements.productResult.innerHTML = `<p class="empty-state">${safeText(error.message || error)}</p>`;
	}
}

function openFilterModal() {
	if (elements.filterModalOverlay) elements.filterModalOverlay.style.display = "block";
	if (elements.filterModal) elements.filterModal.style.display = "block";
	syncFilterValuesToModal();
}

function closeFilterModal() {
	if (elements.filterModalOverlay) elements.filterModalOverlay.style.display = "none";
	if (elements.filterModal) elements.filterModal.style.display = "none";
}

function syncFilterValuesToModal() {
	if (!elements.feedQueryModal) return; // Exit early if modal elements don't exist
	elements.feedQueryModal.value = elements.feedQuery?.value || "";
	elements.feedTagModal.value = elements.feedTag?.value || "";
	elements.feedPublishedMinModal.value = elements.feedPublishedMin?.value || "";
	elements.feedPublishedMaxModal.value = elements.feedPublishedMax?.value || "";
	elements.feedMaxResultsModal.value = elements.feedMaxResults?.value || "20";
	elements.feedStartIndexModal.value = elements.feedStartIndex?.value || "1";
}

function syncFilterValuesFromModal() {
	if (!elements.feedQueryModal) return; // Exit early if modal elements don't exist
	if (elements.feedQuery) elements.feedQuery.value = elements.feedQueryModal.value;
	if (elements.feedTag) elements.feedTag.value = elements.feedTagModal.value;
	if (elements.feedPublishedMin) elements.feedPublishedMin.value = elements.feedPublishedMinModal.value;
	if (elements.feedPublishedMax) elements.feedPublishedMax.value = elements.feedPublishedMaxModal.value;
	if (elements.feedMaxResults) elements.feedMaxResults.value = elements.feedMaxResultsModal.value;
	if (elements.feedStartIndex) elements.feedStartIndex.value = elements.feedStartIndexModal.value;
}

function bindEvents() {
	elements.navItems.forEach((item) => {
		item.addEventListener("click", () => setPage(item.dataset.page));
	});

	// If the top filter form exists (older layout), attach; otherwise rely on modal form
	if (elements.feedFilterForm) {
		elements.feedFilterForm.addEventListener("submit", async (event) => {
			event.preventDefault();
			// reset currentStartIndex for fresh search
			state.currentStartIndex = Number((elements.feedStartIndex && elements.feedStartIndex.value) || 1);
			await loadFeed();
		});
	}

	if (elements.refreshFeedBtn) {
		elements.refreshFeedBtn.addEventListener("click", () => { state.currentStartIndex = Number((elements.feedStartIndex && elements.feedStartIndex.value) || 1); loadFeed(); });
	}

	if (elements.clearFeedBtn) {
		elements.clearFeedBtn.addEventListener("click", () => {
			if (elements.feedQuery) elements.feedQuery.value = "";
			if (elements.feedTag) elements.feedTag.value = "";
			if (elements.feedPublishedMin) elements.feedPublishedMin.value = "";
			if (elements.feedPublishedMax) elements.feedPublishedMax.value = "";
			if (elements.feedMaxResults) elements.feedMaxResults.value = 20;
			if (elements.feedStartIndex) elements.feedStartIndex.value = 1;
		});
	}

	// Load-more button
	if (elements.feedLoadMoreBtn) {
		elements.feedLoadMoreBtn.addEventListener('click', loadMore);
	}

	elements.productSearchForm.addEventListener("submit", async (event) => {
		event.preventDefault();
		await searchProduct();
	});

	elements.themeButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const choice = button.dataset.themeChoice;
			if (choice === "dark" || choice === "light") {
				applyTheme(choice);
			} else {
				const storedCustom = localStorage.getItem(customThemeStorageKey);
				if (storedCustom) {
					try {
						applyTheme("custom", JSON.parse(storedCustom));
					} catch {
						applyTheme("dark");
					}
				} else {
					applyTheme("custom", defaultThemes.dark);
				}
			}
		});
	});

	elements.applyThemeJson.addEventListener("click", () => {
		try {
			const parsed = applyCustomThemeFromJson(elements.themeJson.value);
			elements.themeJson.value = JSON.stringify(parsed, null, 2);
		} catch (error) {
			window.erodusAPI.showMessageBox({
				type: "error",
				title: "Invalid theme JSON",
				message: error.message || String(error),
			});
		}
	});

	elements.importThemeBtn.addEventListener("click", () => elements.themeJsonFile.click());

	elements.themeJsonFile.addEventListener("change", async () => {
		const file = elements.themeJsonFile.files?.[0];
		if (!file) return;
		const text = await file.text();
		elements.themeJson.value = text;
		try {
			const parsed = applyCustomThemeFromJson(text);
			elements.themeJson.value = JSON.stringify(parsed, null, 2);
		} catch (error) {
			window.erodusAPI.showMessageBox({
				type: "error",
				title: "Invalid theme JSON",
				message: error.message || String(error),
			});
		}
	});

	elements.resetThemeBtn.addEventListener("click", () => {
		localStorage.removeItem(themeStorageKey);
		localStorage.removeItem(customThemeStorageKey);
		elements.themeJson.value = "";
		applyTheme("dark");
	});

	// Modal event listeners - only if modal elements exist
	if (elements.floatingFilterBtn) {
		elements.floatingFilterBtn.addEventListener("click", openFilterModal);
	}

	if (elements.detailsModalCloseBtn) {
		elements.detailsModalCloseBtn.addEventListener("click", closeDetailsModal);
	}

	if (elements.detailsModalOverlay) {
		elements.detailsModalOverlay.addEventListener("click", closeDetailsModal);
	}
	
	if (elements.modalCloseBtn) {
		elements.modalCloseBtn.addEventListener("click", closeFilterModal);
	}
	
	if (elements.filterModalOverlay) {
		elements.filterModalOverlay.addEventListener("click", (event) => {
			if (event.target === elements.filterModalOverlay) {
				closeFilterModal();
			}
		});
	}

	if (elements.feedFilterFormModal) {
		elements.feedFilterFormModal.addEventListener("submit", async (event) => {
			event.preventDefault();
			syncFilterValuesFromModal();
			state.currentStartIndex = Number(elements.feedStartIndexModal.value) || 1;
			await loadFeed();
			closeFilterModal();
		});
	}

	if (elements.clearFeedBtnModal) {
		elements.clearFeedBtnModal.addEventListener("click", () => {
			elements.feedQueryModal.value = "";
			elements.feedTagModal.value = "";
			elements.feedPublishedMinModal.value = "";
			elements.feedPublishedMaxModal.value = "";
			elements.feedMaxResultsModal.value = 20;
			elements.feedStartIndexModal.value = 1;
		});
	}

	if (elements.refreshFeedBtnModal) {
		elements.refreshFeedBtnModal.addEventListener("click", async () => {
			syncFilterValuesFromModal();
			state.currentStartIndex = Number(elements.feedStartIndexModal.value) || 1;
			await loadFeed();
			closeFilterModal();
		});
	}
}

function initializeThemeEditor() {
	const { themeName, customTheme } = loadStoredTheme();
	if (customTheme) {
		elements.themeJson.value = JSON.stringify(customTheme, null, 2);
		applyTheme(themeName === "custom" ? "custom" : themeName, customTheme);
		return;
	}

	applyTheme(themeName in defaultThemes ? themeName : "dark");
}

window.addEventListener("DOMContentLoaded", async () => {
	initializeThemeEditor();
	bindEvents();
	setPage("feed");
	await loadCategories();
	await loadFeed();
});
