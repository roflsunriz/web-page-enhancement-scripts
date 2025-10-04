import { mdiContentSave, mdiDownload, mdiTimerSandEmpty } from "@mdi/js";

export function renderMdiSvg(pathD: string, size: number = 24): string {
	const width = String(size);
	const height = String(size);
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${pathD}"></path></svg>`;
}

export const svgDownload: string = renderMdiSvg(mdiDownload);
export const svgSave: string = renderMdiSvg(mdiContentSave);
export const svgProcessing: string = renderMdiSvg(mdiTimerSandEmpty);


