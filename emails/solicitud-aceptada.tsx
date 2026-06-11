import { Body, Button, Container, Head, Html, Preview, Section, Text } from '@react-email/components'
import { RukkaHeader } from './components/RukkaHeader'
import { RukkaFooter } from './components/RukkaFooter'
import { YankisBadge } from './components/YankisBadge'

interface SolicitudAceptadaProps {
  nombre: string
  nombreAnfitrion: string
  destino: string
  fechaInicio: string
  fechaFin: string
  yanquisDescontados: number
}

export default function SolicitudAceptada({
  nombre = 'Viajero',
  nombreAnfitrion = 'Carlos',
  destino = 'Santiago',
  fechaInicio = '10 jun',
  fechaFin = '17 jun',
  yanquisDescontados = 7,
}: SolicitudAceptadaProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>¡Match confirmado! Tu viaje a {destino} está listo. Coordina con {nombreAnfitrion}.</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          <RukkaHeader />

          <Section style={{ padding: '32px 24px 24px' }}>
            <Section style={{ textAlign: 'center', margin: '0 0 24px' }}>
              <Text style={{ fontSize: '48px', margin: '0 0 8px' }}>🎉</Text>
              <Text style={{ fontSize: '26px', color: '#2D5016', fontFamily: 'Georgia, serif', fontWeight: 'bold', margin: '0' }}>
                ¡{nombreAnfitrion} aceptó!
              </Text>
            </Section>

            <Text style={{ fontSize: '16px', color: '#1a1a1a', lineHeight: '1.6', margin: '0 0 24px', textAlign: 'center' }}>
              Hola <strong>{nombre}</strong>, tu intercambio está confirmado. ¡Es hora de empacar!
            </Text>

            <Section style={{ backgroundColor: '#F5F0E8', borderRadius: '10px', padding: '20px', margin: '0 0 20px' }}>
              <Text style={{ fontSize: '20px', color: '#2D5016', fontWeight: 'bold', margin: '0 0 8px', fontFamily: 'Georgia, serif' }}>
                📍 {destino}
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 4px' }}>
                🗓️ {fechaInicio} → {fechaFin}
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0' }}>
                🏠 Anfitrión: <strong>{nombreAnfitrion}</strong>
              </Text>
            </Section>

            <Section style={{ backgroundColor: '#FDF0EA', borderRadius: '10px', padding: '20px', margin: '0 0 20px', textAlign: 'center' }}>
              <Text style={{ fontSize: '14px', color: '#666666', margin: '0 0 8px' }}>
                Noches gratis descontadas de tu saldo
              </Text>
              <YankisBadge cantidad={yanquisDescontados} />
            </Section>

            <Section style={{ backgroundColor: '#f0f7ec', borderRadius: '8px', padding: '16px', margin: '0 0 28px', borderLeft: '4px solid #2D5016' }}>
              <Text style={{ fontSize: '14px', color: '#2D5016', margin: '0', fontWeight: 'bold' }}>
                💬 Tip: coordina la hora de llegada y la entrega de llaves directamente con {nombreAnfitrion} por el chat de Rukka.
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
                Ver detalles del intercambio
              </Button>
            </Section>
          </Section>

          <RukkaFooter />
        </Container>
      </Body>
    </Html>
  )
}
