import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://aidlink-jhur.onrender.com";

/**
 * Step 1: Get secure Cloudinary signature configurations from the backend
 */
export async function getCloudinarySignature(token: string) {
  const response = await axios.get(
    `${API_BASE_URL}/payments/cloudinary-signature`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data; // { signature, timestamp, apiKey, cloudName }
}

/**
 * Step 2: Upload raw file data directly from browser client view to Cloudinary
 */
export async function uploadToCloudinary(file: File, signatureData: any) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signatureData.apiKey);
  formData.append("timestamp", signatureData.timestamp);
  formData.append("signature", signatureData.signature);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
    formData,
  );
  return response.data.secure_url;
}

/**
 * Step 3: Validate the 11-digit NIN via Smile ID sandbox proxies
 */
export async function verifyNIN(nin: string, token: string) {
  const response = await axios.post(
    `${API_BASE_URL}/verification/verify-nin`,
    { nin },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
}

/**
 * Step 4: Execute the biometric face match mapping pipeline
 */
export async function verifyFaceBiometrics(
  selfieUrl: string,
  documentImageUrl: string,
  token: string,
) {
  const response = await axios.post(
    `${API_BASE_URL}/verification/verify-face`,
    { selfieUrl, documentImageUrl },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
}
