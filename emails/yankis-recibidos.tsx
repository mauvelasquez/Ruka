import { Body, Button, Container, Head, Html, Preview, Section, Text } from '@react-email/components'
import { RukkaHeader } from './components/RukkaHeader'
import { RukkaFooter } from './components/RukkaFooter'

interface YankisRecibidosProps {
  nombre: string
  yanquisRecibidos: number
  yanquisTotal: number
  motivo: string
  nombreHuesped?: string
}

export default function YankisRecibidos({
  nombre = 'Anfitrión',
  yanquisRecibidos = 5,
  yanquisTotal = 12,
  motivo = 'hospedaje completado',
  nombreHuesped,
}: YankisRecibidosProps) {
  const labelRecibidos = yanquisRecibidos === 1 ? 'noche' : 'noches'
  const labelTotal = yanquisTotal === 1 ? 'noche' : 'noches'

  return (
    <Html lang="es">
      <Head />
      <Preview>{`¡Sumaste ${yanquisRecibidos} ${labelRecibidos} de alojamiento gratis! Tu saldo ahora es ${yanquisTotal}.`}</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          <RukkaHeader />

          <Section style={{ padding: '32px 24px 24px' }}>
            <Text style={{ fontSize: '24px', color: '#2D5016', fontFamily: 'Georgia, serif', fontWeight: 'bold', margin: '0 0 16px' }}>
              ¡Hola, {nombre}! 🎁
            </Text>
            <Text style={{ fontSize: '16px', color: '#1a1a1a', lineHeight: '1.6', margin: '0 0 24px' }}>
              Acabas de sumar noches de alojamiento gratis a tu cuenta de Rukka.
              {nombreHuesped ? ` Gracias por hospedar a ${nombreHuesped}.` : ''}
            </Text>

            <Section style={{ textAlign: 'center', margin: '0 0 24px' }}>
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: '#FDF0EA',
                  borderRadius: '16px',
                  padding: '28px 40px',
                  border: '2px solid #C4622D',
                }}
              >
                <Text style={{ fontSize: '52px', fontWeight: 'bold', color: '#C4622D', margin: '0', lineHeight: '1', fontFamily: 'Georgia, serif' }}>
                  +{yanquisRecibidos}
                </Text>
                <Text style={{ fontSize: '20px', color: '#C4622D', fontWeight: 'bold', margin: '4px 0 0' }}>
                  🎁 {labelRecibidos} gratis
                </Text>
              </div>
            </Section>

            <Section style={{ backgroundColor: '#F5F0E8', borderRadius: '10px', padding: '20px', margin: '0 0 24px' }}>
              <Text style={{ fontSize: '15px', color: '#666666', margin: '0 0 6px' }}>
                <strong>Motivo:</strong> {motivo}
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0', fontWeight: 'bold' }}>
                💰 Tu saldo total: {yanquisTotal} {labelTotal} gratis
              </Text>
            </Section>

            <Text style={{ fontSize: '15px', color: '#1a1a1a', lineHeight: '1.6', margin: '0 0 24px' }}>
              Usa tus noches gratis para alojarte en cualquier hogar de Rukka. No caducan — úsalas cuando quieras.
            </Text>

            <Section style={{ textAlign: 'center', margin: '0 0 8px' }}>
              <Button
                href="https://rukka.cl/homes"
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
                Buscar dónde alojarme
              </Button>
            </Section>
          </Section>

          <RukkaFooter />
        </Container>
      </Body>
    </Html>
  )
}
