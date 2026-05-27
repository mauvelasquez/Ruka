import { Body, Button, Container, Head, Html, Img, Preview, Section, Text } from '@react-email/components'
import { RukkaHeader } from './components/RukkaHeader'
import { RukkaFooter } from './components/RukkaFooter'

interface SolicitudRecibidaProps {
  nombre: string
  nombreViajero: string
  avatarViajero?: string
  fechaInicio: string
  fechaFin: string
  personas: number
  mensajePersonal?: string
}

export default function SolicitudRecibida({
  nombre = 'Anfitrión',
  nombreViajero = 'María',
  avatarViajero,
  fechaInicio = '10 jun',
  fechaFin = '17 jun',
  personas = 2,
  mensajePersonal,
}: SolicitudRecibidaProps) {
  const inicial = nombreViajero.charAt(0).toUpperCase()

  return (
    <Html lang="es">
      <Head />
      <Preview>{nombreViajero} quiere quedarse en tu hogar. Tienes 48h para responder.</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          <RukkaHeader />

          <Section style={{ padding: '32px 24px 24px' }}>
            <Text style={{ fontSize: '24px', color: '#2D5016', fontFamily: 'Georgia, serif', margin: '0 0 8px', fontWeight: 'bold' }}>
              ¡Tienes una nueva solicitud, {nombre}! 🌎
            </Text>
            <Text style={{ fontSize: '16px', color: '#1a1a1a', lineHeight: '1.6', margin: '0 0 24px' }}>
              <strong>{nombreViajero}</strong> quiere quedarse en tu hogar. Revisa los detalles y decide si aceptas.
            </Text>

            <Section style={{ backgroundColor: '#F5F0E8', borderRadius: '12px', padding: '24px', margin: '0 0 20px', textAlign: 'center' }}>
              {avatarViajero ? (
                <Img
                  src={avatarViajero}
                  alt={nombreViajero}
                  width={72}
                  height={72}
                  style={{ borderRadius: '50%', margin: '0 auto 12px', display: 'block', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    backgroundColor: '#2D5016',
                    color: '#ffffff',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    lineHeight: '72px',
                    textAlign: 'center',
                    margin: '0 auto 12px',
                    display: 'block',
                  }}
                >
                  {inicial}
                </div>
              )}
              <Text style={{ fontSize: '20px', color: '#1a1a1a', fontWeight: 'bold', margin: '0 0 4px', fontFamily: 'Georgia, serif' }}>
                {nombreViajero}
              </Text>
            </Section>

            <Section style={{ backgroundColor: '#F5F0E8', borderRadius: '10px', padding: '20px', margin: '0 0 20px' }}>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 6px' }}>
                🗓️ <strong>Fechas:</strong> {fechaInicio} → {fechaFin}
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0' }}>
                👥 <strong>Personas:</strong> {personas} {personas === 1 ? 'persona' : 'personas'}
              </Text>
            </Section>

            {mensajePersonal && (
              <Section style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '16px', margin: '0 0 20px', border: '1px solid #e0d8cc' }}>
                <Text style={{ fontSize: '13px', color: '#888888', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Mensaje personal
                </Text>
                <Text style={{ fontSize: '15px', color: '#1a1a1a', lineHeight: '1.6', margin: '0', fontStyle: 'italic' }}>
                  &quot;{mensajePersonal}&quot;
                </Text>
              </Section>
            )}

            <Section style={{ backgroundColor: '#FDF0EA', borderRadius: '8px', padding: '14px 16px', margin: '0 0 28px', borderLeft: '4px solid #C4622D' }}>
              <Text style={{ fontSize: '14px', color: '#C4622D', margin: '0', fontWeight: 'bold' }}>
                ⏰ Tienes 48 horas para aceptar o rechazar esta solicitud.
              </Text>
            </Section>

            <Section style={{ textAlign: 'center', margin: '0 0 8px' }}>
              <Button
                href="https://rukka.cl/dashboard"
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
                Ver solicitud completa
              </Button>
            </Section>
          </Section>

          <RukkaFooter />
        </Container>
      </Body>
    </Html>
  )
}
