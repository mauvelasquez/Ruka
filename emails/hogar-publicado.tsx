import { Body, Button, Container, Head, Html, Img, Preview, Section, Text } from '@react-email/components'
import { RukkaHeader } from './components/RukkaHeader'
import { RukkaFooter } from './components/RukkaFooter'

interface HogarPublicadoProps {
  nombre: string
  nombreHogar: string
  urlHogar: string
  imagenHogar?: string
}

export default function HogarPublicado({
  nombre = 'Anfitrión',
  nombreHogar = 'Mi hogar en Santiago',
  urlHogar = 'https://rukka.cl/homes/mi-hogar',
  imagenHogar,
}: HogarPublicadoProps) {
  const mensajeWhatsApp = encodeURIComponent(`Mira mi hogar en Rukka: ${urlHogar}`)
  const urlWhatsApp = `https://wa.me/?text=${mensajeWhatsApp}`

  return (
    <Html lang="es">
      <Head />
      <Preview>¡Tu hogar ya está en Rukka! Compártelo y comienza a recibir solicitudes.</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          <RukkaHeader />

          <Section style={{ padding: '32px 24px 24px' }}>
            <Section style={{ textAlign: 'center', margin: '0 0 24px' }}>
              <Text style={{ fontSize: '48px', margin: '0 0 8px' }}>🏠</Text>
              <Text style={{ fontSize: '26px', color: '#2D5016', fontFamily: 'Georgia, serif', fontWeight: 'bold', margin: '0' }}>
                ¡Tu hogar ya está en Rukka!
              </Text>
            </Section>

            <Text style={{ fontSize: '16px', color: '#1a1a1a', lineHeight: '1.6', margin: '0 0 24px', textAlign: 'center' }}>
              Hola <strong>{nombre}</strong>, <strong>{nombreHogar}</strong> ya está visible para toda la comunidad Rukka. ¡Ahora puedes recibir solicitudes de intercambio!
            </Text>

            {imagenHogar && (
              <Section style={{ margin: '0 0 24px', textAlign: 'center' }}>
                <Img
                  src={imagenHogar}
                  alt={nombreHogar}
                  width={552}
                  style={{ borderRadius: '10px', width: '100%', maxWidth: '552px', display: 'block', margin: '0 auto' }}
                />
              </Section>
            )}

            <Section style={{ backgroundColor: '#F5F0E8', borderRadius: '10px', padding: '20px', margin: '0 0 24px' }}>
              <Text style={{ fontSize: '16px', color: '#2D5016', fontWeight: 'bold', margin: '0 0 8px', fontFamily: 'Georgia, serif' }}>
                ¿Qué sigue?
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 8px', lineHeight: '1.6' }}>
                🌍 Otros miembros de Rukka pueden ver tu hogar y enviarte solicitudes de intercambio.
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0', lineHeight: '1.6' }}>
                ✅ Cuando aceptas una solicitud, el viajero usa sus Yankis y tú acumulas los tuyos para viajar.
              </Text>
            </Section>

            <Section style={{ border: '2px solid #2D5016', borderRadius: '12px', padding: '20px', margin: '0 0 24px' }}>
              <Text style={{ fontSize: '16px', color: '#2D5016', fontWeight: 'bold', margin: '0 0 12px', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                Comparte tu hogar
              </Text>
              <Text style={{ fontSize: '14px', color: '#666666', margin: '0 0 16px', textAlign: 'center', lineHeight: '1.5' }}>
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

              <Section style={{ backgroundColor: '#F5F0E8', borderRadius: '8px', padding: '12px 16px', margin: '0' }}>
                <Text style={{ fontSize: '12px', color: '#888888', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>
                  O copia este link directo
                </Text>
                <Text style={{ fontSize: '13px', color: '#1B4F72', fontWeight: 'bold', margin: '0', wordBreak: 'break-all', fontFamily: 'monospace', textAlign: 'center' }}>
                  {urlHogar}
                </Text>
              </Section>
            </Section>

            <Section style={{ textAlign: 'center', margin: '0 0 12px' }}>
              <Button
                href={urlHogar}
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
                Ver mi hogar publicado
              </Button>
            </Section>

            <Section style={{ textAlign: 'center', margin: '0 0 8px' }}>
              <Button
                href="https://rukka.cl/homes"
                style={{
                  backgroundColor: 'transparent',
                  color: '#2D5016',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  fontSize: '14px',
                  display: 'inline-block',
                  border: '2px solid #2D5016',
                }}
              >
                Explorar hogares para intercambiar
              </Button>
            </Section>
          </Section>

          <RukkaFooter />
        </Container>
      </Body>
    </Html>
  )
}
