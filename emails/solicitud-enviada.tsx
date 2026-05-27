import { Body, Button, Container, Head, Html, Img, Preview, Section, Text } from '@react-email/components'
import { RukkaHeader } from './components/RukkaHeader'
import { RukkaFooter } from './components/RukkaFooter'

interface SolicitudEnviadaProps {
  nombre: string
  destino: string
  fechaInicio: string
  fechaFin: string
  nombreAnfitrion: string
  imagenHogar?: string
}

export default function SolicitudEnviada({
  nombre = 'Viajero',
  destino = 'Santiago',
  fechaInicio = '10 jun',
  fechaFin = '17 jun',
  nombreAnfitrion = 'Carlos',
  imagenHogar,
}: SolicitudEnviadaProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Tu solicitud fue enviada. {nombreAnfitrion} tiene 48h para responder.</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          <RukkaHeader />

          <Section style={{ padding: '32px 24px 24px' }}>
            <Text style={{ fontSize: '24px', color: '#2D5016', fontFamily: 'Georgia, serif', margin: '0 0 16px', fontWeight: 'bold' }}>
              ¡Solicitud enviada, {nombre}! ✈️
            </Text>
            <Text style={{ fontSize: '16px', color: '#1a1a1a', lineHeight: '1.6', margin: '0 0 24px' }}>
              Tu solicitud de intercambio fue enviada exitosamente a <strong>{nombreAnfitrion}</strong>. Ahora solo queda esperar su respuesta.
            </Text>

            {imagenHogar && (
              <Img
                src={imagenHogar}
                alt={`Hogar en ${destino}`}
                width={552}
                style={{ borderRadius: '10px', width: '100%', marginBottom: '20px', display: 'block' }}
              />
            )}

            <Section style={{ backgroundColor: '#F5F0E8', borderRadius: '10px', padding: '20px', margin: '0 0 28px' }}>
              <Text style={{ fontSize: '15px', color: '#666666', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px' }}>
                Resumen de tu solicitud
              </Text>
              <Text style={{ fontSize: '20px', color: '#2D5016', fontWeight: 'bold', margin: '0 0 6px', fontFamily: 'Georgia, serif' }}>
                📍 {destino}
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 4px' }}>
                🗓️ {fechaInicio} → {fechaFin}
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0' }}>
                🏠 Anfitrión: <strong>{nombreAnfitrion}</strong>
              </Text>
            </Section>

            <Section style={{ backgroundColor: '#FDF0EA', borderRadius: '8px', padding: '16px', margin: '0 0 28px', borderLeft: '4px solid #C4622D' }}>
              <Text style={{ fontSize: '14px', color: '#C4622D', margin: '0', fontWeight: 'bold' }}>
                ⏰ {nombreAnfitrion} tiene 48 horas para aceptar o rechazar tu solicitud.
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
                Ver mi solicitud
              </Button>
            </Section>
          </Section>

          <RukkaFooter />
        </Container>
      </Body>
    </Html>
  )
}
