import { Body, Button, Container, Head, Html, Preview, Section, Text } from '@react-email/components'
import { RukkaHeader } from './components/RukkaHeader'
import { RukkaFooter } from './components/RukkaFooter'
import { YankisBadge } from './components/YankisBadge'

interface BienvenidaProps {
  nombre: string
  email: string
}

export default function Bienvenida({ nombre = 'Viajero', email = '' }: BienvenidaProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>¡Bienvenido a Rukka! Ya tienes 3 Yankis para tu primer intercambio.</Preview>
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
              Completaste tu perfil y ya eres parte de la familia. Como regalo de bienvenida, te regalamos:
            </Text>

            <Section style={{ backgroundColor: '#F5F0E8', borderRadius: '10px', padding: '20px', textAlign: 'center', margin: '0 0 28px' }}>
              <Text style={{ fontSize: '18px', color: '#1a1a1a', margin: '0 0 10px', fontWeight: 'bold' }}>
                Tu saldo de bienvenida
              </Text>
              <YankisBadge cantidad={3} />
              <Text style={{ fontSize: '13px', color: '#666666', margin: '10px 0 0' }}>
                1 Yanki = 1 noche en cualquier hogar de Rukka
              </Text>
            </Section>

            <Text style={{ fontSize: '17px', color: '#2D5016', fontWeight: 'bold', margin: '0 0 16px', fontFamily: 'Georgia, serif' }}>
              ¿Por dónde empezar?
            </Text>

            <Section style={{ margin: '0 0 12px' }}>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 6px', lineHeight: '1.5' }}>
                <span style={{ display: 'inline-block', backgroundColor: '#2D5016', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', textAlign: 'center', fontWeight: 'bold', lineHeight: '22px', marginRight: '10px', fontSize: '13px' }}>1</span>
                <strong>Publica tu hogar</strong> — Cuéntanos sobre tu espacio.
              </Text>
            </Section>
            <Section style={{ margin: '0 0 12px' }}>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 6px', lineHeight: '1.5' }}>
                <span style={{ display: 'inline-block', backgroundColor: '#2D5016', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', textAlign: 'center', fontWeight: 'bold', lineHeight: '22px', marginRight: '10px', fontSize: '13px' }}>2</span>
                <strong>Busca tu destino</strong> — Explora hogares en Chile, México, Colombia y Argentina.
              </Text>
            </Section>
            <Section style={{ margin: '0 0 28px' }}>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0', lineHeight: '1.5' }}>
                <span style={{ display: 'inline-block', backgroundColor: '#2D5016', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', textAlign: 'center', fontWeight: 'bold', lineHeight: '22px', marginRight: '10px', fontSize: '13px' }}>3</span>
                <strong>Haz match</strong> — Envía tu solicitud y empieza a planear.
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
                Publicar mi hogar
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
