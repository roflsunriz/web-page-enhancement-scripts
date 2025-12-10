import {
	mdiBookOpenPageVariant,
	mdiCommentOutline,
	mdiClose,
	mdiContentCopy,
	mdiContentSave,
	mdiDownload,
	mdiFlash,
	mdiMonitor,
	mdiPalette,
	mdiLabelOutline,
	mdiFormatTitle,
	mdiAccountCircleOutline,
	mdiEyeOutline,
	mdiCommentTextOutline,
	mdiPlaylistStar,
	mdiCalendarClockOutline,
	mdiPlay,
	mdiRefresh,
	mdiTimerSandEmpty,
	mdiLock,
	mdiStar,
	mdiCommentText,
	mdiAlertOctagon,
	mdiCheck,
	mdiCheckCircle,
	mdiAlertCircle,
	mdiAlert,
	mdiInformationOutline,
	mdiSync,
} from "@mdi/js";

export function renderMdiSvg(pathD: string, size: number = 24): string {
	const width = String(size);
	const height = String(size);
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${pathD}"></path></svg>`;
}

export const svgDownload: string = renderMdiSvg(mdiDownload);
export const svgSave: string = renderMdiSvg(mdiContentSave);
export const svgProcessing: string = renderMdiSvg(mdiTimerSandEmpty);
export const svgBookOpen: string = renderMdiSvg(mdiBookOpenPageVariant);
export const svgPlay: string = renderMdiSvg(mdiPlay);
export const svgRefresh: string = renderMdiSvg(mdiRefresh);
export const svgMonitor: string = renderMdiSvg(mdiMonitor);
export const svgContentCopy: string = renderMdiSvg(mdiContentCopy);
export const svgFlash: string = renderMdiSvg(mdiFlash);
export const svgClose: string = renderMdiSvg(mdiClose);
export const svgPalette: string = renderMdiSvg(mdiPalette);
export const svgLock: string = renderMdiSvg(mdiLock);
export const svgComment: string = renderMdiSvg(mdiCommentOutline);
export const svgVideoId: string = renderMdiSvg(mdiLabelOutline);
export const svgVideoTitle: string = renderMdiSvg(mdiFormatTitle);
export const svgVideoOwner: string = renderMdiSvg(mdiAccountCircleOutline);
export const svgViewCount: string = renderMdiSvg(mdiEyeOutline);
export const svgCommentCount: string = renderMdiSvg(mdiCommentTextOutline);
export const svgMylistCount: string = renderMdiSvg(mdiPlaylistStar);
export const svgPostedAt: string = renderMdiSvg(mdiCalendarClockOutline);
export const svgCommentText: string = renderMdiSvg(mdiCommentText);
export const svgStar: string = renderMdiSvg(mdiStar);

// スパム報告用アイコン
export const svgAlertOctagon: string = renderMdiSvg(mdiAlertOctagon);
export const svgCheck: string = renderMdiSvg(mdiCheck);
export const svgCheckCircle: string = renderMdiSvg(mdiCheckCircle);
export const svgAlertCircle: string = renderMdiSvg(mdiAlertCircle);
export const svgAlert: string = renderMdiSvg(mdiAlert);
export const svgInformation: string = renderMdiSvg(mdiInformationOutline);
export const svgSync: string = renderMdiSvg(mdiSync);
