export type VerificationErrorCode =
  | 'FACE_MISMATCH'
  | 'FACE_NOT_DETECTED'
  | 'ID_FACE_NOT_DETECTED'
  | 'CAMERA_DENIED'
  | 'CAMERA_NOT_FOUND'
  | 'CAMERA_IN_USE'
  | 'CAMERA_BLOCKED'
  | 'LIVENESS_FAILED'
  | 'DOCUMENT_INVALID'
  | 'DOCUMENT_UNSUPPORTED_COUNTRY'
  | 'DOCUMENT_DUPLICATE'
  | 'OCR_ERROR'
  | 'RATE_LIMITED'
  | 'NETWORK_ERROR'
  | 'SELFIE_BYPASS'

export type SuggestedAction =
  | 'retry_selfie'
  | 'retry_document'
  | 'contact_support'
  | 'check_camera_permissions'
  | 'go_to_dashboard'

export interface VerificationError {
  error_code: VerificationErrorCode
  message: string
  suggested_action: SuggestedAction
  can_retry: boolean
}

export const VERIFICATION_ERRORS: Record<VerificationErrorCode, Omit<VerificationError, 'error_code'>> = {
  FACE_MISMATCH:                { message: 'Los rostros no coinciden.', suggested_action: 'retry_selfie', can_retry: true },
  FACE_NOT_DETECTED:            { message: 'No detectamos un rostro en la selfie.', suggested_action: 'retry_selfie', can_retry: true },
  ID_FACE_NOT_DETECTED:         { message: 'No detectamos un rostro en el documento.', suggested_action: 'retry_document', can_retry: true },
  CAMERA_DENIED:                { message: 'Acceso a la cámara denegado. Ve a los ajustes de tu navegador y habilítala.', suggested_action: 'check_camera_permissions', can_retry: false },
  CAMERA_NOT_FOUND:             { message: 'No se encontró cámara en tu dispositivo.', suggested_action: 'contact_support', can_retry: false },
  CAMERA_IN_USE:                { message: 'La cámara está siendo usada por otra aplicación. Ciérrala e intenta nuevamente.', suggested_action: 'retry_selfie', can_retry: true },
  CAMERA_BLOCKED:               { message: 'El acceso a la cámara está bloqueado por configuración de seguridad del sitio. Sube una foto en su lugar.', suggested_action: 'retry_selfie', can_retry: true },
  LIVENESS_FAILED:              { message: 'No pudimos completar la prueba de vida. Intenta en un lugar con mejor iluminación.', suggested_action: 'retry_selfie', can_retry: true },
  DOCUMENT_INVALID:             { message: 'El documento no es legible o no es válido. Verifica que esté completo y bien iluminado.', suggested_action: 'retry_document', can_retry: true },
  DOCUMENT_UNSUPPORTED_COUNTRY: { message: 'El documento debe ser de Chile, Colombia, Argentina o México.', suggested_action: 'contact_support', can_retry: false },
  DOCUMENT_DUPLICATE:           { message: 'Este documento ya está registrado en Rukka. Si crees que es un error, contáctanos.', suggested_action: 'contact_support', can_retry: false },
  OCR_ERROR:                    { message: 'No pudimos extraer los datos del documento. Intenta con una foto más nítida.', suggested_action: 'retry_document', can_retry: true },
  RATE_LIMITED:                 { message: 'Demasiados intentos. Espera una hora antes de reintentar.', suggested_action: 'go_to_dashboard', can_retry: false },
  NETWORK_ERROR:                { message: 'Error de conexión. Verifica tu internet e intenta nuevamente.', suggested_action: 'retry_document', can_retry: true },
  SELFIE_BYPASS:                { message: 'Verificación completada parcialmente.', suggested_action: 'go_to_dashboard', can_retry: false },
}
