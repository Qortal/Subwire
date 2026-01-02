/**
 * Convert a Map to a plain object for JSON serialization
 */
export function mapToObject<T>(map: Map<string, T>): Record<string, T> {
  const obj: Record<string, T> = {};
  map.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

/**
 * Convert a plain object to a Map
 */
export function objectToMap<T>(obj: Record<string, T>): Map<string, T> {
  const map = new Map<string, T>();
  Object.entries(obj).forEach(([key, value]) => {
    map.set(key, value);
  });
  return map;
}

/**
 * Convert a File to a base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convert a base64 string back to a File
 */
export function base64ToFile(base64: string, filename: string, mimeType: string): File {
  const byteString = atob(base64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeType });
  return new File([blob], filename, { type: mimeType });
}

