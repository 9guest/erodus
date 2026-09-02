/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

const themeStorageKey = "erodus-theme";
const customThemeStorageKey = "erodus-custom-theme";
const queueStorageKey = "erodus-queue";
const queueHistoryStorageKey = "erodus-queue-history";

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
	nord: {
		name: "Nord",
		colors: {
			bg: "#2e3440",
			bgAccent: "#3b4252",
			surface: "rgba(46, 52, 64, 0.92)",
			surfaceStrong: "#434c5e",
			text: "#d8dee9",
			muted: "#81a1c1",
			border: "rgba(216, 222, 233, 0.16)",
			accent: "#88c0d0",
			accentStrong: "#81a1c1",
		},
	},
	sakura: {
		name: "Sakura",
		colors: {
			bg: "#2d1e2f",
			bgAccent: "#3d2b3e",
			surface: "rgba(45, 30, 47, 0.9)",
			surfaceStrong: "#4f3851",
			text: "#ffd5e5",
			muted: "#f2a6c2",
			border: "rgba(242, 166, 194, 0.2)",
			accent: "#ff7b9e",
			accentStrong: "#ff527b",
		},
	},
	ocean: {
		name: "Ocean",
		colors: {
			bg: "#081b29",
			bgAccent: "#0b2c3d",
			surface: "rgba(11, 44, 61, 0.9)",
			surfaceStrong: "#133b5c",
			text: "#e0f2fe",
			muted: "#7dd3fc",
			border: "rgba(125, 211, 252, 0.15)",
			accent: "#00abf0",
			accentStrong: "#008fc7",
		},
	},
	purple: {
		name: "Purple Violet",
		colors: {
			bg: "#130f26",
			bgAccent: "#1d163b",
			surface: "rgba(29, 22, 59, 0.9)",
			surfaceStrong: "#271e4f",
			text: "#f5f3ff",
			muted: "#a78bfa",
			border: "rgba(167, 139, 250, 0.18)",
			accent: "#c084fc",
			accentStrong: "#a855f7",
		},
	},
	cybercyan: {
		name: "Cyber Cyan",
		colors: {
			bg: "#050914",
			bgGradient: "linear-gradient(135deg, #050914 0%, #081630 60%, #150b30 100%)",
			bgAccent: "#0a1224",
			surface: "rgba(10, 18, 36, 0.9)",
			surfaceStrong: "#132244",
			text: "#ecf2ff",
			muted: "#3b82f6",
			border: "rgba(0, 245, 255, 0.18)",
			accent: "#00f5ff",
			accentStrong: "#00b3c7",
		},
	},
	neonamethyst: {
		name: "Neon Amethyst",
		colors: {
			bg: "#0f0514",
			bgGradient: "linear-gradient(135deg, #0f0514 0%, #200830 60%, #300525 100%)",
			bgAccent: "#1a0a24",
			surface: "rgba(26, 10, 36, 0.9)",
			surfaceStrong: "#331444",
			text: "#fdf2f8",
			muted: "#c084fc",
			border: "rgba(192, 132, 252, 0.18)",
			accent: "#d946ef",
			accentStrong: "#a855f7",
		},
	},
	emeraldmatrix: {
		name: "Emerald Matrix",
		colors: {
			bg: "#030f0b",
			bgGradient: "linear-gradient(135deg, #030f0b 0%, #06241a 60%, #0a2d24 100%)",
			bgAccent: "#061d15",
			surface: "rgba(6, 29, 21, 0.9)",
			surfaceStrong: "#0e4230",
			text: "#f0fdfa",
			muted: "#10b981",
			border: "rgba(45, 212, 191, 0.15)",
			accent: "#2dd4bf",
			accentStrong: "#0f766e",
		},
	},
	sunsetamber: {
		name: "Sunset Amber",
		colors: {
			bg: "#140905",
			bgGradient: "linear-gradient(135deg, #140905 0%, #2c1208 60%, #3a1505 100%)",
			bgAccent: "#221008",
			surface: "rgba(34, 16, 8, 0.9)",
			surfaceStrong: "#462110",
			text: "#fffbeb",
			muted: "#f97316",
			border: "rgba(245, 158, 11, 0.15)",
			accent: "#f59e0b",
			accentStrong: "#b45309",
		},
	},
	rosecrimson: {
		name: "Rose Crimson",
		colors: {
			bg: "#140509",
			bgGradient: "linear-gradient(135deg, #140509 0%, #2c0812 60%, #360520 100%)",
			bgAccent: "#220a12",
			surface: "rgba(34, 10, 18, 0.9)",
			surfaceStrong: "#4a1424",
			text: "#fff1f2",
			muted: "#fb7185",
			border: "rgba(244, 63, 94, 0.18)",
			accent: "#f43f5e",
			accentStrong: "#be123c",
		},
	},
	obsidianoled: {
		name: "Obsidian OLED",
		colors: {
			bg: "#000000",
			bgGradient: "linear-gradient(135deg, #000000 0%, #0a0a0a 60%, #121212 100%)",
			bgAccent: "#0d0d0d",
			surface: "rgba(13, 13, 13, 0.9)",
			surfaceStrong: "#1a1a1a",
			text: "#f5f5f7",
			muted: "#86868b",
			border: "rgba(255, 255, 255, 0.12)",
			accent: "#ffffff",
			accentStrong: "#cccccc",
		},
	},
};

