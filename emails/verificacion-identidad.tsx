import { Body, Button, Container, Head, Html, Preview, Section, Text } from '@react-email/components'
import { RukkaHeader } from './components/RukkaHeader'
import { RukkaFooter } from './components/RukkaFooter'

interface VerificacionIdentidadProps {
  nombre: string
  accionBloqueada: string
}

export default function VerificacionIdentidad({
  nombre = 'Viajero',
  accionBloqueada = 'enviar una solicitud de intercambio',
}: VerificacionIdentidadProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Verifica tu identidad para continuar. Solo toma unos minutos.</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          <RukkaHeader />

          <Section style={{ padding: '32px 24px 24px' }}>
            <Section style={{ textAlign: 'center', margin: '0 0 24px' }}>
              <Text style={{ fontSize: '48px', margin: '0' }}>🔒</Text>
            </Section>

            <Text style={{ fontSize: '24px', color: '#2D5016', fontFamily: 'Georgia, serif', fontWeight: 'bold', margin: '0 0 16px' }}>
              Hola, {nombre}
            </Text>
            <Text style={{ fontSize: '16px', color: '#1a1a1a', lineHeight: '1.6', margin: '0 0 24px' }}>
              Para <strong>{accionBloqueada}</strong> necesitamos verificar tu identidad. Es un paso que hacemos para mantener la confianza dentro de nuestra comunidad.
            </Text>

            <Section style={{ backgroundColor: '#F5F0E8', borderRadius: '10px', padding: '20px', margin: '0 0 24px' }}>
              <Text style={{ fontSize: '16px', color: '#2D5016', fontWeight: 'bold', margin: '0 0 12px', fontFamily: 'Georgia, serif' }}>
                ¿Por qué verificamos identidades?
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 8px', lineHeight: '1.5' }}>
                🏠 Todos en Rukka abrimos las puertas de nuestro hogar. La verificación garantiza que solo personas reales acceden a la comunidad.
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0', lineHeight: '1.5' }}>
                🛡️ Tus datos se usan únicamente para este proceso y no se comparten con terceros.
              </Text>
            </Section>

            <Text style={{ fontSize: '16px', color: '#2D5016', fontWeight: 'bold', margin: '0 0 14px', fontFamily: 'Georgia, serif' }}>
              Cómo verificar tu identidad
            </Text>
            <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 8px', lineHeight: '1.5' }}>
              1️⃣ Haz clic en el botón de abajo
            </Text>
            <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 8px', lineHeight: '1.5' }}>
              2️⃣ Sube una foto de tu cédula o pasaporte
            </Text>
            <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 24px', lineHeight: '1.5' }}>
              3️⃣ Toma una selfie — solo para confirmar que coincides
            </Text>

            <Text style={{ fontSize: '14px', color: '#888888', margin: '0 0 24px', lineHeight: '1.5' }}>
              El proceso toma menos de 5 minutos. Una vez verificado, no necesitarás hacerlo de nuevo.
            </Text>

            <Section style={{ textAlign: 'center', margin: '0 0 8px' }}>
              <Button
                href="https://rukka.cl/dashboard/verificacion"
                style={{
                  backgroundColor: '#2D5016',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '12px 28px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  fontSize: '15px',
                  display: 'inline-block',
                }}
              >
                Verificar ahora
              </Button>
            </Section>
          </Section>

          <RukkaFooter />
        </Container>
      </Body>
    </Html>
  )
}
