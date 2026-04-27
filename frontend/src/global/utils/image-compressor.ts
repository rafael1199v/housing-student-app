import imageCompression from "browser-image-compression";

const COMPRESSION_OPTIONS = {
	maxSizeMB: 1,
	maxWidthOrHeight: 1920,
	useWebWorker: true,
	fileType: "image/webp",
};

export async function compressImages(files: File[]): Promise<File[]> {
	return Promise.all(
		files.map((f) => imageCompression(f, COMPRESSION_OPTIONS)),
	);
}
