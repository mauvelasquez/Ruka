import { Body, Button, Container, Head, Html, Preview, Section, Text } from '@react-email/components'
import { RukkaHeader } from './components/RukkaHeader'
import { RukkaFooter } from './components/RukkaFooter'

interface ReservaProximaSemanaProps {
  nombre: string
  destino: string
  fechaInicio: string
  fechaFin: string
  nombreAnfitrion: string
}

export default function ReservaProximaSemana({
  nombre = 'Viajero',
  destino = 'Santiago',
  fechaInicio = '10 jun',
  fechaFin = '17 jun',
  nombreAnfitrion = 'Ana',
}: ReservaProximaSemanaProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Tu intercambio en {destino} comienza en 7 días. ¡Últimos preparativos!</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          <RukkaHeader />

          <Section style={{ padding: '32px 24px 24px' }}>
            <Section style={{ textAlign: 'center', margin: '0 0 24px' }}>
              <div style={{ display: 'inline-block', backgroundColor: '#2D5016', borderRadius: '16px', padding: '16px 32px' }}>
                <Text style={{ fontSize: '48px', color: '#ffffff', fontWeight: 'bold', margin: '0', fontFamily: 'Georgia, serif', lineHeight: '1' }}>
                  7
                </Text>
                <Text style={{ fontSize: '16px', color: '#ffffff', margin: '4px 0 0', letterSpacing: '2px', textTransform: 'uppercase' }}>
                  días
                </Text>
              </div>
            </Section>

            <Text style={{ fontSize: '24px', color: '#2D5016', fontFamily: 'Georgia, serif', fontWeight: 'bold', margin: '0 0 8px', textAlign: 'center' }}>
              ¡Tu viaje a {destino} se acerca!
            </Text>
            <Text style={{ fontSize: '16px', color: '#1a1a1a', lineHeight: '1.6', margin: '0 0 24px', textAlign: 'center' }}>
              Hola <strong>{nombre}</strong>, en una semana estarás viviendo como local gracias a {nombreAnfitrion}.
            </Text>

            <Section style={{ backgroundColor: '#F5F0E8', borderRadius: '10px', padding: '20px', margin: '0 0 24px' }}>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 6px' }}>
                📍 <strong>Destino:</strong> {destino}
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 6px' }}>
                🗓️ <strong>Fechas:</strong> {fechaInicio} → {fechaFin}
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0' }}>
                🏠 <strong>Tu anfitrión:</strong> {nombreAnfitrion}
              </Text>
            </Section>

            <Text style={{ fontSize: '16px', color: '#2D5016', fontWeight: 'bold', margin: '0 0 14px', fontFamily: 'Georgia, serif' }}>
              Checklist antes de viajar
            </Text>

            <Section style={{ margin: '0 0 8px' }}>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 8px', lineHeight: '1.5' }}>
                ✅ Confirma la hora de llegada con {nombreAnfitrion}
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 8px', lineHeight: '1.5' }}>
                🔑 Coordina la entrega de llaves o código de acceso
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 24px', lineHeight: '1.5' }}>
                🏡 Deja instrucciones claras sobre tu propio hogar para quien te recibe
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
                Ver detalles del viaje
              </Button>
            </Section>
          </Section>

          <RukkaFooter />
        </Container>
      </Body>
    </Html>
  )
}
