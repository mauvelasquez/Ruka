// Pipeline de compresión client-side usando solo Canvas API nativo.
// Sin dependencias externas. Objetivo: ≤600KB, max 1920px, WebP si el browser lo soporta.

const MAX_PX = 1920
const TARGET_BYTES = 600 * 1024
const MIN_QUALITY = 0.50

function canvasToBlob(canvas, type, quality) {
  return new Promise(resolve => canvas.toBlob(resolve, type, quality))
}

function supportsWebPOutput() {
  try {
    const c = document.createElement('canvas')
    c.width = 1; c.height = 1
    return c.toDataURL('image/webp').startsWith('data:image/webp')
  } catch {
    return false
  }
}

/**
 * Comprime una imagen para Supabase Storage.
 * @param {File} file
 * @returns {Promise<{blob: File, sizeKB: number, originalKB: number, format: string,
 *   width: number, height: number, compressionRatio: number, skipped: boolean}>}
 */
export async function compressImage(file) {
  const originalKB = Math.round(file.size / 1024)

  // Imágenes pequeñas: saltar compresión
  if (file.size < 150_000) {
    return {
      blob: file, sizeKB: originalKB, originalKB,
      format: file.type, width: null, height: null,
      compressionRatio: 1, skipped: true,
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl)

      // Redimensionar si supera MAX_PX en cualquier lado (mantener aspect ratio)
      let { width, height } = img
      if (width > MAX_PX || height > MAX_PX) {
        if (width >= height) { height = Math.round(height * MAX_PX / width); width = MAX_PX }
        else                  { width = Math.round(width * MAX_PX / height); height = MAX_PX }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)

      const useWebP = supportsWebPOutput()
      const format = useWebP ? 'image/webp' : 'image/jpeg'
      const ext    = useWebP ? 'webp' : 'jpg'
      let quality  = useWebP ? 0.82 : 0.80

      let blob = await canvasToBlob(canvas, format, quality)

      // Reducir calidad en pasos de 0.05 hasta ≤ TARGET_BYTES o calidad mínima
      while (blob && blob.size > TARGET_BYTES && quality > MIN_QUALITY) {
        quality = parseFloat((quality - 0.05).toFixed(2))
        blob = await canvasToBlob(canvas, format, quality)
      }

      if (!blob) { reject(new Error('canvas.toBlob failed')); return }

      const sizeKB = Math.round(blob.size / 1024)
      const outputFile = new File(
        [blob],
        file.name.replace(/\.[^.]+$/, `.${ext}`),
        { type: format }
      )

      resolve({
        blob: outputFile,
        sizeKB,
        originalKB,
        format,
        width,
        height,
        compressionRatio: Math.round((originalKB / sizeKB) * 10) / 10,
        skipped: false,
      })
    }

    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Failed to load image')) }
    img.src = objectUrl
  })
}
