'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Camera, AlertCircle, Loader, CheckCircle, Eye, RotateCcw, ExternalLink } from 'lucide-react'
import { VERIFICATION_ERRORS } from '../../../lib/verification-errors'

// Eye Aspect Ratio for blink detection
function eyeAspectRatio(eye) {
  // eye: array of 6 {x,y} points
  const d1 = Math.hypot(eye[1].x - eye[5].x, eye[1].y - eye[5].y)
  const d2 = Math.hypot(eye[2].x - eye[4].x, eye[2].y - eye[4].y)
  const d3 = Math.hypot(eye[0].x - eye[3].x, eye[0].y - eye[3].y)
  return (d1 + d2) / (2 * d3)
}

const BLINK_THRESHOLD = 0.22
const MATCH_THRESHOLD = 0.55

function getCamErrorCode(err) {
  switch (err?.name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      return 'CAMERA_DENIED'
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return 'CAMERA_NOT_FOUND'
    case 'NotReadableError':
    case 'TrackStartError':
      return 'CAMERA_IN_USE'
    default:
      return 'LIVENESS_FAILED'
  }
}

export default function FaceMatchStep({ ocrResult, onSuccess }) {
  const videoRef    = useRef()
  const canvasRef   = useRef()
  const streamRef   = useRef()
  const faceapiRef  = useRef(null)

  const [phase, setPhase]         = useState('loading_models') // loading_models | camera | liveness | capturing | matching | done | error
  const [modelProgress, setModelProgress] = useState(0)
  const [camError, setCamError]     = useState(null)
  const [camErrorCode, setCamErrorCode] = useState(null)
  const [detection, setDetection]   = useState(null) // { centered, score, faceCount }
  const [blinkCount, setBlinkCount] = useState(0)
  const [livenessOk, setLivenessOk] = useState(false)
  const [selfieDescriptor, setSelfieDescriptor] = useState(null)
  const [matchResult, setMatchResult] = useState(null)
  const [errorCode, setErrorCode]   = useState(null)
  const [error, setError]           = useState(null)
  const blinkRef = useRef({ wasOpen: true, count: 0 })
  const goodFramesRef = useRef(0)
  const animRef = useRef()

  // ── Cleanup stream on unmount only ───────────────────────────────────────────
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animRef.current)
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  // ── Load models ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    async function loadModels() {
      try {
        const faceapi = await import('@vladmandic/face-api')
        faceapiRef.current = faceapi
        const MODEL_URL = '/models'
        setModelProgress(10)
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
        setModelProgress(40)
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        setModelProgress(70)
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        setModelProgress(100)
        if (!cancelled) setPhase('camera')
      } catch (err) {
        if (!cancelled) {
          setErrorCode('LIVENESS_FAILED')
          setError(VERIFICATION_ERRORS.LIVENESS_FAILED.message)
          setPhase('error')
        }
      }
    }
    loadModels()
    return () => { cancelled = true }
  }, [])

  // ── Start camera ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'camera') return
    let active = true

    async function startCam() {
      // Check API availability (older Safari / HTTP pages)
      if (!navigator.mediaDevices?.getUserMedia) {
        if (!active) return
        setCamErrorCode('CAMERA_NOT_FOUND')
        setCamError('Tu navegador no soporta acceso a cámara. Usa Chrome, Safari 11+ o Firefox 36+.')
        setPhase('error')
        return
      }

      const primaryConstraints = {
        video: { facingMode: { ideal: 'user' }, width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      }

      let stream
      try {
        stream = await navigator.mediaDevices.getUserMedia(primaryConstraints)
      } catch (primaryErr) {
        if (!active) return
        // Retry without constraints if they caused the failure
        if (primaryErr.name === 'OverconstrainedError' || primaryErr.name === 'ConstraintNotSatisfiedError') {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
          } catch (fallbackErr) {
            if (!active) return
            const code = getCamErrorCode(fallbackErr)
            setCamErrorCode(code)
            setCamError(VERIFICATION_ERRORS[code]?.message ?? 'No se pudo acceder a la cámara.')
            setPhase('error')
            return
          }
        } else {
          const code = getCamErrorCode(primaryErr)
          setCamErrorCode(code)
          setCamError(VERIFICATION_ERRORS[code]?.message ?? 'No se pudo acceder a la cámara.')
          setPhase('error')
          return
        }
      }

      if (!active) { stream.getTracks().forEach(t => t.stop()); return }

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Await play() — can throw on some browsers if autoplay policy blocks it,
        // but since video is muted + playsInline this should always succeed
        await videoRef.current.play().catch(() => {})
      }

      // Only advance phase if still active (component not unmounted)
      if (active) setPhase('liveness')
    }

    startCam()
    // Only cancel active flag on cleanup — stream lifecycle is managed by the unmount effect
    return () => { active = false }
  }, [phase])

  // ── Detection loop ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'liveness' && phase !== 'capturing') return
    const faceapi = faceapiRef.current
    if (!faceapi) return

    async function detect() {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || video.readyState < 2) {
        animRef.current = requestAnimationFrame(detect)
        return
      }
      const result = await faceapi
        .detectSingleFace(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.6 }))
        .withFaceLandmarks()

      const ctx = canvas.getContext('2d')
      canvas.width  = video.videoWidth
      canvas.height = video.videoHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (!result) {
        setDetection({ faceCount: 0, centered: false, score: 0 })
        goodFramesRef.current = 0
        animRef.current = requestAnimationFrame(detect)
        return
      }

      const box = result.detection.box
      const vw = video.videoWidth, vh = video.videoHeight
      const cx = box.x + box.width / 2
      const cy = box.y + box.height / 2
      const centered = cx > vw * 0.2 && cx < vw * 0.8 && cy > vh * 0.15 && cy < vh * 0.85
      const score    = result.detection.score

      const ok = centered && score > 0.85
      ctx.strokeStyle = ok ? '#2A5C45' : '#C4622D'
      ctx.lineWidth   = 3
      ctx.strokeRect(box.x, box.y, box.width, box.height)

      setDetection({ faceCount: 1, centered, score })

      // Blink detection via Eye Aspect Ratio
      if (phase === 'liveness' && result.landmarks) {
        const lm = result.landmarks.positions
        const leftEye  = lm.slice(36, 42)
        const rightEye = lm.slice(42, 48)
        const ear = (eyeAspectRatio(leftEye) + eyeAspectRatio(rightEye)) / 2
        const isClosed = ear < BLINK_THRESHOLD
        if (isClosed && blinkRef.current.wasOpen) {
          blinkRef.current.count += 1
          blinkRef.current.wasOpen = false
          setBlinkCount(blinkRef.current.count)
          if (blinkRef.current.count >= 2) setLivenessOk(true)
        } else if (!isClosed) {
          blinkRef.current.wasOpen = true
        }
      }

      // Auto-capture when conditions are good for 1.5s (≈45 frames @30fps)
      if (ok && livenessOk && phase === 'liveness') {
        goodFramesRef.current += 1
        if (goodFramesRef.current >= 45) {
          setPhase('capturing')
          cancelAnimationFrame(animRef.current)
          captureAndMatch(video)
          return
        }
      } else {
        goodFramesRef.current = 0
      }

      animRef.current = requestAnimationFrame(detect)
    }

    animRef.current = requestAnimationFrame(detect)
    return () => cancelAnimationFrame(animRef.current)
  }, [phase, livenessOk])

  // ── Capture + match ───────────────────────────────────────────────────────────
  const captureAndMatch = useCallback(async (video) => {
    const faceapi = faceapiRef.current
    setPhase('matching')
    try {
      const selfieResult = await faceapi
        .detectSingleFace(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.6 }))
        .withFaceLandmarks()
        .withFaceDescriptor()

      if (!selfieResult) {
        setErrorCode('FACE_NOT_DETECTED')
        throw new Error(VERIFICATION_ERRORS.FACE_NOT_DETECTED.message)
      }
      const selfieDesc = selfieResult.descriptor

      const idImg = await loadImageFromBase64(ocrResult.idPhotoBase64)
      if (!idImg) {
        setErrorCode('ID_FACE_NOT_DETECTED')
        throw new Error(VERIFICATION_ERRORS.ID_FACE_NOT_DETECTED.message)
      }

      const idResult = await faceapi
        .detectSingleFace(idImg, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.4 }))
        .withFaceLandmarks()
        .withFaceDescriptor()

      if (!idResult) {
        setErrorCode('ID_FACE_NOT_DETECTED')
        throw new Error(VERIFICATION_ERRORS.ID_FACE_NOT_DETECTED.message)
      }

      const distance   = faceapi.euclideanDistance(selfieDesc, idResult.descriptor)
      const match      = distance < MATCH_THRESHOLD
      const confidence = match
        ? distance < 0.35 ? 'alta' : distance < 0.45 ? 'buena' : 'aceptable'
        : 'insuficiente'

      setSelfieDescriptor(selfieDesc)
      setMatchResult({ match, distance, confidence })
      setPhase('done')
      streamRef.current?.getTracks().forEach(t => t.stop())
      onSuccess({ match, distance, confidence })
    } catch (err) {
      if (!errorCode) setErrorCode('LIVENESS_FAILED')
      setError(err.message || VERIFICATION_ERRORS.LIVENESS_FAILED.message)
      setPhase('error')
    }
  }, [ocrResult, onSuccess, errorCode])

  const handleManualCapture = () => {
    if (!videoRef.current) return
    cancelAnimationFrame(animRef.current)
    setPhase('capturing')
    captureAndMatch(videoRef.current)
  }

  const retry = () => {
    cancelAnimationFrame(animRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    blinkRef.current = { wasOpen: true, count: 0 }
    goodFramesRef.current = 0
    setBlinkCount(0)
    setLivenessOk(false)
    setMatchResult(null)
    setError(null)
    setErrorCode(null)
    setCamError(null)
    setCamErrorCode(null)
    setPhase('camera')
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-xl font-black text-gray-900 mb-1">Verificación facial</h2>
        <p className="text-sm text-gray-500">Mira directo a la cámara con buena iluminación</p>
      </div>

      {phase === 'loading_models' && (
        <div className="space-y-4 py-6">
          <div className="flex flex-col items-center gap-3">
            <Loader className="w-8 h-8 text-forest animate-spin" />
            <p className="text-sm font-medium text-gray-700">Cargando modelos de reconocimiento facial...</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-forest h-2 rounded-full transition-all duration-300"
              style={{ width: `${modelProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 text-center">{modelProgress}%</p>
        </div>
      )}

      {(phase === 'liveness' || phase === 'capturing' || phase === 'matching') && (
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
            <video autoPlay playsInline muted ref={videoRef} className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            {/* Center guide circle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-40 h-40 rounded-full border-2 border-white/40" />
            </div>
            {phase === 'matching' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white space-y-2">
                  <Loader className="w-8 h-8 animate-spin mx-auto" />
                  <p className="text-sm font-medium">Comparando rostros...</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <LivenessIndicator
              label="Parpadea 2 veces"
              done={livenessOk}
              progress={`${blinkCount}/2 parpadeos detectados`}
              icon={<Eye className="w-4 h-4" />}
            />
            <LivenessIndicator
              label="Rostro centrado y nítido"
              done={detection?.centered && detection?.score > 0.85}
              progress={detection?.faceCount === 0 ? 'No se detecta un rostro' : detection?.centered ? 'Bien posicionado' : 'Centra tu rostro'}
              icon={<Camera className="w-4 h-4" />}
            />
          </div>

          {livenessOk && (
            <div className="flex gap-2">
              <button
                onClick={handleManualCapture}
                disabled={phase === 'matching' || phase === 'capturing'}
                className="flex-1 flex items-center justify-center gap-2 bg-forest text-white py-3 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                Capturar ahora
              </button>
            </div>
          )}
        </div>
      )}

      {phase === 'done' && matchResult && (
        <div className={`rounded-2xl p-5 flex flex-col items-center gap-3 ${matchResult.match ? 'bg-forest/5 border border-forest/20' : 'bg-red-50 border border-red-200'}`}>
          {matchResult.match
            ? <CheckCircle className="w-12 h-12 text-forest" />
            : <AlertCircle className="w-12 h-12 text-red-500" />
          }
          <p className="font-bold text-gray-900">{matchResult.match ? '¡Coincidencia confirmada!' : 'Los rostros no coinciden'}</p>
          <p className="text-xs text-gray-500">Confianza: {matchResult.confidence}</p>
        </div>
      )}

      {phase === 'error' && (
        <div className="space-y-4">
          <div className="flex gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm text-red-700">{error || camError}</p>
              {(camErrorCode === 'CAMERA_DENIED') && (
                <p className="text-xs text-red-500 mt-1">
                  En tu navegador: Configuración → Privacidad → Cámara → Permitir para este sitio.
                </p>
              )}
              {((errorCode ?? camErrorCode) === 'CAMERA_NOT_FOUND') && (
                <a href="mailto:soporte@rukka.cl" className="inline-flex items-center gap-1 text-xs text-red-600 underline mt-1">
                  Contactar soporte <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
          {VERIFICATION_ERRORS[errorCode ?? camErrorCode]?.can_retry !== false && (
            <button onClick={retry} className="w-full flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl font-medium text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <RotateCcw className="w-4 h-4" />
              Reintentar
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function LivenessIndicator({ label, done, progress, icon }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl ${done ? 'bg-forest/5 border border-forest/20' : 'bg-gray-50'}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-forest text-white' : 'bg-gray-200 text-gray-400'}`}>
        {done ? <CheckCircle className="w-4 h-4" /> : icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-gray-700">{label}</p>
        <p className="text-xs text-gray-400 truncate">{progress}</p>
      </div>
    </div>
  )
}

function loadImageFromBase64(base64) {
  if (!base64) return Promise.resolve(null)
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = `data:image/jpeg;base64,${base64}`
  })
}
