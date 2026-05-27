import { Body, Button, Container, Head, Html, Preview, Section, Text } from '@react-email/components'
import { RukkaHeader } from './components/RukkaHeader'
import { RukkaFooter } from './components/RukkaFooter'
import { YankisBadge } from './components/YankisBadge'

interface YankisUsadosProps {
  nombre: string
  yanquisUsados: number
  yanquisRestantes: number
  destino: string
  fechaInicio: string
  fechaFin: string
}

export default function YankisUsados({
  nombre = 'Viajero',
  yanquisUsados = 5,
  yanquisRestantes = 7,
  destino = 'Ciudad de México',
  fechaInicio = '10 jun',
  fechaFin = '15 jun',
}: YankisUsadosProps) {
  const labelUsados = yanquisUsados === 1 ? 'Yanki' : 'Yankis'
  const labelRestantes = yanquisRestantes === 1 ? 'Yanki' : 'Yankis'

  return (
    <Html lang="es">
      <Head />
      <Preview>{`Usaste ${yanquisUsados} ${labelUsados} para tu estadía en ${destino}.`}</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          <RukkaHeader />

          <Section style={{ padding: '32px 24px 24px' }}>
            <Text style={{ fontSize: '24px', color: '#2D5016', fontFamily: 'Georgia, serif', fontWeight: 'bold', margin: '0 0 16px' }}>
              ¡Hola, {nombre}! 🏠
            </Text>
            <Text style={{ fontSize: '16px', color: '#1a1a1a', lineHeight: '1.6', margin: '0 0 24px' }}>
              Confirmamos el descuento de Yankis para tu próxima estadía.
            </Text>

            <Section style={{ backgroundColor: '#F5F0E8', borderRadius: '10px', padding: '20px', margin: '0 0 20px' }}>
              <Text style={{ fontSize: '14px', color: '#888888', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Yankis descontados
              </Text>
              <YankisBadge cantidad={yanquisUsados} />
              <Text style={{ fontSize: '14px', color: '#888888', margin: '12px 0 0' }}>
                Saldo restante: <strong style={{ color: '#1a1a1a' }}>{yanquisRestantes} {labelRestantes}</strong>
              </Text>
            </Section>

            <Section style={{ backgroundColor: '#F5F0E8', borderRadius: '10px', padding: '20px', margin: '0 0 20px' }}>
              <Text style={{ fontSize: '13px', color: '#888888', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Detalles de la reserva
              </Text>
              <Text style={{ fontSize: '20px', color: '#2D5016', fontWeight: 'bold', margin: '0 0 6px', fontFamily: 'Georgia, serif' }}>
                📍 {destino}
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0' }}>
                🗓️ {fechaInicio} → {fechaFin}
              </Text>
            </Section>

            <Section style={{ backgroundColor: '#f0f7ec', borderRadius: '8px', padding: '14px 16px', margin: '0 0 28px', borderLeft: '4px solid #2D5016' }}>
              <Text style={{ fontSize: '14px', color: '#2D5016', margin: '0' }}>
                🔄 <strong>¿Necesitas cancelar?</strong> Si cancelas tu reserva, tus {yanquisUsados} {labelUsados} se devuelven íntegros a tu cuenta.
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
                Ver mi reserva
              </Button>
            </Section>
          </Section>

          <RukkaFooter />
        </Container>
      </Body>
    </Html>
  )
}
