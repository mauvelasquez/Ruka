'use client'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '../../components/Navbar'
import ConsentStep  from './components/ConsentStep'
import IdCaptureStep from './components/IdCaptureStep'
import FaceMatchStep from './components/FaceMatchStep'
import ResultStep   from './components/ResultStep'
import { Shield, FileText, Camera, CheckCircle } from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Consentimiento', icon: Shield },
  { id: 2, label: 'Carnet',         icon: FileText },
  { id: 3, label: 'Selfie',         icon: Camera },
  { id: 4, label: 'Resultado',      icon: CheckCircle },
]

function Stepper({ current }) {
  return (
    <div className="flex items-center justify-between w-full max-w-sm mx-auto mb-8">
      {STEPS.map((step, i) => {
        const Icon      = step.icon
        const done      = current > step.id
        const active    = current === step.id
        const pending   = current < step.id
        const isLast    = i === STEPS.length - 1
        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                done    ? 'bg-forest text-white' :
                active  ? 'bg-terra text-white' :
                          'bg-sand/60 text-gray-400'
              }`}>
                {done
                  ? <CheckCircle className="w-4 h-4" />
                  : <Icon className="w-4 h-4" />
                }
              </div>
              <span className={`text-xs font-medium hidden sm:block ${
                active ? 'text-terra' : done ? 'text-forest' : 'text-gray-400'
              }`}>{step.label}</span>
            </div>
            {!isLast && (
              <div className={`flex-1 h-0.5 mx-1 rounded-full transition-colors ${
                current > step.id ? 'bg-forest' : 'bg-gray-200'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function VerificarContent() {
  const searchParams = useSearchParams()
  const action = searchParams.get('action')

  const [step, setStep]             = useState(1)
  const [ocrResult, setOcrResult]   = useState(null)   // { extracted_data, idImageBase64 }
  const [faceResult, setFaceResult] = useState(null)   // { match, distance, confidence }
  const [attemptsLeft, setAttemptsLeft] = useState(3)
  const [idImageBase64, setIdImageBase64] = useState(null) // raw base64 of carnet image for face matching

  const handleConsent = () => setStep(2)

  const handleOcrSuccess = (data) => {
    // data comes from IdCaptureStep which also passes back the compressed base64
    setOcrResult(data)
    setIdImageBase64(data.idImageBase64 ?? null)
    setStep(3)
  }

  const handleFaceSuccess = (result) => {
    setFaceResult(result)
    setStep(4)
  }

  const handleRetry = () => {
    setAttemptsLeft(prev => prev - 1)
    setFaceResult(null)
    setStep(3)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8F4EE' }}>
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-10">
        <div className="w-full max-w-md">
          <Stepper current={step} />

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            {step === 1 && <ConsentStep onAccept={handleConsent} />}

            {step === 2 && (
              <IdCaptureStep
                onSuccess={handleOcrSuccess}
              />
            )}

            {step === 3 && ocrResult && (
              <FaceMatchStep
                ocrResult={{ ...ocrResult, idImageBase64 }}
                onSuccess={handleFaceSuccess}
              />
            )}

            {step === 4 && ocrResult && faceResult && (
              <ResultStep
                ocrResult={ocrResult}
                faceResult={faceResult}
                action={action}
                attemptsLeft={attemptsLeft}
                onRetry={handleRetry}
              />
            )}
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Protegido bajo Ley 19.628 · Datos biométricos procesados solo en tu dispositivo
          </p>
        </div>
      </div>
    </div>
  )
}

export default function VerificarPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F4EE' }}>
          <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <VerificarContent />
      </Suspense>
    </>
  )
}