const state = {
	page: "feed",
	feedEntries: [],
	selectedFeedEntry: null,
	selectedProduct: null,
	isLoadingMore: false,
	hasMoreFeed: true,
	categories: [],
	themeName: "dark",
	appInfo: {
		name: "EroDUS",
		version: "--",
		platform: "--",
		arch: "--",
		isPackaged: false,
	},
	updateStatus: {
		state: "idle",
		message: "Idle",
		percent: 0,
	},
	queue: [],
	queueHistory: [],
	imageViewer: {
		images: [],
		index: 0,
		scale: 1,
		x: 0,
		y: 0,
		dragging: false,
		dragStartX: 0,
		dragStartY: 0,
		panStartX: 0,
		panStartY: 0,
		title: "Image Preview",
	},
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
	imageModalOverlay: $("#image-modal-overlay"),
	imageModal: $("#image-modal"),
	imageModalCloseBtn: $("#image-modal-close-btn"),
	imageModalTitle: $("#image-modal-title"),
	imageModalMeta: $("#image-modal-meta"),
	imageModalImage: $("#image-modal-image"),
	imageModalStage: $("#image-modal-stage"),
	imageModalPrevBtn: $("#image-modal-prev-btn"),
	imageModalNextBtn: $("#image-modal-next-btn"),
	imageModalZoomInBtn: $("#image-modal-zoom-in-btn"),
	imageModalZoomOutBtn: $("#image-modal-zoom-out-btn"),
	imageModalZoomResetBtn: $("#image-modal-zoom-reset-btn"),
	imageModalDownloadBtn: $("#image-modal-download-btn"),
	productSearchForm: $("#product-search-form"),
	productSearchInput: $("#product-search-input"),
	productStatus: $("#product-status"),
	productResult: $("#product-result"),
	aboutBuildTag: $("#about-build-tag"),
	aboutAppVersion: $("#about-app-version"),
	aboutAppPlatform: $("#about-app-platform"),
	aboutAppArch: $("#about-app-arch"),
	updateStatus: $("#update-status"),
	updateNote: $("#update-note"),
	checkUpdatesBtn: $("#check-updates-btn"),
	downloadUpdateBtn: $("#download-update-btn"),
	installUpdateBtn: $("#install-update-btn"),
	themeButtons: Array.from(document.querySelectorAll(".theme-button")),
	themeEditorPanel: $("#theme-editor-panel"),
	themeJson: $("#theme-json"),
	applyThemeJson: $("#apply-theme-json"),
	importThemeBtn: $("#import-theme-btn"),
	themeJsonFile: $("#theme-json-file"),
	resetThemeBtn: $("#reset-theme-btn"),
	themeColorBg: $("#theme-color-bg"),
	themeColorBgAccent: $("#theme-color-bgAccent"),
	themeColorSurface: $("#theme-color-surface"),
	themeColorSurfaceStrong: $("#theme-color-surfaceStrong"),
	themeColorText: $("#theme-color-text"),
	themeColorMuted: $("#theme-color-muted"),
	themeColorBorder: $("#theme-color-border"),
	themeColorAccent: $("#theme-color-accent"),
	themeColorAccentStrong: $("#theme-color-accentStrong"),
	applyCustomPickerBtn: $("#apply-custom-picker-btn"),
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
	queueContent: $("#queue-content"),
	queueStatus: $("#queue-or-history-status"),
	downloadAllBtn: $("#download-all-btn"),
	clearQueueBtn: $("#clear-queue-btn"),
	historyContent: $("#history-content"),
	historyStatus: $("#queue-or-history-status"),
	clearHistoryBtn: $("#clear-history-btn"),
	queueTabBtns: Array.from(document.querySelectorAll(".queue-tab-btn")),
	queueTabContents: Array.from(document.querySelectorAll(".queue-tab-content")),
	toastContainer: $("#toast-container"),
	
	// History Search/Filters
	historySearchInput: $("#history-search-input"),
	historyDateMin: $("#history-date-min"),
	historyDateMax: $("#history-date-max"),
	historyFilterClearBtn: $("#history-filter-clear-btn"),
	
	// Queue Bulk Selection
	queueBulkActions: $("#queue-bulk-actions"),
	queueSelectAll: $("#queue-select-all"),
	queueDeleteSelected: $("#queue-delete-selected"),
	
	// History Bulk Selection
	historyBulkActions: $("#history-bulk-actions"),
	historySelectAll: $("#history-select-all"),
	historyDeleteSelected: $("#history-delete-selected"),
	historyFilterBar: $(".history-filter-bar"),

	// Wallpaper Elements
	wallpaperImportBtn: $("#wallpaper-import-btn"),
	wallpaperClearBtn: $("#wallpaper-clear-btn"),
	wallpaperFileInput: $("#wallpaper-file-input"),
	wallpaperStatus: $("#wallpaper-status"),
	wallpaperControlsPanel: $("#wallpaper-controls-panel"),
	wallpaperPosX: $("#wallpaper-pos-x"),
	wallpaperPosY: $("#wallpaper-pos-y"),
	wallpaperScale: $("#wallpaper-scale"),
	wallpaperBlur: $("#wallpaper-blur"),
	wallpaperDark: $("#wallpaper-dark"),
	wallpaperValX: $("#wallpaper-val-x"),
	wallpaperValY: $("#wallpaper-val-y"),
	wallpaperValBlur: $("#wallpaper-val-blur"),
	wallpaperValDark: $("#wallpaper-val-dark"),
	wallpaperSbBlur: $("#wallpaper-sb-blur"),
	wallpaperSbDark: $("#wallpaper-sb-dark"),
	wallpaperValSbBlur: $("#wallpaper-val-sb-blur"),
	wallpaperValSbDark: $("#wallpaper-val-sb-dark"),
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

function showImageModal(images, startIndex = 0, title = "Image Preview") {
	const normalizedImages = Array.isArray(images) ? images.filter(Boolean) : [];
	if (!normalizedImages.length) return;

	state.imageViewer.images = normalizedImages;
	state.imageViewer.index = Math.max(0, Math.min(startIndex, normalizedImages.length - 1));
	state.imageViewer.scale = 1;
	state.imageViewer.x = 0;
	state.imageViewer.y = 0;
	state.imageViewer.dragging = false;
	state.imageViewer.title = title || "Image Preview";

	if (elements.imageModalTitle) elements.imageModalTitle.textContent = state.imageViewer.title;
	renderImageModal();
	if (elements.imageModalOverlay) elements.imageModalOverlay.style.display = "block";
	if (elements.imageModal) elements.imageModal.style.display = "flex";
}

function closeImageModal() {
	if (elements.imageModalOverlay) elements.imageModalOverlay.style.display = "none";
	if (elements.imageModal) elements.imageModal.style.display = "none";
}

function renderImageModal() {
	const viewer = state.imageViewer;
	const currentImage = viewer.images[viewer.index];
	if (!currentImage) return;

	if (elements.imageModalImage) {
		elements.imageModalImage.src = currentImage;
		elements.imageModalImage.alt = viewer.title;
		elements.imageModalImage.style.transform = `translate(${viewer.x}px, ${viewer.y}px) scale(${viewer.scale})`;
		elements.imageModalImage.style.cursor = viewer.scale > 1 ? "grab" : "zoom-in";
	}

	if (elements.imageModalStage) {
		elements.imageModalStage.style.cursor = viewer.scale > 1 ? "grab" : "default";
	}

	if (elements.imageModalMeta) {
		elements.imageModalMeta.textContent = `${viewer.index + 1} of ${viewer.images.length}`;
	}

	if (elements.imageModalPrevBtn) {
		elements.imageModalPrevBtn.style.visibility = viewer.images.length > 1 ? "visible" : "hidden";
	}
	if (elements.imageModalNextBtn) {
		elements.imageModalNextBtn.style.visibility = viewer.images.length > 1 ? "visible" : "hidden";
	}

	if (elements.imageModalDownloadBtn) {
		elements.imageModalDownloadBtn.disabled = !currentImage;
	}
}

function shiftImage(direction) {
	if (!state.imageViewer.images.length) return;
	state.imageViewer.index = (state.imageViewer.index + direction + state.imageViewer.images.length) % state.imageViewer.images.length;
	state.imageViewer.scale = 1;
	state.imageViewer.x = 0;
	state.imageViewer.y = 0;
	renderImageModal();
}

function zoomImage(delta) {
	state.imageViewer.scale = Math.min(4, Math.max(0.25, state.imageViewer.scale + delta));
	if (state.imageViewer.scale === 1) {
		state.imageViewer.x = 0;
		state.imageViewer.y = 0;
	}
	renderImageModal();
}

async function downloadCurrentImage() {
	const currentImage = state.imageViewer.images[state.imageViewer.index];
	if (!currentImage) return;
	const filename = deriveFilenameFromUrl(currentImage, state.imageViewer.title || "image");
	const result = await window.erodusAPI.downloadImage({
		url: currentImage,
		filename,
	});
	if (result?.canceled === false) {
		window.erodusAPI.showMessageBox({
			type: "info",
			title: "Image saved",
			message: "The image was downloaded successfully.",
		});
	}
}

function deriveFilenameFromUrl(imageUrl, fallbackName = "image") {
	try {
		const url = new URL(imageUrl);
		const rawName = pathBaseName(url.pathname) || fallbackName;
		const safeName = rawName.replace(/[^a-z0-9-_]+/gi, "_").replace(/^_+|_+$/g, "").slice(0, 48) || "image";
		const extensionMatch = url.pathname.match(/\.(png|jpe?g|gif|webp|bmp|svg)$/i);
		return extensionMatch ? `${safeName}.${extensionMatch[1].toLowerCase()}` : `${safeName}.jpg`;
	} catch {
		const safeName = fallbackName.replace(/[^a-z0-9-_]+/gi, "_").replace(/^_+|_+$/g, "").slice(0, 48) || "image";
		return `${safeName}.jpg`;
	}
}

function pathBaseName(pathname) {
	const parts = String(pathname || "").split("/").filter(Boolean);
	return parts.length ? parts[parts.length - 1].split(/[?#]/)[0] : "";
}

function bindPreviewImages(container, title) {
	if (!container) return;
	const slideshowContainers = Array.from(container.querySelectorAll(".slideshow"));
	const standaloneImages = Array.from(container.querySelectorAll(":scope > img.details-image, .detail-group img.details-image, img.details-image"));

	slideshowContainers.forEach((slideshow) => {
		const images = Array.from(slideshow.querySelectorAll("img")).map((img) => img.src).filter(Boolean);
		const slides = Array.from(slideshow.querySelectorAll("img"));
		slides.forEach((img, index) => {
			img.classList.add("is-zoomable");
			img.style.cursor = "zoom-in";
			img.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();
				showImageModal(images, index, title || img.alt || "Image Preview");
			});
		});
	});

	standaloneImages.forEach((img) => {
		if (img.closest(".slideshow")) return;
		img.classList.add("is-zoomable");
		img.style.cursor = "zoom-in";
		img.addEventListener("click", (event) => {
			event.preventDefault();
			event.stopPropagation();
			showImageModal([img.src], 0, title || img.alt || "Image Preview");
		});
	});
}

function startImagePan(event) {
	if (!elements.imageModalStage) return;
	state.imageViewer.dragging = true;
	state.imageViewer.dragStartX = event.clientX;
	state.imageViewer.dragStartY = event.clientY;
	state.imageViewer.panStartX = state.imageViewer.x;
	state.imageViewer.panStartY = state.imageViewer.y;
	elements.imageModalStage.classList.add("is-panning");
	elements.imageModalStage.setPointerCapture?.(event.pointerId);
}

function moveImagePan(event) {
	if (!state.imageViewer.dragging) return;
	const deltaX = event.clientX - state.imageViewer.dragStartX;
	const deltaY = event.clientY - state.imageViewer.dragStartY;
	state.imageViewer.x = state.imageViewer.panStartX + deltaX;
	state.imageViewer.y = state.imageViewer.panStartY + deltaY;
	renderImageModal();
}

function endImagePan(event) {
	if (!state.imageViewer.dragging) return;
	state.imageViewer.dragging = false;
	elements.imageModalStage?.classList.remove("is-panning");
	elements.imageModalStage?.releasePointerCapture?.(event.pointerId);
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
			<div class="detail-list" style="margin-top: 10px;">
				${(entry.content?.downloadLinks || []).map((link) => `<div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
					<a class="inline-link" href="#" data-open-link="${link.link}">${link.typename}</a>
					<button class="add-to-queue-btn ghost-button" data-product-name="${safeText(entry.title)}" data-product-id="${safeText(entry.content?.productId || 'N/A')}" data-link="${link.link}" data-typename="${link.typename}" data-image="${entry.content?.image || ''}" type="button" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">+ Queue</button>
				</div>`).join("") || "—"}
			</div>
		</div>
		<div class="detail-group">
			<div class="detail-label">Product</div>
			<div class="detail-list">${safeText(entry.content?.productId)}</div>
			<div class="detail-list">${safeText(entry.content?.productLink)}</div>
		</div>
	`;
}

function bindQueueButtons(container) {
	if (!container) return;
	container.querySelectorAll(".add-to-queue-btn").forEach((btn) => {
		btn.addEventListener("click", (event) => {
			event.preventDefault();
			const productName = btn.dataset.productName;
			const productId = btn.dataset.productId;
			const link = btn.dataset.link;
			const typename = btn.dataset.typename;
			const image = btn.dataset.image || null;
			addToQueue(productName, productId, link, typename, image);
		});
	});
}

function syncDetailsMarkup(entry, sourceLabel) {
	const markup = buildDetailsMarkup(entry);
	if (elements.detailsSource) {
		elements.detailsSource.textContent = sourceLabel || "Nothing selected";
	}
	if (elements.detailsContent) {
		elements.detailsContent.innerHTML = markup;
		bindPreviewImages(elements.detailsContent, entry?.title || "Image Preview");
	}
	if (elements.detailsModalSource) {
		elements.detailsModalSource.textContent = sourceLabel || "Nothing selected";
	}
	if (elements.detailsModalContent) {
		elements.detailsModalContent.innerHTML = markup;
		bindPreviewImages(elements.detailsModalContent, entry?.title || "Image Preview");
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
			bindQueueButtons(container);
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
	
	if (colors.bgGradient) {
		root.style.setProperty("--bg-gradient", colors.bgGradient);
	} else {
		root.style.setProperty("--bg-gradient", `radial-gradient(circle at top left, rgba(101, 214, 194, 0.15), transparent 30%), radial-gradient(circle at bottom right, rgba(96, 165, 250, 0.10), transparent 30%), ${colors.bg || defaultThemes.dark.colors.bg}`);
	}
	
	root.style.setProperty("--bg-accent", colors.bgAccent || defaultThemes.dark.colors.bgAccent);
	root.style.setProperty("--surface", colors.surface || defaultThemes.dark.colors.surface);
	root.style.setProperty("--surface-strong", colors.surfaceStrong || defaultThemes.dark.colors.surfaceStrong);
	root.style.setProperty("--text", colors.text || defaultThemes.dark.colors.text);
	root.style.setProperty("--muted", colors.muted || defaultThemes.dark.colors.muted);
	root.style.setProperty("--border", colors.border || defaultThemes.dark.colors.border);
	root.style.setProperty("--accent", colors.accent || defaultThemes.dark.colors.accent);
	root.style.setProperty("--accent-strong", colors.accentStrong || defaultThemes.dark.colors.accentStrong);
}

function rgbaToHex(rgba) {
	if (!rgba) return "#000000";
	if (rgba.startsWith("#")) {
		if (rgba.length === 4) {
			return "#" + rgba[1] + rgba[1] + rgba[2] + rgba[2] + rgba[3] + rgba[3];
		}
		return rgba.substring(0, 7);
	}
	const parts = rgba.match(/\d+/g);
	if (!parts) return "#000000";
	const r = parseInt(parts[0]).toString(16).padStart(2, "0");
	const g = parseInt(parts[1]).toString(16).padStart(2, "0");
	const b = parseInt(parts[2]).toString(16).padStart(2, "0");
	return `#${r}${g}${b}`;
}

function hexToRgba(hex, alpha) {
	if (!hex.startsWith("#")) return hex;
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function updateColorPickersFromTheme(theme) {
	const colors = theme?.colors || {};
	if (elements.themeColorBg) elements.themeColorBg.value = rgbaToHex(colors.bg || "#0a0d14");
	if (elements.themeColorBgAccent) elements.themeColorBgAccent.value = rgbaToHex(colors.bgAccent || "#111827");
	if (elements.themeColorSurface) elements.themeColorSurface.value = rgbaToHex(colors.surface || "#111827");
	if (elements.themeColorSurfaceStrong) elements.themeColorSurfaceStrong.value = rgbaToHex(colors.surfaceStrong || "#182033");
	if (elements.themeColorText) elements.themeColorText.value = rgbaToHex(colors.text || "#ecf2ff");
	if (elements.themeColorMuted) elements.themeColorMuted.value = rgbaToHex(colors.muted || "#9aa8c3");
	if (elements.themeColorBorder) elements.themeColorBorder.value = rgbaToHex(colors.border || "#2d3748");
	if (elements.themeColorAccent) elements.themeColorAccent.value = rgbaToHex(colors.accent || "#65d6c2");
	if (elements.themeColorAccentStrong) elements.themeColorAccentStrong.value = rgbaToHex(colors.accentStrong || "#3bb7a2");
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
	updateColorPickersFromTheme(theme);
	state.themeName = themeName;
	elements.themeButtons.forEach((button) => {
		button.classList.toggle("is-active", button.dataset.themeChoice === themeName);
	});

	if (elements.themeEditorPanel) {
		elements.themeEditorPanel.style.display = themeName === "custom" ? "grid" : "none";
	}

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

function showToast({ title, message, type = "info", duration = 3500 }) {
	const container = elements.toastContainer;
	if (!container) return;

	const toast = document.createElement("div");
	toast.className = `toast toast--${type}`;
	toast.innerHTML = `
		<div class="toast__title">${safeText(title)}</div>
		<div class="toast__message">${safeText(message)}</div>
	`;

	container.appendChild(toast);

	const removeToast = () => {
		if (!toast.isConnected) return;
		toast.classList.add("is-leaving");
		window.setTimeout(() => toast.remove(), 180);
	};

	window.setTimeout(removeToast, duration);
	toast.addEventListener("click", removeToast);
}

function saveQueue() {
	try {
		localStorage.setItem(queueStorageKey, JSON.stringify(state.queue));
	} catch (error) {
		console.error("Failed to save queue:", error);
	}
}

function loadQueue() {
	try {
		const stored = localStorage.getItem(queueStorageKey);
		if (stored) {
			state.queue = JSON.parse(stored);
		}
	} catch (error) {
		console.error("Failed to load queue:", error);
		state.queue = [];
	}
}

function saveHistory() {
	try {
		localStorage.setItem(queueHistoryStorageKey, JSON.stringify(state.queueHistory));
	} catch (error) {
		console.error("Failed to save history:", error);
	}
}

function loadHistory() {
	try {
		const stored = localStorage.getItem(queueHistoryStorageKey);
		if (stored) {
			state.queueHistory = JSON.parse(stored);
		}
	} catch (error) {
		console.error("Failed to load history:", error);
		state.queueHistory = [];
	}
}

function applyUpdateState(updateState = {}) {
	state.updateStatus = {
		...state.updateStatus,
		...updateState,
	};

	const message = state.updateStatus.message || "Idle";
	if (elements.updateStatus) {
		elements.updateStatus.textContent = message;
	}
	if (elements.updateNote) {
		elements.updateNote.textContent = message;
	}

	const showActionButtons = state.appInfo.isPackaged;
	if (elements.downloadUpdateBtn) {
		elements.downloadUpdateBtn.style.display = state.updateStatus.state === "available" ? "inline-flex" : "none";
		elements.downloadUpdateBtn.disabled = state.updateStatus.state !== "available";
		elements.downloadUpdateBtn.textContent = state.updateStatus.state === "available" ? "Open Latest Release" : "Download Update";
	}
	if (elements.installUpdateBtn) {
		elements.installUpdateBtn.style.display = "none";
		elements.installUpdateBtn.disabled = true;
	}
	if (elements.checkUpdatesBtn) {
		elements.checkUpdatesBtn.disabled = !showActionButtons && state.updateStatus.state !== "error";
		elements.checkUpdatesBtn.textContent = showActionButtons ? "Check for Updates" : "Check unavailable in dev";
	}
	if (elements.aboutBuildTag) {
		elements.aboutBuildTag.textContent = state.appInfo.isPackaged ? "Packaged build" : "Development build";
	}
	if (elements.aboutAppVersion) elements.aboutAppVersion.textContent = state.appInfo.version || "--";
	if (elements.aboutAppPlatform) elements.aboutAppPlatform.textContent = state.appInfo.platform || "--";
	if (elements.aboutAppArch) elements.aboutAppArch.textContent = state.appInfo.arch || "--";
}

async function loadAppInfo() {
	try {
		const appInfo = await window.erodusAPI.getAppInfo();
		state.appInfo = {
			...state.appInfo,
			...appInfo,
		};
		applyUpdateState();
	} catch (error) {
		applyUpdateState({ state: "error", message: error.message || String(error) });
	}
}

async function checkForUpdates() {
	applyUpdateState({ state: "checking", message: "Checking for updates...", percent: 0 });
	try {
		const result = await window.erodusAPI.checkForUpdates();
		applyUpdateState({
			state: result?.state || "idle",
			message: result?.message || "Idle",
			percent: 0,
		});
		if (result?.state === "available") {
			showToast({ type: "info", title: "Update available", message: result.message || "A new version is available." });
		}
		if (result?.state === "not-available") {
			showToast({ type: "success", title: "Up to date", message: result.message || "You are using the latest version." });
		}
	} catch (error) {
		applyUpdateState({ state: "error", message: error.message || String(error), percent: 0 });
		showToast({ type: "error", title: "Update check failed", message: error.message || String(error) });
	}
}

async function downloadUpdate() {
	applyUpdateState({ state: "downloading", message: "Downloading update...", percent: 0 });
	try {
		const result = await window.erodusAPI.downloadUpdate();
		applyUpdateState({
			state: result?.state || "downloading",
			message: result?.message || "Downloading update...",
			percent: 0,
		});
		if (result?.state === "available") {
			showToast({ type: "info", title: "Release opened", message: result.message || "The latest release page opened in your browser." });
		}
	} catch (error) {
		applyUpdateState({ state: "error", message: error.message || String(error), percent: 0 });
		showToast({ type: "error", title: "Download failed", message: error.message || String(error) });
	}
}

async function installUpdate() {
	try {
		await window.erodusAPI.installUpdate();
		applyUpdateState({ state: "installing", message: "Installing update...", percent: 0 });
	} catch (error) {
		applyUpdateState({ state: "error", message: error.message || String(error), percent: 0 });
		showToast({ type: "error", title: "Install failed", message: error.message || String(error) });
	}
}

const pageScrollPositions = {};

function setPage(page) {
	const mainContent = document.querySelector(".main-content");
	if (mainContent && state.page) {
		pageScrollPositions[state.page] = mainContent.scrollTop;
	}

	state.page = page;
	elements.navItems.forEach((item) => item.classList.toggle("is-active", item.dataset.page === page));
	elements.pageViews.forEach((view) => view.classList.toggle("is-active", view.dataset.pageView === page));

	// Hide details panel on product and settings pages
	const detailsPanel = document.querySelector(".details-panel");
	if (detailsPanel) {
		detailsPanel.classList.toggle("is-hidden", page !== "feed");
	}

	// Show floating filter button only on feed page
	if (elements.floatingFilterBtn) {
		elements.floatingFilterBtn.style.display = page === "feed" ? "block" : "none";
	}

	// Render queue and history when navigating to queue page
	if (page === "queue") {
		renderQueue();
		renderHistory();
	}

	// Restore scroll position for the activated page view
	if (mainContent) {
		requestAnimationFrame(() => {
			mainContent.scrollTop = pageScrollPositions[page] || 0;
			updateScrollToTopBtn();
		});
	}

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
		queue: {
			eyebrow: "Download Manager",
			title: "Download Queue",
			description: "Manage your download queue and view download history.",
			actions: '',
		},
		settings: {
			eyebrow: "Settings",
			title: "Theme Preferences",
			description: "Switch between dark and light themes or paste/import a JSON theme config.",
			actions: '',
		},
		about: {
			eyebrow: "About",
			title: "About EroDUS",
			description: "See the app version and check for updates.",
			actions: '<button class="ghost-button" id="about-check-shortcut" type="button">Check for Updates</button>',
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

	const aboutCheckButton = document.getElementById("about-check-shortcut");
	if (aboutCheckButton) {
		aboutCheckButton.addEventListener("click", () => checkForUpdates());
	}
}

const findHistoryItem = (entry) => {
	const pId = entry.content?.productId;
	const title = entry.title;
	return (state.queueHistory || []).find((h) => {
		if (pId && pId !== "N/A" && h.productId && h.productId !== "N/A") {
			return pId.toLowerCase() === h.productId.toLowerCase();
		}
		if (title && h.productName) {
			return title.trim().toLowerCase() === h.productName.trim().toLowerCase();
		}
		return false;
	});
};

const findQueueItem = (entry) => {
	const pId = entry.content?.productId;
	const title = entry.title;
	return (state.queue || []).find((q) => {
		if (pId && pId !== "N/A" && q.productId && q.productId !== "N/A") {
			return pId.toLowerCase() === q.productId.toLowerCase();
		}
		if (title && q.productName) {
			return title.trim().toLowerCase() === q.productName.trim().toLowerCase();
		}
		return false;
	});
};

function renderFeedResults(entries) {
	if (!entries.length) {
		elements.feedResults.innerHTML = '<p class="empty-state">No entries found.</p>';
		return;
	}

	elements.feedResults.innerHTML = entries.map((entry, index) => {
		const categories = entry.categories || [];
		const image = entry.thumbnail || entry.content?.image;
		const historyItem = findHistoryItem(entry);
		const queueItem = findQueueItem(entry);

		let badgeHtml = "";
		if (historyItem) {
			badgeHtml = `<span class="downloaded-badge"><i class="fas fa-check-circle"></i> Downloaded: ${formatDateDisplay(historyItem.downloadedAt)}</span>`;
		} else if (queueItem) {
			badgeHtml = `<span class="queued-badge"><i class="fas fa-clock"></i> In Queue</span>`;
		}

		return `
			<article class="result-item" data-feed-index="${index}">
				<div class="result-item__title">${safeText(entry.title)}</div>
				<div class="result-item__meta">
					<span>${formatDateDisplay(entry.published)}</span>
					<span>${entry.content?.fileSize ? `File Size: ${safeText(entry.content.fileSize)}` : "No file size"}</span>
					${badgeHtml}
				</div>
				${image ? `<img class="details-image" loading="lazy" decoding="async" src="${image}" alt="${safeText(entry.title)}" onload="this.classList.add('is-loaded')" onerror="this.onerror=null; this.classList.add('is-loaded'); this.style.opacity='0.4';">` : `<div class="details-image-placeholder"><i class="fas fa-image"></i></div>`}
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

	bindPreviewImages(elements.feedResults, "Feed Image Preview");
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
		renderProductInDetailsPanel(entry, productData, lookupInfo.sourceLabel);
		if (isNarrowViewport()) {
			openDetailsModal();
		}
	} catch (error) {
		if (lookupInfo.sourceLabel === "DLSite" || lookupInfo.sourceLabel === "FANZA / DMM") {
			// Fallback to Erovoice feed info
			syncDetailsMarkup(entry, `Erovoice feed (${lookupInfo.sourceLabel} fallback)`);

			const noticeHtml = `
				<div class="regional-warning-banner">
					<strong><i class="fas fa-exclamation-triangle"></i> Notice:</strong> Failed to fetch ${lookupInfo.sourceLabel} details (This item might be restricted by Japan regional block. You may need a VPN connected to Japan to access ${lookupInfo.sourceLabel} info). Falling back to Erovoice API info.
				</div>
			`;

			if (elements.detailsContent) {
				elements.detailsContent.insertAdjacentHTML('afterbegin', noticeHtml);
			}
			if (elements.detailsModalContent) {
				elements.detailsModalContent.insertAdjacentHTML('afterbegin', noticeHtml);
			}
			if (isNarrowViewport()) {
				openDetailsModal();
			}
		} else {
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
}

// Render product data in the details panel (right sidebar when clicking a feed item)
function renderProductInDetailsPanel(entry, productData, sourceLabel) {
	console.log("my entry", entry);
	if (!productData) {
		if (elements.detailsContent) {
			elements.detailsContent.innerHTML = '<p class="empty-state">No product data loaded.</p>';
		}
		return;
	}

	const p = normalizeProduct(productData);
	state.selectedProduct = productData;
	if (elements.detailsSource) elements.detailsSource.textContent = sourceLabel;
	if (elements.detailsModalSource) elements.detailsModalSource.textContent = sourceLabel;

	let detailsHtml = `
		<div class="detail-group">
			<h3>${safeText(p.product_name)}</h3>
			<p class="detail-list">${safeText(p.product_id)}</p>
	`;

	if (p.product_image || p.product_image_samples.length) {
		
		const arrayofImages = [];
		if (p.product_image) arrayofImages.push(p.product_image);
		if (p.product_image_samples.length) arrayofImages.push(...p.product_image_samples);
		console.log("my array of images", arrayofImages);

		if (arrayofImages.length === 1) {
			detailsHtml += `<img class="details-image" src="${arrayofImages[0]}" alt="${safeText(p.product_name)}">`;
		} else if (arrayofImages.length > 1) {
			detailsHtml += `
				<div class="slideshow">
					${arrayofImages.map((img) => `<img class="details-image" src="${img}" alt="${safeText(p.product_name)}">`).join("")}
				</div>
			`;
		}
	}

	const genre_chips = (p.genres && p.genres.length) ? p.genres : [];
	const va_chips = (p.voice_by && p.voice_by.length) ? p.voice_by : [];

	if (genre_chips.length) {
		detailsHtml += `
			<div class="chip-row">
				${genre_chips.map((item) => `<span class="chip">${item}</span>`).join("")}
			</div>
		`;
	}

	detailsHtml += `
		    ${ p.product_id ? `<div class="detail-label" style="margin-top: .75rem;">ID</div><div>${safeText(p.product_id)}</div>` : ""}
			${ p.product_price || p.product_official_price ? `<div class="detail-label" style="margin-top: .75rem;">Price</div><div>JPY ${safeText(p.product_price || p.product_official_price)}</div>` : ""}
			${ p.file_size ? `<div class="detail-label" style="margin-top: .75rem;">File Size</div><div>${safeText(p.file_size)}</div>` : ""}
			${ p.subject ? `<div class="detail-label" style="margin-top: .75rem;">Subject</div><div>${safeText(p.subject)}</div>` : ""}
			${ p.maker_name ? `<div class="detail-label" style="margin-top: .75rem;">Maker</div><div>${safeText(p.maker_name)}</div>` : ""}
			${ p.created_by && p.created_by.length ? `<div class="detail-label" style="margin-top: .75rem;">Created by</div><div>${safeText(p.created_by)}</div>` : ""}
			${ p.scenario_by && p.scenario_by.length ? `<div class="detail-label" style="margin-top: .75rem;">Scenario by</div><div>${safeText(p.scenario_by)}</div>` : ""}
			${ p.illust_by && p.illust_by.length ? `<div class="detail-label" style="margin-top: .75rem;">Illustration by</div><div>${safeText(p.illust_by)}</div>` : ""}
			${ va_chips.length ? `<div class="detail-label" style="margin-top: .75rem;">Voice by</div><div>${va_chips.map((item) => `<span class="chip">${item}</span>`).join("")}</div>` : ""}
			${ p.regist_date ? `<div class="detail-label" style="margin-top: .75rem;">Release date</div><div>${formatDateDisplay(p.regist_date)}</div>` : ""}
			${ p.update_date ? `<div class="detail-label" style="margin-top: .75rem;">Updated date</div><div>${formatDateDisplay(p.update_date)}</div>` : ""}
		</div>
	`;

	detailsHtml += p.product_intro ? `<div class="detail-group"><div class="detail-label">Introduction</div><p class="product-intro">${safeText(p.product_intro).replaceAll('\n', '<br>')}</p></div>` : "";

	const DownloadLinks = entry.content?.downloadLinks || [];

	if (DownloadLinks.length) {
		detailsHtml += `
			<div class="detail-group">
				<div class="detail-label">Download Links</div>
				<div class="detail-list" style="margin-top: 10px;">
					${DownloadLinks.map((link) => `<div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
						<a class="inline-link" href="#" data-open-link="${link.link}">${link.typename}</a>
							<button class="add-to-queue-btn ghost-button" data-product-name="${safeText(p.product_name)}" data-product-id="${safeText(p.product_id)}" data-link="${link.link}" data-typename="${link.typename}" data-image="${p.product_image || (p.product_image_samples && p.product_image_samples[0]) || ''}" type="button" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">+ Queue</button>
					</div>`).join("")}
				</div>
			</div>
		`;
	}

	const productUrl = p.url || entry.content?.productLink || null;
	const erovoiceUrl = entry.links?.find((l) => l.rel === "alternate")?.href || null;

	if (productUrl || erovoiceUrl) {
		detailsHtml += `
			<div class="detail-group">
				<div class="detail-label">More Links</div>
				<div class="detail-list" style="margin-top: 10px;">
					${productUrl ? `<div><a class="inline-link" href="#" data-open-link="${productUrl}">Product Page</a></div>` : ""}
					${erovoiceUrl ? `<div><a class="inline-link" href="#" data-open-link="${erovoiceUrl}">Erovoice Entry</a></div>` : ""}
				</div>
			</div>
		`;
	}

	if (elements.detailsContent) {
		elements.detailsContent.innerHTML = detailsHtml;
		bindPreviewImages(elements.detailsContent, p.product_name || "Image Preview");
	}
	if (elements.detailsModalContent) {
		elements.detailsModalContent.innerHTML = detailsHtml;
		bindPreviewImages(elements.detailsModalContent, p.product_name || "Image Preview");
	}

	// initialize any slideshows inside the details containers
	[elements.detailsContent, elements.detailsModalContent].filter(Boolean).forEach((container) => initSlideshow(container));

	// Attach link handlers for any data-open-link anchors in details containers
	const detailContainers = [elements.detailsContent, elements.detailsModalContent].filter(Boolean);
	detailContainers.forEach((container) => {
		container.querySelectorAll("[data-open-link]").forEach((link) => {
			link.addEventListener("click", async (event) => {
				event.preventDefault();
				await window.erodusAPI.openExternalLink(link.dataset.openLink);
			});
		});

		// Attach queue button handlers
		bindQueueButtons(container);
	});
}

// Simple slideshow initializer for a container element
function initSlideshow(container) {
	if (!container) return;
	const slideshow = container.querySelector('.slideshow');
	if (!slideshow) return;

	const imgs = Array.from(slideshow.querySelectorAll('img'));
	if (!imgs.length) return;

	// add controls if not present
	if (!slideshow.querySelector('.slideshow-controls')) {
		const controls = document.createElement('div');
		controls.className = 'slideshow-controls';
		const prev = document.createElement('button');
		prev.type = 'button'; prev.className = 'slide-prev'; prev.textContent = '◀';
		const next = document.createElement('button');
		next.type = 'button'; next.className = 'slide-next'; next.textContent = '▶';
		controls.appendChild(prev);
		controls.appendChild(next);
		slideshow.appendChild(controls);

		const indicatorRow = document.createElement('div');
		indicatorRow.className = 'indicator-row';
		imgs.forEach(() => {
			const ind = document.createElement('div');
			ind.className = 'indicator';
			indicatorRow.appendChild(ind);
		});
		slideshow.appendChild(indicatorRow);
	}

	let current = 0;
	const indicators = Array.from(slideshow.querySelectorAll('.indicator'));

	function show(index) {
		index = (index + imgs.length) % imgs.length;
		imgs.forEach((img, i) => img.classList.toggle('is-active', i === index));
		indicators.forEach((ind, i) => ind.classList.toggle('is-active', i === index));
		current = index;
	}

	show(0);

	const btnPrev = slideshow.querySelector('.slide-prev');
	const btnNext = slideshow.querySelector('.slide-next');

	if (btnPrev) btnPrev.addEventListener('click', () => show(current - 1));
	if (btnNext) btnNext.addEventListener('click', () => show(current + 1));

	// allow clicking indicators to jump
	indicators.forEach((ind, i) => ind.addEventListener('click', () => show(i)));
}

// Normalize product data from different API sources (FANZA vs DLSite)
function normalizeProduct(productData) {
	if (!productData) return {};
	let site = "unknown";
	if (productData.cid || (productData.url && productData.url.includes("dmm.co.jp"))) {
		site = "FANZA";
	} else if (productData.product_id || (productData.url && productData.url.includes("dlsite.com"))) {
		site = "DLSite";
	}

	return {
		product_id: productData.product_id || productData.cid || null,
		product_name: productData.product_name || productData.title || null,
		product_alt_name: productData.product_alt_name || null,
		product_intro: productData.product_intro || productData.description || null,
		product_image: productData.product_image?.url || productData.image || null,
		product_image_samples: Array.isArray(productData.product_image_samples) ? productData.product_image_samples.map(s => s.url).filter(Boolean) : [],
		product_price: productData.product_price || productData.price || null,
		product_official_price: productData.product_official_price || null,
		circle_id: productData.circle_id || null,
		maker_id: productData.maker_id || null,
		maker_name: productData.maker_name || null,
		created_by: productData.created_by || null,
		scenario_by: productData.scenario_by || null,
		illust_by: productData.illust_by || null,
		voice_by: productData.voice_by || productData.voice_actor || [],
		genres: productData.genres || productData.genre_tag || [],
		update_date: productData.update_date || null,
		regist_date: productData.regist_date || productData.release_date || null,
		url: productData.url || null,
		site: site,
		subject: productData.subject || null,
		file_size: productData.file_size || productData.filesize || null,
	}
}

// Render product data in the search result area (main content when searching for a product)
function renderProductInSearchResult(productData, sourceLabel) {
	if (!productData) {
		elements.productResult.innerHTML = '<p class="empty-state">No product data loaded yet.</p>';
		return;
	}


	const p = normalizeProduct(productData);
	state.selectedProduct = productData;
	if (elements.productStatus) elements.productStatus.textContent = p.id || sourceLabel;

	const summaryRows = [];
	if (p.product_name) {
		summaryRows.push(`<div class="product-card"><div class="product-title">${safeText(p.product_name)}</div></div>`);
	}

	if (p.product_image || p.product_image_samples.length) {
		const productImages = [];
		if (p.product_image) productImages.push(p.product_image);
		if (p.product_image_samples.length) productImages.push(...p.product_image_samples);

		if (productImages.length === 1) {
			summaryRows.push(`<img class="product-image" src="${productImages[0]}" alt="${safeText(p.product_name)}">`);
		} else if (productImages.length > 1) {
			summaryRows.push(`
				<div class="slideshow">
					${productImages.map((img) => `<img class="product-image" src="${img}" alt="${safeText(p.product_name)}">`).join("")}
				</div>
			`);
		}
	}

	const genre_chips = (p.genres && p.genres.length) ? p.genres : [];
	const va_chips = (p.voice_by && p.voice_by.length) ? p.voice_by : [];

	if (genre_chips.length) {
		summaryRows.push(`
			<div class="product-card">
				<div class="detail-label">Genres</div>
				<div class="chip-row">
					${genre_chips.map((genre) => `<span class="chip">${genre}</span>`).join("")}
				</div>
			</div>
		`);
	}

	summaryRows.push(`
		<div class="product-card product-meta">
			<dl>
				${p.product_id ? `<div><dt>ID</dt><dd>${safeText(p.product_id)}</dd></div>` : ""}
				${p.product_price || p.product_official_price ? `<div><dt>Price</dt><dd>JPY ${safeText(p.product_price || p.product_official_price)}</dd></div>` : ""}
				${p.file_size ? `<div><dt>File size</dt><dd>${safeText(p.file_size)}</dd></div>` : ""}
				${p.subject ? `<div><dt>Subject</dt><dd>${safeText(p.subject)}</dd></div>` : ""}
				${p.maker_name ? `<div><dt>Maker</dt><dd>${safeText(p.maker_name)}</dd></div>` : ""}
				${p.created_by && p.created_by.length ? `<div><dt>Created by</dt><dd>${safeText(p.created_by)}</dd></div>` : ""}
				${p.scenario_by && p.scenario_by.length ? `<div><dt>Scenario by</dt><dd>${safeText(p.scenario_by)}</dd></div>` : ""}
				${p.illust_by && p.illust_by.length ? `<div><dt>Illustration by</dt><dd>${safeText(p.illust_by)}</dd></div>` : ""}
				${va_chips.length ? `<div><dt>Voice by</dt><dd>${va_chips.map((va) => `<span class="chip">${va}</span>`).join("")}</dd></div>` : ""}
				${p.regist_date ? `<div><dt>Release date</dt><dd>${formatDateDisplay(p.regist_date)}</dd></div>` : ""}
				${p.update_date ? `<div><dt>Update date</dt><dd>${formatDateDisplay(p.update_date)}</dd></div>` : ""}
			</dl>
		</div>
	`);

	if (p.product_intro){
		summaryRows.push(`
			<div class="product-card">
				<div class="detail-label">Description</div>
				<div class="product-intro">${safeText(p.product_intro).replaceAll("\n", "<br/>")}</div>
			</div>
		`);
	}
	

	if (p.url) {
		summaryRows.push(`
			<div class="product-card">
				<a class="inline-link" href="#" data-open-link="${p.url}">Open product page</a>
			</div>
		`);
	}

	elements.productResult.innerHTML = summaryRows.join("");
	initSlideshow(elements.productResult);
	bindPreviewImages(elements.productResult, p.product_name || "Image Preview");

	// Attach link handlers
	elements.productResult.querySelectorAll("[data-open-link]").forEach((link) => {
		link.addEventListener("click", async (event) => {
			event.preventDefault();
			await window.erodusAPI.openExternalLink(link.dataset.openLink);
		});
	});
}

// Queue management functions
function addToQueue(productName, productId, downloadLink, linkTypename, thumbnail) {
	const queueItem = {
		id: Date.now(),
		productName: productName || "Unknown Product",
		productId: productId || "N/A",
		link: downloadLink,
		thumbnail: thumbnail || null,
		typename: linkTypename || "Download",
		addedAt: new Date().toISOString(),
	};

	state.queue.push(queueItem);
	saveQueue();
	renderQueue();

	showToast({
		type: "success",
		title: "Added to Queue",
		message: `${linkTypename} - ${productName} added to queue.`,
	});
}

function removeFromQueue(itemId) {
	state.queue = state.queue.filter((item) => item.id !== itemId);
	saveQueue();
	renderQueue();
}

function renderQueue() {
	const queueCount = state.queue.length;
	const historyCount = state.queueHistory.length;
	const activeTab = document.querySelector(".queue-tab-btn.is-active")?.dataset.tab || "queue";
	
	if (elements.queueStatus) {
		if (activeTab === "queue") {
			elements.queueStatus.textContent = queueCount > 0 ? `${queueCount} item${queueCount !== 1 ? "s" : ""}` : "Empty";
		} else {
			elements.queueStatus.textContent = historyCount > 0 ? `${historyCount} item${historyCount !== 1 ? "s" : ""}` : "Empty";
		}
	}

	if (elements.downloadAllBtn) {
		elements.downloadAllBtn.disabled = queueCount === 0;
	}

	if (elements.clearQueueBtn) {
		elements.clearQueueBtn.disabled = queueCount === 0;
	}

	if (elements.queueBulkActions) {
		elements.queueBulkActions.style.display = queueCount > 0 ? "flex" : "none";
	}
	if (elements.queueSelectAll) {
		elements.queueSelectAll.checked = false;
	}

	if (elements.queueContent) {
		if (queueCount === 0) {
			elements.queueContent.innerHTML = '<p class="empty-state">No items in queue. Add download links from the feed or product search.</p>';
		} else {
			elements.queueContent.innerHTML = state.queue.map((item) => `
				<div class="queue-item" data-queue-id="${item.id}" style="padding: 1rem; border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.75rem; background-color: var(--surface);">
					<div style="display: flex; justify-content: space-between; align-items: start; gap: 1rem;">
						<div style="display:flex; gap:1rem; align-items:center; flex:1;">
							<input type="checkbox" class="queue-item-checkbox" data-queue-id="${item.id}" style="cursor: pointer; width: 16px; height: 16px; flex-shrink: 0;">
							${item.thumbnail ? `<img src="${item.thumbnail}" alt="thumb" style="width:64px;height:64px;object-fit:cover;border-radius:4px;">` : ''}
							<div style="flex:1;">
								<div style="font-weight: 500; margin-bottom: 0.25rem;">${safeText(item.productName)}</div>
								<div style="font-size: 0.875rem; color: var(--muted); margin-bottom: 0.5rem;">ID: ${safeText(item.productId)}</div>
								<div style="font-size: 0.875rem; color: var(--muted); margin-bottom: 0.5rem;">Type: ${safeText(item.typename)}</div>
								<div style="font-size: 0.75rem; color: var(--muted);">Added: ${formatDateDisplay(item.addedAt)}</div>
							</div>
						</div>
							<div style="display: flex; gap: .5rem; align-items: center;">
								<button class="download-item-btn primary-button" data-queue-id="${item.id}" data-link="${item.link || ''}" type="button" style="flex-shrink: 0;">Download</button>
								<button class="remove-from-queue-btn ghost-button" data-queue-id="${item.id}" type="button" style="flex-shrink: 0;">Remove</button>
							</div>
					</div>
				</div>
			`).join("");

			// Attach checkbox toggle change listeners
			const checkboxes = elements.queueContent.querySelectorAll(".queue-item-checkbox");
			checkboxes.forEach((cb) => {
				cb.addEventListener("change", () => {
					const allChecked = Array.from(checkboxes).every((c) => c.checked);
					if (elements.queueSelectAll) elements.queueSelectAll.checked = allChecked;
				});
			});

			// Attach remove button listeners
			elements.queueContent.querySelectorAll(".remove-from-queue-btn").forEach((btn) => {
				btn.addEventListener("click", () => {
					removeFromQueue(Number(btn.dataset.queueId));
				});
			});

			// Attach per-item download button listeners
			elements.queueContent.querySelectorAll('.download-item-btn').forEach((btn) => {
				btn.addEventListener('click', async (event) => {
					event.preventDefault();
					const id = Number(btn.dataset.queueId);
					const link = btn.dataset.link;
					if (!link) {
						showToast({ type: 'error', title: 'No link', message: 'No link available for this item.' });
						return;
					}
					btn.disabled = true;
					let urlToOpen = link;
					if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(urlToOpen)) urlToOpen = `https://${urlToOpen}`;
					try {
						await window.erodusAPI.openExternalLink(urlToOpen);
						// on success, move item to history and remove from queue
						const item = state.queue.find((q) => q.id === id);
						if (item) {
							state.queueHistory.push({ ...item, downloadedAt: new Date().toISOString() });
							if (state.queueHistory.length > 100) state.queueHistory = state.queueHistory.slice(-100);
							saveHistory();
							removeFromQueue(id);
							renderHistory();
						}
						showToast({ type: 'success', title: 'Opened', message: 'Link opened and added to history.' });
					} catch (err) {
						showToast({ type: 'error', title: 'Open failed', message: String(err) });
					} finally {
						btn.disabled = false;
					}
				});
			});
		}
	}

	// Update feed badges in real-time
	if (state.feedEntries) {
		renderFeedResults(state.feedEntries);
	}
}

