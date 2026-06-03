import { Body, Button, Container, Head, Html, Preview, Section, Text } from '@react-email/components'
import { RukkaHeader } from './components/RukkaHeader'
import { RukkaFooter } from './components/RukkaFooter'

interface IdentidadVerificadaProps {
  nombre: string
}

export default function IdentidadVerificada({ nombre = 'Viajero' }: IdentidadVerificadaProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>¡Identidad verificada! El siguiente paso es publicar tu hogar.</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          <RukkaHeader />

          <Section style={{ padding: '32px 24px 24px' }}>
            <Section style={{ textAlign: 'center', margin: '0 0 24px' }}>
              <Text style={{ fontSize: '48px', margin: '0 0 8px' }}>✅</Text>
              <Text style={{ fontSize: '26px', color: '#2D5016', fontFamily: 'Georgia, serif', fontWeight: 'bold', margin: '0' }}>
                ¡Identidad verificada! Ahora publica tu hogar 🏡
              </Text>
            </Section>

            <Text style={{ fontSize: '16px', color: '#1a1a1a', lineHeight: '1.6', margin: '0 0 24px', textAlign: 'center' }}>
              Hola <strong>{nombre}</strong>, tu identidad fue confirmada. ✅<br />
              El siguiente paso es publicar tu hogar para poder hacer match con otros viajeros en Chile.
            </Text>

            <Section style={{ backgroundColor: '#F5F0E8', borderRadius: '10px', padding: '20px 24px', margin: '0 0 28px' }}>
              <Text style={{ fontSize: '15px', color: '#2D5016', fontWeight: 'bold', margin: '0 0 14px', fontFamily: 'Georgia, serif' }}>
                Tu progreso
              </Text>
              <Text style={{ fontSize: '15px', color: '#2D5016', margin: '0 0 8px', lineHeight: '1.5' }}>
                ✅ <strong>Email confirmado</strong>
              </Text>
              <Text style={{ fontSize: '15px', color: '#2D5016', margin: '0 0 8px', lineHeight: '1.5' }}>
                ✅ <strong>Identidad verificada</strong>
              </Text>
              <Text style={{ fontSize: '15px', color: '#888888', margin: '0 0 8px', lineHeight: '1.5' }}>
                ⬜ Publicar hogar
              </Text>
              <Text style={{ fontSize: '15px', color: '#888888', margin: '0', lineHeight: '1.5' }}>
                ⬜ Hacer match
              </Text>
            </Section>

            <Section style={{ textAlign: 'center', margin: '0 0 8px' }}>
              <Button
                href="https://rukka.cl/onboarding"
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
                Publicar mi hogar →
              </Button>
            </Section>
          </Section>

          <RukkaFooter />
        </Container>
      </Body>
    </Html>
  )
}
