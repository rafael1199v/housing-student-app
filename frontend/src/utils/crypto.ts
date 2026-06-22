import { PASSWORD_PUBLIC_KEY } from "../config/constants";

function base64ToArrayBuffer(base64: string): ArrayBuffer {
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes.buffer;
}

function bytesToBase64(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	let binary = "";
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}

let publicKeyPromise: Promise<CryptoKey> | null = null;

function importPublicKey(): Promise<CryptoKey> {
	if (publicKeyPromise) {
		return publicKeyPromise;
	}

	if (!PASSWORD_PUBLIC_KEY) {
		throw new Error("VITE_PASSWORD_PUBLIC_KEY is not configured.");
	}

	// Accept either a bare base64 SPKI body or a full PEM block.
	const spkiBase64 = PASSWORD_PUBLIC_KEY.replace(
		/-----[^-]+-----/g,
		"",
	).replace(/\s+/g, "");

	publicKeyPromise = crypto.subtle.importKey(
		"spki",
		base64ToArrayBuffer(spkiBase64),
		{ name: "RSA-OAEP", hash: "SHA-256" },
		false,
		["encrypt"],
	);

	return publicKeyPromise;
}

export async function encryptPassword(plain: string): Promise<string> {
	const key = await importPublicKey();
	const ciphertext = await crypto.subtle.encrypt(
		{ name: "RSA-OAEP" },
		key,
		new TextEncoder().encode(plain),
	);
	return bytesToBase64(ciphertext);
}