async function downloadAllQueue() {
	if (state.queue.length === 0) {
		showToast({
			type: "warning",
			title: "Queue Empty",
			message: "There are no items in the queue to download.",
		});
		return;
	}

	const queueItems = state.queue.slice();
	if (!queueItems.length) {
		showToast({ type: "warning", title: "Queue Empty", message: "There are no valid links in the queue." });
		return;
	}

	const failed = [];
	const succeeded = [];

	for (const item of queueItems) {
		const originalLink = item.link;
		if (!originalLink) {
			failed.push({ item, error: 'Missing link' });
			continue;
		}

		// Ensure link looks like a URL; if not, try to prefix with https://
		let urlToOpen = originalLink;
		if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(urlToOpen)) {
			urlToOpen = `https://${urlToOpen}`;
		}

		try {
			// open link but don't let one failure stop the rest
			await window.erodusAPI.openExternalLink(urlToOpen);
			succeeded.push(item);
			// small pause to avoid overwhelming the OS / default browser
			await new Promise((res) => setTimeout(res, 150));
		} catch (err) {
			failed.push({ item, error: err?.message || String(err) });
		}
	}

	// Move only succeeded items into history
	if (succeeded.length) {
		state.queueHistory.push(
			...succeeded.map((it) => ({ ...it, downloadedAt: new Date().toISOString() }))
		);
		if (state.queueHistory.length > 100) {
			state.queueHistory = state.queueHistory.slice(-100);
		}
		saveHistory();
	}

	// Keep queue items that failed (so user can retry), remove succeeded ones
	state.queue = state.queue.filter((item) => !succeeded.find((s) => s.id === item.id));
	saveQueue();
	renderQueue();
	renderHistory();

	if (failed.length === 0) {
		showToast({ type: "success", title: "Downloads Started", message: `${succeeded.length} link${succeeded.length !== 1 ? "s" : ""} opened in your default browser.` });
	} else if (succeeded.length === 0) {
		showToast({ type: "error", title: "Download Failed", message: `Failed to open ${failed.length} link${failed.length !== 1 ? "s" : ""}.` });
	} else {
		showToast({ type: "warning", title: "Partial Success", message: `${succeeded.length} opened, ${failed.length} failed.` });
	}
}

