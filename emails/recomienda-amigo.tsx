import { Body, Button, Container, Head, Html, Preview, Section, Text } from '@react-email/components'
import { RukkaHeader } from './components/RukkaHeader'
import { RukkaFooter } from './components/RukkaFooter'
import { YankisBadge } from './components/YankisBadge'

interface RecomiendaAmigoProps {
  nombre: string
  codigoReferido: string
  yanquisPorReferido: number
}

export default function RecomiendaAmigo({
  nombre = 'Viajero',
  codigoReferido = 'RUKKA-ABC123',
  yanquisPorReferido = 2,
}: RecomiendaAmigoProps) {
  const linkReferido = `https://rukka.cl/register?ref=${codigoReferido}`

  return (
    <Html lang="es">
      <Head />
      <Preview>Invita a un amigo y gana Yankis. Comparte Rukka y viaja más.</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          <RukkaHeader />

          <Section style={{ padding: '32px 24px 24px' }}>
            <Text style={{ fontSize: '24px', color: '#2D5016', fontFamily: 'Georgia, serif', fontWeight: 'bold', margin: '0 0 8px' }}>
              ¡Hola, {nombre}! 🤝
            </Text>
            <Text style={{ fontSize: '16px', color: '#1a1a1a', lineHeight: '1.6', margin: '0 0 8px' }}>
              Esperamos que tu intercambio haya sido increíble. Ahora puedes compartir Rukka con tus amigos — y ganar Yankis por cada uno que se sume.
            </Text>

            <Section style={{ backgroundColor: '#F5F0E8', borderRadius: '12px', padding: '24px', margin: '24px 0', textAlign: 'center' }}>
              <Text style={{ fontSize: '16px', color: '#666666', margin: '0 0 10px' }}>
                Por cada amigo que se registre y publique su hogar, ganas:
              </Text>
              <YankisBadge cantidad={yanquisPorReferido} />
              <Text style={{ fontSize: '14px', color: '#666666', margin: '12px 0 0' }}>
                Sin límite — más amigos, más Yankis.
              </Text>
            </Section>

            <Section style={{ backgroundColor: '#ffffff', border: '2px dashed #C4622D', borderRadius: '10px', padding: '20px', margin: '0 0 24px', textAlign: 'center' }}>
              <Text style={{ fontSize: '13px', color: '#888888', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Tu link personal de invitación
              </Text>
              <Text style={{ fontSize: '14px', color: '#C4622D', fontWeight: 'bold', margin: '0', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                {linkReferido}
              </Text>
            </Section>

            <Text style={{ fontSize: '14px', color: '#666666', lineHeight: '1.6', margin: '0 0 24px' }}>
              Cuando un amigo use tu link, se registre y publique su hogar, los Yankis se acreditan automáticamente a tu cuenta. ¡Así de simple!
            </Text>

            <Section style={{ textAlign: 'center', margin: '0 0 8px' }}>
              <Button
                href={linkReferido}
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
                Compartir mi link
              </Button>
            </Section>
          </Section>

          <RukkaFooter />
        </Container>
      </Body>
    </Html>
  )
}
