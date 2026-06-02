import { Body, Button, Container, Head, Html, Preview, Section, Text } from '@react-email/components'
import { RukkaHeader } from './components/RukkaHeader'
import { RukkaFooter } from './components/RukkaFooter'

interface BienvenidaProps {
  nombre: string
  email: string
}

export default function Bienvenida({ nombre = 'Viajero', email = '' }: BienvenidaProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>¡Bienvenido a Rukka! Verifica tu identidad para empezar a intercambiar.</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          <RukkaHeader />

          <Section style={{ padding: '32px 24px 24px' }}>
            <Text style={{ fontSize: '24px', color: '#2D5016', fontFamily: 'Georgia, serif', margin: '0 0 16px', fontWeight: 'bold' }}>
              ¡Hola, {nombre}! 🏠
            </Text>
            <Text style={{ fontSize: '16px', color: '#1a1a1a', lineHeight: '1.6', margin: '0 0 16px' }}>
              Bienvenido a Rukka, la comunidad latinoamericana donde mi casa es tu casa — y la tuya es la de alguien más.
            </Text>
            <Text style={{ fontSize: '16px', color: '#1a1a1a', lineHeight: '1.6', margin: '0 0 24px' }}>
              Tu perfil está listo. El siguiente paso para empezar a intercambiar es verificar tu identidad.
            </Text>

            <Section style={{ backgroundColor: '#F0F4EC', border: '1.5px solid #2D5016', borderRadius: '10px', padding: '20px 24px', margin: '0 0 28px' }}>
              <Text style={{ fontSize: '16px', color: '#2D5016', fontWeight: 'bold', margin: '0 0 8px' }}>
                🛡️ ¿Por qué verificamos tu identidad?
              </Text>
              <Text style={{ fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0 0 8px' }}>
                En Rukka nos tomamos muy en serio la seguridad de nuestra comunidad. La verificación nos permite asegurarnos de que todos los miembros son personas reales y de confianza.
              </Text>
              <Text style={{ fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0' }}>
                Solo los miembros verificados pueden participar en intercambios.
              </Text>
            </Section>

            <Text style={{ fontSize: '17px', color: '#2D5016', fontWeight: 'bold', margin: '0 0 16px', fontFamily: 'Georgia, serif' }}>
              ¿Cómo empezar?
            </Text>

            <Section style={{ margin: '0 0 12px' }}>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 6px', lineHeight: '1.5' }}>
                <span style={{ display: 'inline-block', backgroundColor: '#2D5016', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', textAlign: 'center', fontWeight: 'bold', lineHeight: '22px', marginRight: '10px', fontSize: '13px' }}>1</span>
                <strong>Verifica tu identidad</strong> — Sube una foto de tu documento.
              </Text>
            </Section>
            <Section style={{ margin: '0 0 12px' }}>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 6px', lineHeight: '1.5' }}>
                <span style={{ display: 'inline-block', backgroundColor: '#2D5016', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', textAlign: 'center', fontWeight: 'bold', lineHeight: '22px', marginRight: '10px', fontSize: '13px' }}>2</span>
                <strong>Publica tu hogar</strong> — Cuéntanos sobre tu espacio.
              </Text>
            </Section>
            <Section style={{ margin: '0 0 28px' }}>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0', lineHeight: '1.5' }}>
                <span style={{ display: 'inline-block', backgroundColor: '#2D5016', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', textAlign: 'center', fontWeight: 'bold', lineHeight: '22px', marginRight: '10px', fontSize: '13px' }}>3</span>
                <strong>Haz match</strong> — Busca destinos y envía tu primera solicitud.
              </Text>
            </Section>

            <Section style={{ textAlign: 'center', margin: '0 0 16px' }}>
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
                Verificar mi identidad →
              </Button>
            </Section>
            <Section style={{ textAlign: 'center', margin: '0 0 8px' }}>
              <Button
                href="https://rukka.cl/homes"
                style={{
                  backgroundColor: 'transparent',
                  color: '#1B4F72',
                  borderRadius: '8px',
                  padding: '10px 28px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  fontSize: '14px',
                  display: 'inline-block',
                  border: '2px solid #1B4F72',
                }}
              >
                Explorar hogares
              </Button>
            </Section>
          </Section>

          <RukkaFooter />
        </Container>
      </Body>
    </Html>
  )
}