function clearQueue() {
	if (state.queue.length === 0) return;

	state.queue = [];
	saveQueue();
	renderQueue();

	showToast({
		type: "info",
		title: "Queue Cleared",
		message: "All items have been removed from the queue.",
	});
}

function renderHistory() {
	const query = (elements.historySearchInput?.value || "").trim().toLowerCase();
	const dateMinVal = elements.historyDateMin?.value;
	const dateMaxVal = elements.historyDateMax?.value;
	const dateMin = dateMinVal ? new Date(dateMinVal + 'T00:00:00') : null;
	const dateMax = dateMaxVal ? new Date(dateMaxVal + 'T23:59:59') : null;

	const filteredHistory = (state.queueHistory || []).filter((item) => {
		if (query) {
			const matchesTitle = item.productName && item.productName.toLowerCase().includes(query);
			const matchesId = item.productId && item.productId.toLowerCase().includes(query);
			if (!matchesTitle && !matchesId) return false;
		}
		if (dateMin && item.downloadedAt) {
			const downloadDate = new Date(item.downloadedAt);
			if (downloadDate < dateMin) return false;
		}
		if (dateMax && item.downloadedAt) {
			const downloadDate = new Date(item.downloadedAt);
			if (downloadDate > dateMax) return false;
		}
		return true;
	});

	const historyCount = state.queueHistory.length;
	const queueCount = state.queue.length;
	const activeTab = document.querySelector(".queue-tab-btn.is-active")?.dataset.tab || "queue";
	
	if (elements.historyStatus) {
		if (activeTab === "history") {
			elements.historyStatus.textContent = filteredHistory.length > 0 ? `${filteredHistory.length} item${filteredHistory.length !== 1 ? "s" : ""}` : "Empty";
		} else {
			elements.historyStatus.textContent = queueCount > 0 ? `${queueCount} item${queueCount !== 1 ? "s" : ""}` : "Empty";
		}
	}

	if (elements.clearHistoryBtn) {
		elements.clearHistoryBtn.disabled = historyCount === 0;
	}

	if (elements.historyFilterBar) {
		elements.historyFilterBar.style.display = historyCount > 0 ? "flex" : "none";
	}

	if (elements.historyBulkActions) {
		elements.historyBulkActions.style.display = filteredHistory.length > 0 ? "flex" : "none";
	}
	if (elements.historySelectAll) {
		elements.historySelectAll.checked = false;
	}

	if (elements.historyContent) {
		if (filteredHistory.length === 0) {
			elements.historyContent.innerHTML = historyCount === 0 
				? '<p class="empty-state">Downloaded items will appear here.</p>'
				: '<p class="empty-state">No matching history records found.</p>';
		} else {
			// render history sorted by downloadedAt descending (newest first)
			const sortedHistory = filteredHistory.slice().sort((a, b) => {
				const da = new Date(a.downloadedAt || 0).getTime();
				const db = new Date(b.downloadedAt || 0).getTime();
				return db - da;
			});
			elements.historyContent.innerHTML = sortedHistory.map((item) => `
				<div class="history-item" style="padding: 1rem; border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.75rem; background-color: var(--surface); display: flex; justify-content: space-between; gap: 1rem; align-items: start;">
					<div style="display:flex; gap:1rem; align-items:center; flex:1;">
						<input type="checkbox" class="history-item-checkbox" data-history-id="${item.id}" style="cursor: pointer; width: 16px; height: 16px; flex-shrink: 0;">
						${item.thumbnail ? `<img src="${item.thumbnail}" alt="thumb" style="width:64px;height:64px;object-fit:cover;border-radius:4px;">` : ''}
						<div style="flex: 1;">
							<div style="font-weight: 500; margin-bottom: 0.25rem;">${safeText(item.productName)}</div>
							<div style="font-size: 0.875rem; color: var(--muted); margin-bottom: 0.5rem;">ID: ${safeText(item.productId)}</div>
							<div style="font-size: 0.875rem; color: var(--muted); margin-bottom: 0.5rem;">Type: ${safeText(item.typename)}</div>
							<div style="font-size: 0.75rem; color: var(--muted);">Downloaded: ${formatDateDisplay(item.downloadedAt)}</div>
						</div>
					</div>
					<div style="flex-shrink: 0; display:flex; flex-direction: column; gap: .5rem; align-items: flex-end;">
						<button class="retry-history-btn ghost-button" data-history-id="${item.id}" data-link="${item.link || ''}" type="button" style="font-size: 0.85rem; padding: 0.35rem 0.6rem;">Retry</button>
					</div>
				</div>
			`).join("");

			// Attach checkbox toggle change listeners
			const checkboxes = elements.historyContent.querySelectorAll(".history-item-checkbox");
			checkboxes.forEach((cb) => {
				cb.addEventListener("change", () => {
					const allChecked = Array.from(checkboxes).every((c) => c.checked);
					if (elements.historySelectAll) elements.historySelectAll.checked = allChecked;
				});
			});

			// attach retry handlers for history items
			elements.historyContent.querySelectorAll('.retry-history-btn').forEach((btn) => {
				btn.addEventListener('click', async (event) => {
					event.preventDefault();
					const link = btn.dataset.link;
					if (!link) {
						showToast({ type: 'error', title: 'No link', message: 'No link available to retry.' });
						return;
					}
					let urlToOpen = link;
					if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(urlToOpen)) urlToOpen = `https://${urlToOpen}`;
					try {
						await window.erodusAPI.openExternalLink(urlToOpen);
						showToast({ type: 'success', title: 'Opened', message: 'Link opened in your browser.' });
					} catch (err) {
						showToast({ type: 'error', title: 'Open failed', message: String(err) });
					}
				});
			});
		}
	}

	// Update feed badges in real-time
	if (state.feedEntries) {
		renderFeedResults(state.feedEntries);
	}
}

