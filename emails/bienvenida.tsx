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
      <Preview>¡Email confirmado! Sigue 3 pasos para hacer tu primer intercambio en Chile.</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          <RukkaHeader />

          <Section style={{ padding: '32px 24px 24px' }}>
            <Text style={{ fontSize: '24px', color: '#2D5016', fontFamily: 'Georgia, serif', margin: '0 0 16px', fontWeight: 'bold' }}>
              ¡Email confirmado, {nombre}! Comienza tu primera aventura Rukka 🏡
            </Text>
            <Text style={{ fontSize: '16px', color: '#1a1a1a', lineHeight: '1.6', margin: '0 0 24px' }}>
              Tu email fue verificado exitosamente. Ya eres parte de la comunidad Rukka.
            </Text>

            <Text style={{ fontSize: '17px', color: '#2D5016', fontWeight: 'bold', margin: '0 0 16px', fontFamily: 'Georgia, serif' }}>
              3 pasos para tu primer match
            </Text>

            <Section style={{ backgroundColor: '#F5F0E8', borderRadius: '10px', padding: '16px 20px', margin: '0 0 10px' }}>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 4px', lineHeight: '1.5' }}>
                <span style={{ display: 'inline-block', backgroundColor: '#2D5016', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', textAlign: 'center', fontWeight: 'bold', lineHeight: '24px', marginRight: '10px', fontSize: '13px' }}>1</span>
                <strong>Verifica tu identidad</strong>
              </Text>
              <Text style={{ fontSize: '14px', color: '#555555', margin: '4px 0 0 34px', lineHeight: '1.5' }}>
                Sube una foto de tu cédula de identidad chilena o licencia de conducir en mano.
              </Text>
            </Section>

            <Section style={{ backgroundColor: '#F5F0E8', borderRadius: '10px', padding: '16px 20px', margin: '0 0 10px' }}>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 4px', lineHeight: '1.5' }}>
                <span style={{ display: 'inline-block', backgroundColor: '#2D5016', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', textAlign: 'center', fontWeight: 'bold', lineHeight: '24px', marginRight: '10px', fontSize: '13px' }}>2</span>
                <strong>Publica tu hogar</strong>
              </Text>
              <Text style={{ fontSize: '14px', color: '#555555', margin: '4px 0 0 34px', lineHeight: '1.5' }}>
                Cuéntale a la comunidad sobre tu espacio.
              </Text>
            </Section>

            <Section style={{ backgroundColor: '#F5F0E8', borderRadius: '10px', padding: '16px 20px', margin: '0 0 20px' }}>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 4px', lineHeight: '1.5' }}>
                <span style={{ display: 'inline-block', backgroundColor: '#2D5016', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', textAlign: 'center', fontWeight: 'bold', lineHeight: '24px', marginRight: '10px', fontSize: '13px' }}>3</span>
                <strong>Busca y haz match</strong>
              </Text>
              <Text style={{ fontSize: '14px', color: '#555555', margin: '4px 0 0 34px', lineHeight: '1.5' }}>
                Explora hogares en Chile y envía tu solicitud de intercambio.
              </Text>
            </Section>

            <Section style={{ backgroundColor: '#FDF0EA', borderRadius: '8px', padding: '14px 16px', margin: '0 0 28px', borderLeft: '4px solid #C4622D' }}>
              <Text style={{ fontSize: '14px', color: '#C4622D', margin: '0', lineHeight: '1.5' }}>
                Solo miembros verificados con hogar publicado pueden hacer match.
              </Text>
            </Section>

            <Section style={{ textAlign: 'center', margin: '0 0 8px' }}>
              <Button
                href="https://rukka.cl/verificar"
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
          </Section>

          <RukkaFooter />
        </Container>
      </Body>
    </Html>
  )
}
