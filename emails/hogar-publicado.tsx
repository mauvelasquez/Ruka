import { Body, Button, Container, Head, Html, Preview, Section, Text } from '@react-email/components'
import { RukkaHeader } from './components/RukkaHeader'
import { RukkaFooter } from './components/RukkaFooter'

const HOGAR_DESTACADO_URL = 'https://rukka.cl/homes/f8d0e6ad-81f7-41e9-945e-a5e3018b9ba5'

interface HogarDestacado {
  titulo: string
  ciudad: string
}

interface HogarPublicadoProps {
  nombre: string
  nombreHogar: string
  urlHogar: string
  imagenHogar?: string
  hogarDestacado?: HogarDestacado
}

export default function HogarPublicado({
  nombre = 'Anfitrión',
  nombreHogar = 'Mi hogar en Santiago',
  urlHogar = 'https://rukka.cl/homes/mi-hogar',
  imagenHogar,
  hogarDestacado = {
    titulo: 'Casita privada en el bosque, Puertecillo',
    ciudad: 'Navidad',
  },
}: HogarPublicadoProps) {
  const mensajeWhatsApp = encodeURIComponent(`Mira mi hogar en Rukka: ${urlHogar}`)
  const urlWhatsApp = `https://wa.me/?text=${mensajeWhatsApp}`

  return (
    <Html lang="es">
      <Head />
      <Preview>¡Tu hogar está publicado! Mira quién podría ser tu anfitrión.</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          <RukkaHeader />

          <Section style={{ padding: '32px 24px 24px' }}>
            <Section style={{ textAlign: 'center', margin: '0 0 24px' }}>
              <Text style={{ fontSize: '48px', margin: '0 0 8px' }}>🌿</Text>
              <Text style={{ fontSize: '26px', color: '#2D5016', fontFamily: 'Georgia, serif', fontWeight: 'bold', margin: '0' }}>
                ¡Tu hogar está publicado! Mira quién podría ser tu anfitrión 🌿
              </Text>
            </Section>

            <Text style={{ fontSize: '16px', color: '#1a1a1a', lineHeight: '1.6', margin: '0 0 24px', textAlign: 'center' }}>
              Hola <strong>{nombre}</strong>, <strong>{nombreHogar}</strong> ya está visible para toda la comunidad Rukka.
            </Text>

            {/* Progress tracker */}
            <Section style={{ backgroundColor: '#F5F0E8', borderRadius: '10px', padding: '20px 24px', margin: '0 0 24px' }}>
              <Text style={{ fontSize: '15px', color: '#2D5016', fontWeight: 'bold', margin: '0 0 14px', fontFamily: 'Georgia, serif' }}>
                Tu progreso
              </Text>
              <Text style={{ fontSize: '15px', color: '#2D5016', margin: '0 0 8px', lineHeight: '1.5' }}>
                ✅ <strong>Email confirmado</strong>
              </Text>
              <Text style={{ fontSize: '15px', color: '#2D5016', margin: '0 0 8px', lineHeight: '1.5' }}>
                ✅ <strong>Identidad verificada</strong>
              </Text>
              <Text style={{ fontSize: '15px', color: '#2D5016', margin: '0 0 8px', lineHeight: '1.5' }}>
                ✅ <strong>Hogar publicado</strong>
              </Text>
              <Text style={{ fontSize: '15px', color: '#888888', margin: '0', lineHeight: '1.5' }}>
                ⬜ Hacer match
              </Text>
            </Section>

            {/* Featured home */}
            <Section style={{ border: '2px solid #2D5016', borderRadius: '12px', padding: '20px', margin: '0 0 24px' }}>
              <Text style={{ fontSize: '16px', color: '#2D5016', fontWeight: 'bold', margin: '0 0 12px', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                Un hogar que podría interesarte
              </Text>
              <Section style={{ backgroundColor: '#F5F0E8', borderRadius: '10px', padding: '16px', margin: '0 0 14px' }}>
                <Text style={{ fontSize: '14px', color: '#888888', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  🏡 Hogar destacado
                </Text>
                <Text style={{ fontSize: '17px', color: '#2D5016', fontWeight: 'bold', margin: '0 0 4px', fontFamily: 'Georgia, serif' }}>
                  {hogarDestacado.titulo}
                </Text>
                <Text style={{ fontSize: '14px', color: '#555555', margin: '0' }}>
                  📍 {hogarDestacado.ciudad}, Chile
                </Text>
              </Section>
              <Section style={{ textAlign: 'center', margin: '0' }}>
                <Button
                  href={HOGAR_DESTACADO_URL}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#2D5016',
                    borderRadius: '8px',
                    padding: '10px 22px',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    fontSize: '14px',
                    display: 'inline-block',
                    border: '2px solid #2D5016',
                  }}
                >
                  Ver este hogar →
                </Button>
              </Section>
            </Section>

            {/* WhatsApp share */}
            <Section style={{ border: '1.5px solid #e0d8cc', borderRadius: '12px', padding: '20px', margin: '0 0 24px' }}>
              <Text style={{ fontSize: '15px', color: '#2D5016', fontWeight: 'bold', margin: '0 0 8px', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                Comparte tu hogar
              </Text>
              <Text style={{ fontSize: '14px', color: '#666666', margin: '0 0 14px', textAlign: 'center', lineHeight: '1.5' }}>
                Mientras más personas conozcan tu hogar, más intercambios recibirás.
              </Text>
              <Section style={{ textAlign: 'center', margin: '0 0 12px' }}>
                <Button
                  href={urlWhatsApp}
                  style={{
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    borderRadius: '8px',
                    padding: '10px 22px',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    fontSize: '14px',
                    display: 'inline-block',
                  }}
                >
                  Compartir por WhatsApp
                </Button>
              </Section>
              <Section style={{ backgroundColor: '#F5F0E8', borderRadius: '8px', padding: '10px 16px', margin: '0' }}>
                <Text style={{ fontSize: '12px', color: '#888888', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>
                  O copia este link
                </Text>
                <Text style={{ fontSize: '13px', color: '#1B4F72', fontWeight: 'bold', margin: '0', wordBreak: 'break-all', fontFamily: 'monospace', textAlign: 'center' }}>
                  {urlHogar}
                </Text>
              </Section>
            </Section>

            {/* Primary CTA */}
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
                Buscar hogares →
              </Button>
            </Section>
          </Section>

          <RukkaFooter />
        </Container>
      </Body>
    </Html>
  )
}