function switchQueueTab(tabName) {
	// Update tab buttons
	elements.queueTabBtns.forEach((btn) => {
		btn.classList.toggle("is-active", btn.dataset.tab === tabName);
		if (btn.dataset.tab === tabName) {
			btn.style.color = "var(--text)";
			btn.style.borderBottomColor = "var(--accent)";
		} else {
			btn.style.color = "var(--muted)";
			btn.style.borderBottomColor = "transparent";
		}
	});

	// Update tab content visibility
	elements.queueTabContents.forEach((content) => {
		if (content.dataset.tabContent === tabName) {
			content.style.display = "block";
			content.classList.add("is-active");
		} else {
			content.style.display = "none";
			content.classList.remove("is-active");
		}
	});

	// Update status label
	if (tabName === "queue") {
		const queueCount = state.queue.length;
		if (elements.queueStatus) {
			elements.queueStatus.textContent = queueCount > 0 ? `${queueCount} item${queueCount !== 1 ? "s" : ""}` : "Empty";
		}
	} else {
		const historyCount = state.queueHistory.length;
		if (elements.historyStatus) {
			elements.historyStatus.textContent = historyCount > 0 ? `${historyCount} item${historyCount !== 1 ? "s" : ""}` : "Empty";
		}
	}
}

function clearHistory() {
	if (state.queueHistory.length === 0) return;

	state.queueHistory = [];
	saveHistory();
	renderHistory();

	showToast({
		type: "info",
		title: "History Cleared",
		message: "Queue history has been cleared.",
	});
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
	state.isLoadingMore = false;
	state.hasMoreFeed = true;
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
		// reset start index for initial fresh feed load
		state.currentStartIndex = Number(filters.startIndex) || 1;

		const fetchFilters = { ...filters, startIndex: state.currentStartIndex };
		const parsedEntries = await doFetch(fetchFilters);

		state.feedEntries = parsedEntries;
		renderFeedResults(state.feedEntries || []);
		elements.feedStatus.textContent = `${state.feedEntries.length} items`;

		// show or hide load-more button / sentinel
		const step = Number(filters.maxResults) || 20;
		const moreAvailable = parsedEntries.length >= step;
		state.hasMoreFeed = moreAvailable;
		if (elements.feedLoadMoreContainer) {
			elements.feedLoadMoreContainer.style.display = moreAvailable ? "block" : "none";
			if (elements.feedLoadMoreBtn) {
				elements.feedLoadMoreBtn.textContent = "Load more";
				elements.feedLoadMoreBtn.disabled = false;
			}
		}

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
	if (state.isLoadingMore || !state.hasMoreFeed) return;
	state.isLoadingMore = true;

	const filters = getFeedFiltersFromForm();
	const step = Number(filters.maxResults) || 20;
	state.currentStartIndex = (state.currentStartIndex || Number(filters.startIndex) || 1) + step;

	if (elements.feedLoadMoreBtn) {
		elements.feedLoadMoreBtn.textContent = "Loading more...";
		elements.feedLoadMoreBtn.disabled = true;
	}

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

		if (newEntries.length > 0) {
			state.feedEntries = (state.feedEntries || []).concat(newEntries);
			renderFeedResults(state.feedEntries || []);
			elements.feedStatus.textContent = `${state.feedEntries.length} items`;
		}

		const moreAvailable = newEntries.length >= step;
		state.hasMoreFeed = moreAvailable;
		if (elements.feedLoadMoreContainer) {
			elements.feedLoadMoreContainer.style.display = moreAvailable ? "block" : "none";
		}
	} catch (error) {
		console.error("Auto load more error:", error);
	} finally {
		state.isLoadingMore = false;
		if (elements.feedLoadMoreBtn) {
			elements.feedLoadMoreBtn.textContent = "Load more";
			elements.feedLoadMoreBtn.disabled = false;
		}
	}
}

// This function parses the raw HTML content from the feed entry 
// to extract structured metadata like image, circle, release date, 
// voice actor, file size, download links, and product info. 
// The feed content is not guaranteed to be consistent, so this 
// function uses regex patterns and heuristics to pull out relevant information.
//
// Note: This function is a copy from the Backend Erovoice Handler for fast access
// in the renderer without needing to round-trip through IPC for parsing feed content.
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
			try {
				const product = await window.erodusAPI.getFanzaProductInfo(rawValue);
				renderProductInSearchResult(product, "FANZA / DMM");
				elements.productStatus.textContent = product?.cid || rawValue;
			} catch (error) {
				console.log("FANZA search failed, trying Erovoice fallback", error);
				elements.productStatus.textContent = "FANZA failed, searching Erovoice...";
				try {
					const response = await window.erodusAPI.searchErovoice({ query: rawValue, maxResults: 1 });
					const rawEntry = response?.feed?.entry?.[0];
					if (rawEntry) {
						const entry = {
							id: rawEntry.id?.$t || null,
							published: rawEntry.published?.$t || null,
							updated: rawEntry.updated?.$t || null,
							title: rawEntry.title?.$t || null,
							content: parseFeedContent(rawEntry.content?.$t || null),
							categories: rawEntry.category?.map((cat) => cat.term) || [],
							thumbnail: rawEntry.media$thumbnail?.url || null,
							links: rawEntry.link?.map((link) => ({ rel: link.rel, type: link.type, href: link.href, title: link.title })) || [],
						};
						
						const markup = buildDetailsMarkup(entry);
						const noticeHtml = `
							<div class="regional-warning-banner" style="margin-bottom: 1rem;">
								<strong><i class="fas fa-exclamation-triangle"></i> Notice:</strong> Failed to fetch FANZA / DMM details (This item might be restricted by Japan regional block. You may need a VPN connected to Japan to access FANZA info). Falling back to Erovoice API info.
							</div>
						`;
						elements.productResult.innerHTML = noticeHtml + markup;
						elements.productStatus.textContent = `Erovoice Fallback: ${rawValue}`;
						
						// Attach link handlers for the fallback markup
						elements.productResult.querySelectorAll("[data-open-link]").forEach((link) => {
							link.addEventListener("click", async (event) => {
								event.preventDefault();
								await window.erodusAPI.openExternalLink(link.dataset.openLink);
							});
						});
						bindQueueButtons(elements.productResult);
					} else {
						// No erovoice entry found, rethrow original error
						throw error;
					}
				} catch (fallbackError) {
					elements.productStatus.textContent = "Search failed";
					elements.productResult.innerHTML = `
						<div class="regional-warning-banner" style="margin-bottom: 1rem;">
							<strong><i class="fas fa-exclamation-triangle"></i> Notice:</strong> Failed to fetch FANZA / DMM details (This item might be restricted by Japan regional block. You may need a VPN connected to Japan to access FANZA info).
						</div>
						<p class="empty-state">${safeText(error.message || error)}</p>
					`;
				}
			}
			return;
		}

		if (normalized.startsWith("rj") || normalized.startsWith("vj")) {
			try {
				const product = await window.erodusAPI.getDlsiteProductInfo(rawValue);
				renderProductInSearchResult(product, "DLSite");
				elements.productStatus.textContent = product?.product_id || rawValue;
			} catch (error) {
				console.log("DLSite search failed, trying Erovoice fallback", error);
				elements.productStatus.textContent = "DLSite failed, searching Erovoice...";
				try {
					const response = await window.erodusAPI.searchErovoice({ query: rawValue, maxResults: 1 });
					const rawEntry = response?.feed?.entry?.[0];
					if (rawEntry) {
						const entry = {
							id: rawEntry.id?.$t || null,
							published: rawEntry.published?.$t || null,
							updated: rawEntry.updated?.$t || null,
							title: rawEntry.title?.$t || null,
							content: parseFeedContent(rawEntry.content?.$t || null),
							categories: rawEntry.category?.map((cat) => cat.term) || [],
							thumbnail: rawEntry.media$thumbnail?.url || null,
							links: rawEntry.link?.map((link) => ({ rel: link.rel, type: link.type, href: link.href, title: link.title })) || [],
						};
						
						const markup = buildDetailsMarkup(entry);
						const noticeHtml = `
							<div class="regional-warning-banner" style="margin-bottom: 1rem;">
								<strong><i class="fas fa-exclamation-triangle"></i> Notice:</strong> Failed to fetch DLsite details (This item might be restricted by Japan regional block. You may need a VPN connected to Japan to access DLsite info). Falling back to Erovoice API info.
							</div>
						`;
						elements.productResult.innerHTML = noticeHtml + markup;
						elements.productStatus.textContent = `Erovoice Fallback: ${rawValue}`;
						
						// Attach link handlers for the fallback markup
						elements.productResult.querySelectorAll("[data-open-link]").forEach((link) => {
							link.addEventListener("click", async (event) => {
								event.preventDefault();
								await window.erodusAPI.openExternalLink(link.dataset.openLink);
							});
						});
						bindQueueButtons(elements.productResult);
					} else {
						// No erovoice entry found, rethrow original error
						throw error;
					}
				} catch (fallbackError) {
					elements.productStatus.textContent = "Search failed";
					elements.productResult.innerHTML = `
						<div class="regional-warning-banner" style="margin-bottom: 1rem;">
							<strong><i class="fas fa-exclamation-triangle"></i> Notice:</strong> Failed to fetch DLsite details (This item might be restricted by Japan regional block. You may need a VPN connected to Japan to access DLsite info).
						</div>
						<p class="empty-state">${safeText(error.message || error)}</p>
					`;
				}
			}
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

function updateScrollToTopBtn() {
	const scrollToTopBtn = document.getElementById("scroll-to-top-btn");
	const mainContent = document.querySelector(".main-content");
	if (!scrollToTopBtn) return;

	scrollToTopBtn.classList.toggle("is-feed-page", state.page === "feed");
	
	const currentScrollTop = (mainContent ? mainContent.scrollTop : 0) || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
	if (currentScrollTop > 150) {
		scrollToTopBtn.classList.add("is-visible");
	} else {
		scrollToTopBtn.classList.remove("is-visible");
	}
}

let feedObserver = null;
function setupInfiniteScroll() {
	if (feedObserver) {
		feedObserver.disconnect();
		feedObserver = null;
	}

	const scrollRoot = document.querySelector(".main-content");

	if ("IntersectionObserver" in window && elements.feedLoadMoreContainer) {
		feedObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting && state.hasMoreFeed && !state.isLoadingMore) {
						loadMore();
					}
				}
			},
			{
				root: scrollRoot || null,
				rootMargin: "350px",
				threshold: 0.05,
			}
		);
		feedObserver.observe(elements.feedLoadMoreContainer);
	}

	const onScrollHandler = () => {
		updateScrollToTopBtn();
		if (state.isLoadingMore || !state.hasMoreFeed) return;
		const container = scrollRoot || document.documentElement;
		const threshold = 350;
		if (container.scrollHeight - container.scrollTop - container.clientHeight < threshold) {
			loadMore();
		}
	};

	// Listen on both main-content and window to catch all scrolling contexts
	if (scrollRoot) {
		scrollRoot.removeEventListener("scroll", onScrollHandler);
		scrollRoot.addEventListener("scroll", onScrollHandler, { passive: true });
	}
	window.removeEventListener("scroll", onScrollHandler);
	window.addEventListener("scroll", onScrollHandler, { passive: true });
}

function bindEvents() {
	elements.navItems.forEach((item) => {
		item.addEventListener("click", () => setPage(item.dataset.page));
	});

	// Scroll-to-top floating button
	const scrollToTopBtn = document.getElementById("scroll-to-top-btn");
	if (scrollToTopBtn) {
		scrollToTopBtn.addEventListener("click", () => {
			const mainContent = document.querySelector(".main-content");
			if (mainContent && mainContent.scrollTop > 0) {
				mainContent.scrollTo({ top: 0, behavior: "smooth" });
			}
			window.scrollTo({ top: 0, behavior: "smooth" });
			document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
			document.body.scrollTo({ top: 0, behavior: "smooth" });
		});
	}

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

	// Load-more button & Auto-loading infinite scroll
	if (elements.feedLoadMoreBtn) {
		elements.feedLoadMoreBtn.addEventListener('click', loadMore);
	}
	setupInfiniteScroll();

	elements.productSearchForm.addEventListener("submit", async (event) => {
		event.preventDefault();
		await searchProduct();
	});

	elements.themeButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const choice = button.dataset.themeChoice;
			if (choice in defaultThemes) {
				applyTheme(choice);
			} else if (choice === "custom") {
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

	if (elements.imageModalCloseBtn) {
		elements.imageModalCloseBtn.addEventListener("click", closeImageModal);
	}

	if (elements.imageModalOverlay) {
		elements.imageModalOverlay.addEventListener("click", closeImageModal);
	}

	if (elements.imageModalPrevBtn) {
		elements.imageModalPrevBtn.addEventListener("click", () => shiftImage(-1));
	}

	if (elements.imageModalNextBtn) {
		elements.imageModalNextBtn.addEventListener("click", () => shiftImage(1));
	}

	if (elements.imageModalZoomInBtn) {
		elements.imageModalZoomInBtn.addEventListener("click", () => zoomImage(0.25));
	}

	if (elements.imageModalZoomOutBtn) {
		elements.imageModalZoomOutBtn.addEventListener("click", () => zoomImage(-0.25));
	}

	if (elements.imageModalZoomResetBtn) {
		elements.imageModalZoomResetBtn.addEventListener("click", () => {
			state.imageViewer.scale = 1;
			state.imageViewer.x = 0;
			state.imageViewer.y = 0;
			renderImageModal();
		});
	}

	if (elements.imageModalImage) {
		elements.imageModalImage.addEventListener("pointerdown", (event) => {
			event.preventDefault();
			startImagePan(event);
		});
	}

	if (elements.imageModalStage) {
		elements.imageModalStage.addEventListener("pointerdown", (event) => {
			if (event.target === elements.imageModalStage && state.imageViewer.scale > 1) {
				event.preventDefault();
				startImagePan(event);
			}
		});
		elements.imageModalStage.addEventListener("pointermove", moveImagePan);
		elements.imageModalStage.addEventListener("pointerup", endImagePan);
		elements.imageModalStage.addEventListener("pointercancel", endImagePan);
		elements.imageModalStage.addEventListener("pointerleave", endImagePan);
		elements.imageModalStage.addEventListener("wheel", (event) => {
			if (state.imageViewer.scale <= 1) return;
			event.preventDefault();
			const zoomStep = event.deltaY > 0 ? -0.15 : 0.15;
			zoomImage(zoomStep);
		}, { passive: false });
	}

	if (elements.imageModalDownloadBtn) {
		elements.imageModalDownloadBtn.addEventListener("click", downloadCurrentImage);
	}

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			closeImageModal();
			closeDetailsModal();
			closeFilterModal();
		}
		if (event.key === "ArrowLeft" && elements.imageModal && elements.imageModal.style.display !== "none") {
			shiftImage(-1);
		}
		if (event.key === "ArrowRight" && elements.imageModal && elements.imageModal.style.display !== "none") {
			shiftImage(1);
		}
	});
	
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

	// Queue page event listeners
	if (elements.downloadAllBtn) {
		elements.downloadAllBtn.addEventListener("click", downloadAllQueue);
	}

	if (elements.clearQueueBtn) {
		elements.clearQueueBtn.addEventListener("click", clearQueue);
	}

	if (elements.clearHistoryBtn) {
		elements.clearHistoryBtn.addEventListener("click", clearHistory);
	}

	if (elements.checkUpdatesBtn) {
		elements.checkUpdatesBtn.addEventListener("click", checkForUpdates);
	}

	if (elements.downloadUpdateBtn) {
		elements.downloadUpdateBtn.addEventListener("click", downloadUpdate);
	}

	if (elements.installUpdateBtn) {
		elements.installUpdateBtn.addEventListener("click", installUpdate);
	}

	// About page static external links
	document.querySelectorAll('.page-view[data-page-view="about"] [data-open-link]').forEach((link) => {
		link.addEventListener("click", async (event) => {
			event.preventDefault();
			const url = link.dataset.openLink;
			if (!url) return;
			await window.erodusAPI.openExternalLink(url);
		});
	});

	if (window.erodusAPI.onUpdateStatus) {
		window.erodusAPI.onUpdateStatus((payload) => {
			applyUpdateState(payload || {});
		});
	}

	// Queue tab switching
	elements.queueTabBtns.forEach((btn) => {
		btn.addEventListener("click", () => {
			const tabName = btn.dataset.tab;
			switchQueueTab(tabName);
		});
	});

	// History Filters
	if (elements.historySearchInput) {
		elements.historySearchInput.addEventListener("input", () => {
			renderHistory();
		});
	}
	if (elements.historyDateMin) {
		elements.historyDateMin.addEventListener("change", () => {
			renderHistory();
		});
	}
	if (elements.historyDateMax) {
		elements.historyDateMax.addEventListener("change", () => {
			renderHistory();
		});
	}
	if (elements.historyFilterClearBtn) {
		elements.historyFilterClearBtn.addEventListener("click", () => {
			if (elements.historySearchInput) elements.historySearchInput.value = "";
			if (elements.historyDateMin) elements.historyDateMin.value = "";
			if (elements.historyDateMax) elements.historyDateMax.value = "";
			renderHistory();
		});
	}

	// Queue Bulk Operations
	if (elements.queueSelectAll) {
		elements.queueSelectAll.addEventListener("change", (e) => {
			const checked = e.target.checked;
			if (elements.queueContent) {
				elements.queueContent.querySelectorAll(".queue-item-checkbox").forEach((cb) => {
					cb.checked = checked;
				});
			}
		});
	}
	if (elements.queueDeleteSelected) {
		elements.queueDeleteSelected.addEventListener("click", () => {
			if (!elements.queueContent) return;
			const checkedCbs = elements.queueContent.querySelectorAll(".queue-item-checkbox:checked");
			if (checkedCbs.length === 0) {
				showToast({ type: "warning", title: "No Selection", message: "Please select items to delete." });
				return;
			}
			const checkedIds = Array.from(checkedCbs).map((cb) => Number(cb.dataset.queueId));
			state.queue = state.queue.filter((item) => !checkedIds.includes(item.id));
			saveQueue();
			renderQueue();
			showToast({ type: "success", title: "Deleted", message: `${checkedIds.length} items removed from queue.` });
		});
	}

	// History Bulk Operations
	if (elements.historySelectAll) {
		elements.historySelectAll.addEventListener("change", (e) => {
			const checked = e.target.checked;
			if (elements.historyContent) {
				elements.historyContent.querySelectorAll(".history-item-checkbox").forEach((cb) => {
					cb.checked = checked;
				});
			}
		});
	}
	if (elements.historyDeleteSelected) {
		elements.historyDeleteSelected.addEventListener("click", () => {
			if (!elements.historyContent) return;
			const checkedCbs = elements.historyContent.querySelectorAll(".history-item-checkbox:checked");
			if (checkedCbs.length === 0) {
				showToast({ type: "warning", title: "No Selection", message: "Please select items to delete." });
				return;
			}
			const checkedIds = Array.from(checkedCbs).map((cb) => Number(cb.dataset.historyId));
			state.queueHistory = state.queueHistory.filter((item) => !checkedIds.includes(item.id));
			saveHistory();
			renderHistory();
			showToast({ type: "success", title: "Deleted", message: `${checkedIds.length} items removed from history.` });
		});
	}

	// Initialize queue display on page load
	renderQueue();
	renderHistory();
}

function initializeThemeEditor() {
	const { themeName, customTheme } = loadStoredTheme();

	const updateCustomJsonFromPickers = () => {
		const config = {
			name: "Custom Theme",
			colors: {
				bg: elements.themeColorBg?.value || "#0a0d14",
				bgAccent: elements.themeColorBgAccent?.value || "#111827",
				surface: elements.themeColorSurface ? hexToRgba(elements.themeColorSurface.value, 0.92) : "rgba(17, 24, 39, 0.92)",
				surfaceStrong: elements.themeColorSurfaceStrong?.value || "#182033",
				text: elements.themeColorText?.value || "#ecf2ff",
				muted: elements.themeColorMuted?.value || "#9aa8c3",
				border: elements.themeColorBorder ? hexToRgba(elements.themeColorBorder.value, 0.18) : "rgba(154, 168, 195, 0.18)",
				accent: elements.themeColorAccent?.value || "#65d6c2",
				accentStrong: elements.themeColorAccentStrong?.value || "#3bb7a2"
			}
		};
		if (elements.themeJson) {
			elements.themeJson.value = JSON.stringify(config, null, 2);
		}
	};

	[
		elements.themeColorBg,
		elements.themeColorBgAccent,
		elements.themeColorSurface,
		elements.themeColorSurfaceStrong,
		elements.themeColorText,
		elements.themeColorMuted,
		elements.themeColorBorder,
		elements.themeColorAccent,
		elements.themeColorAccentStrong
	].forEach(picker => {
		picker?.addEventListener("input", updateCustomJsonFromPickers);
	});

	if (elements.applyCustomPickerBtn) {
		elements.applyCustomPickerBtn.addEventListener("click", () => {
			updateCustomJsonFromPickers();
			if (elements.themeJson) {
				try {
					applyCustomThemeFromJson(elements.themeJson.value);
				} catch (err) {
					console.error("Failed to apply custom theme from pickers:", err);
				}
			}
		});
	}

	if (customTheme) {
		elements.themeJson.value = JSON.stringify(customTheme, null, 2);
		applyTheme(themeName === "custom" ? "custom" : themeName, customTheme);
		return;
	}

	applyTheme(themeName in defaultThemes ? themeName : "dark");
}

const wallpaperConfigStorageKey = "erodus-wallpaper-config";

const defaultWallpaperConfig = {
	posX: 50,
	posY: 50,
	scale: "cover",
	blur: 0,
	darken: 0,
	sidebarBlur: 18,
	sidebarDarken: 10,
	hasWallpaper: false
};

function loadWallpaperConfig() {
	try {
		const stored = localStorage.getItem(wallpaperConfigStorageKey);
		if (stored) {
			return { ...defaultWallpaperConfig, ...JSON.parse(stored) };
		}
	} catch (e) {
		console.error("Failed to load wallpaper config:", e);
	}
	return { ...defaultWallpaperConfig };
}

function saveWallpaperConfig(config) {
	try {
		localStorage.setItem(wallpaperConfigStorageKey, JSON.stringify(config));
	} catch (e) {
		console.error("Failed to save wallpaper config:", e);
	}
}

function applySidebarConfig(config) {
	const sidebar = document.querySelector(".sidebar");
	if (!sidebar) return;
	sidebar.style.backdropFilter = `blur(${config.sidebarBlur}px)`;
	sidebar.style.webkitBackdropFilter = `blur(${config.sidebarBlur}px)`;
	sidebar.style.background = `rgba(0, 0, 0, ${config.sidebarDarken / 100})`;
}

async function applyWallpaperBackground(config) {
	const bg = document.getElementById("app-background");
	const overlay = document.getElementById("app-background-overlay");
	if (!bg || !overlay) return;

	applySidebarConfig(config);

	if (config.hasWallpaper) {
		try {
			const dataUrl = await window.erodusAPI.loadWallpaper();
			if (dataUrl) {
				bg.style.backgroundImage = `url(${dataUrl})`;
				bg.style.backgroundPosition = `${config.posX}% ${config.posY}%`;
				bg.style.backgroundSize = config.scale;
				bg.style.filter = `blur(${config.blur}px)`;
				overlay.style.opacity = config.darken / 100;
			} else {
				config.hasWallpaper = false;
				saveWallpaperConfig(config);
				bg.style.backgroundImage = "none";
				bg.style.filter = "none";
				overlay.style.opacity = 0;
			}
		} catch (err) {
			console.error("Failed to load background wallpaper:", err);
		}
	} else {
		bg.style.backgroundImage = "none";
		bg.style.filter = "none";
		overlay.style.opacity = 0;
	}
}

async function initializeWallpaper() {
	const config = loadWallpaperConfig();
	await applyWallpaperBackground(config);

	if (elements.wallpaperPosX) elements.wallpaperPosX.value = config.posX;
	if (elements.wallpaperPosY) elements.wallpaperPosY.value = config.posY;
	if (elements.wallpaperScale) elements.wallpaperScale.value = config.scale;
	if (elements.wallpaperBlur) elements.wallpaperBlur.value = config.blur;
	if (elements.wallpaperDark) elements.wallpaperDark.value = config.darken;
	if (elements.wallpaperSbBlur) elements.wallpaperSbBlur.value = config.sidebarBlur;
	if (elements.wallpaperSbDark) elements.wallpaperSbDark.value = config.sidebarDarken;

	if (elements.wallpaperValX) elements.wallpaperValX.textContent = config.posX;
	if (elements.wallpaperValY) elements.wallpaperValY.textContent = config.posY;
	if (elements.wallpaperValBlur) elements.wallpaperValBlur.textContent = config.blur;
	if (elements.wallpaperValDark) elements.wallpaperValDark.textContent = config.darken;
	if (elements.wallpaperValSbBlur) elements.wallpaperValSbBlur.textContent = config.sidebarBlur;
	if (elements.wallpaperValSbDark) elements.wallpaperValSbDark.textContent = config.sidebarDarken;

	if (config.hasWallpaper) {
		if (elements.wallpaperClearBtn) elements.wallpaperClearBtn.style.display = "inline-block";
		if (elements.wallpaperControlsPanel) elements.wallpaperControlsPanel.style.display = "flex";
		if (elements.wallpaperStatus) elements.wallpaperStatus.textContent = "Custom wallpaper active";
	} else {
		if (elements.wallpaperClearBtn) elements.wallpaperClearBtn.style.display = "none";
		if (elements.wallpaperControlsPanel) elements.wallpaperControlsPanel.style.display = "none";
		if (elements.wallpaperStatus) elements.wallpaperStatus.textContent = "No wallpaper imported";
	}

	const updateLiveStyles = () => {
		const bg = document.getElementById("app-background");
		const overlay = document.getElementById("app-background-overlay");
		if (!bg || !overlay) return;

		const current = {
			posX: elements.wallpaperPosX ? Number(elements.wallpaperPosX.value) : 50,
			posY: elements.wallpaperPosY ? Number(elements.wallpaperPosY.value) : 50,
			scale: elements.wallpaperScale ? elements.wallpaperScale.value : "cover",
			blur: elements.wallpaperBlur ? Number(elements.wallpaperBlur.value) : 0,
			darken: elements.wallpaperDark ? Number(elements.wallpaperDark.value) : 0,
			sidebarBlur: elements.wallpaperSbBlur ? Number(elements.wallpaperSbBlur.value) : 18,
			sidebarDarken: elements.wallpaperSbDark ? Number(elements.wallpaperSbDark.value) : 10,
			hasWallpaper: config.hasWallpaper
		};

		bg.style.backgroundPosition = `${current.posX}% ${current.posY}%`;
		bg.style.backgroundSize = current.scale;
		bg.style.filter = `blur(${current.blur}px)`;
		overlay.style.opacity = current.darken / 100;
		applySidebarConfig(current);

		if (elements.wallpaperValX) elements.wallpaperValX.textContent = current.posX;
		if (elements.wallpaperValY) elements.wallpaperValY.textContent = current.posY;
		if (elements.wallpaperValBlur) elements.wallpaperValBlur.textContent = current.blur;
		if (elements.wallpaperValDark) elements.wallpaperValDark.textContent = current.darken;
		if (elements.wallpaperValSbBlur) elements.wallpaperValSbBlur.textContent = current.sidebarBlur;
		if (elements.wallpaperValSbDark) elements.wallpaperValSbDark.textContent = current.sidebarDarken;

		saveWallpaperConfig(current);
	};

	[
		elements.wallpaperPosX,
		elements.wallpaperPosY,
		elements.wallpaperBlur,
		elements.wallpaperDark,
		elements.wallpaperSbBlur,
		elements.wallpaperSbDark
	].forEach(el => {
		el?.addEventListener("input", updateLiveStyles);
	});

	elements.wallpaperScale?.addEventListener("change", updateLiveStyles);

	elements.wallpaperImportBtn?.addEventListener("click", () => {
		elements.wallpaperFileInput?.click();
	});

	elements.wallpaperFileInput?.addEventListener("change", (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = async (event) => {
			const dataUrl = event.target?.result;
			if (!dataUrl) return;

			const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
			const base64Data = dataUrl.split(",")[1];

			try {
				if (elements.wallpaperStatus) elements.wallpaperStatus.textContent = "Saving wallpaper...";
				const result = await window.erodusAPI.saveWallpaper({ base64Data, extension });
				if (result?.success) {
					config.hasWallpaper = true;
					saveWallpaperConfig(config);
					await applyWallpaperBackground(config);

					if (elements.wallpaperClearBtn) elements.wallpaperClearBtn.style.display = "inline-block";
					if (elements.wallpaperControlsPanel) elements.wallpaperControlsPanel.style.display = "flex";
					if (elements.wallpaperStatus) elements.wallpaperStatus.textContent = "Custom wallpaper active";
					showToast({ type: "success", title: "Wallpaper Imported", message: "Wallpaper successfully updated." });
				}
			} catch (err) {
				console.error("Failed to save wallpaper:", err);
				if (elements.wallpaperStatus) elements.wallpaperStatus.textContent = "Import failed";
				showToast({ type: "error", title: "Import Failed", message: err?.message || String(err) });
			}
		};
		reader.readAsDataURL(file);
	});

	elements.wallpaperClearBtn?.addEventListener("click", async () => {
		try {
			if (elements.wallpaperStatus) elements.wallpaperStatus.textContent = "Removing wallpaper...";
			const result = await window.erodusAPI.clearWallpaper();
			if (result?.success) {
				config.hasWallpaper = false;
				config.posX = 50;
				config.posY = 50;
				config.scale = "cover";
				config.blur = 0;
				config.darken = 0;
				config.sidebarBlur = 18;
				config.sidebarDarken = 10;
				saveWallpaperConfig(config);
				await applyWallpaperBackground(config);

				if (elements.wallpaperPosX) elements.wallpaperPosX.value = 50;
				if (elements.wallpaperPosY) elements.wallpaperPosY.value = 50;
				if (elements.wallpaperScale) elements.wallpaperScale.value = "cover";
				if (elements.wallpaperBlur) elements.wallpaperBlur.value = 0;
				if (elements.wallpaperDark) elements.wallpaperDark.value = 0;
				if (elements.wallpaperSbBlur) elements.wallpaperSbBlur.value = 18;
				if (elements.wallpaperSbDark) elements.wallpaperSbDark.value = 10;

				if (elements.wallpaperValX) elements.wallpaperValX.textContent = 50;
				if (elements.wallpaperValY) elements.wallpaperValY.textContent = 50;
				if (elements.wallpaperValBlur) elements.wallpaperValBlur.textContent = 0;
				if (elements.wallpaperValDark) elements.wallpaperValDark.textContent = 0;
				if (elements.wallpaperValSbBlur) elements.wallpaperValSbBlur.textContent = 18;
				if (elements.wallpaperValSbDark) elements.wallpaperValSbDark.textContent = 10;

				if (elements.wallpaperClearBtn) elements.wallpaperClearBtn.style.display = "none";
				if (elements.wallpaperControlsPanel) elements.wallpaperControlsPanel.style.display = "none";
				if (elements.wallpaperStatus) elements.wallpaperStatus.textContent = "No wallpaper imported";
				if (elements.wallpaperFileInput) elements.wallpaperFileInput.value = "";
				showToast({ type: "success", title: "Wallpaper Removed", message: "App background reset." });
			}
		} catch (err) {
			console.error("Failed to clear wallpaper:", err);
			showToast({ type: "error", title: "Action Failed", message: err?.message || String(err) });
		}
	});
}

window.addEventListener("DOMContentLoaded", async () => {
	initializeThemeEditor();
	initializeWallpaper();
	applyUpdateState();
	await loadAppInfo();
	loadQueue();
	loadHistory();
	bindEvents();
	setPage("feed");
	await loadCategories();
	await loadFeed();
});
