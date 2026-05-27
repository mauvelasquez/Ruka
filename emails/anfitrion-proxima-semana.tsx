import { Body, Button, Container, Head, Html, Preview, Section, Text } from '@react-email/components'
import { RukkaHeader } from './components/RukkaHeader'
import { RukkaFooter } from './components/RukkaFooter'

interface AnfitrionProximaSemanaProps {
  nombre: string
  nombreViajero: string
  fechaLlegada: string
  fechaSalida: string
  personas: number
  notas?: string
}

export default function AnfitrionProximaSemana({
  nombre = 'Anfitrión',
  nombreViajero = 'María',
  fechaLlegada = '10 jun',
  fechaSalida = '17 jun',
  personas = 2,
  notas,
}: AnfitrionProximaSemanaProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Prepara tu hogar, {nombreViajero} llega en 7 días. ¡Todo listo para recibirlos!</Preview>
      <Body style={{ backgroundColor: '#ffffff', margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          <RukkaHeader />

          <Section style={{ padding: '32px 24px 24px' }}>
            <Section style={{ textAlign: 'center', margin: '0 0 24px' }}>
              <div style={{ display: 'inline-block', backgroundColor: '#2D5016', borderRadius: '16px', padding: '16px 32px' }}>
                <Text style={{ fontSize: '48px', color: '#ffffff', fontWeight: 'bold', margin: '0', fontFamily: 'Georgia, serif', lineHeight: '1' }}>
                  7
                </Text>
                <Text style={{ fontSize: '16px', color: '#ffffff', margin: '4px 0 0', letterSpacing: '2px', textTransform: 'uppercase' }}>
                  días
                </Text>
              </div>
            </Section>

            <Text style={{ fontSize: '24px', color: '#2D5016', fontFamily: 'Georgia, serif', fontWeight: 'bold', margin: '0 0 8px', textAlign: 'center' }}>
              ¡Se acerca la llegada!
            </Text>
            <Text style={{ fontSize: '16px', color: '#1a1a1a', lineHeight: '1.6', margin: '0 0 24px', textAlign: 'center' }}>
              Hola <strong>{nombre}</strong>, en una semana <strong>{nombreViajero}</strong> llegará a tu hogar. Aquí tienes lo que necesitas saber.
            </Text>

            <Section style={{ backgroundColor: '#F5F0E8', borderRadius: '10px', padding: '20px', margin: '0 0 24px' }}>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 6px' }}>
                👤 <strong>¿Quién llega?</strong> {nombreViajero}
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 6px' }}>
                🗓️ <strong>Llegada:</strong> {fechaLlegada}
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 6px' }}>
                🗓️ <strong>Salida:</strong> {fechaSalida}
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0' }}>
                👥 <strong>Personas:</strong> {personas}
              </Text>
            </Section>

            {notas && (
              <Section style={{ backgroundColor: '#f0f7ec', borderRadius: '8px', padding: '16px', margin: '0 0 24px', borderLeft: '4px solid #2D5016' }}>
                <Text style={{ fontSize: '14px', color: '#2D5016', margin: '0 0 4px', fontWeight: 'bold' }}>
                  Nota de {nombreViajero}:
                </Text>
                <Text style={{ fontSize: '14px', color: '#1a1a1a', margin: '0', lineHeight: '1.6' }}>
                  {notas}
                </Text>
              </Section>
            )}

            <Text style={{ fontSize: '16px', color: '#2D5016', fontWeight: 'bold', margin: '0 0 14px', fontFamily: 'Georgia, serif' }}>
              Checklist de preparación
            </Text>

            <Section style={{ margin: '0 0 8px' }}>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 8px', lineHeight: '1.5' }}>
                ✅ Confirma la hora de llegada con {nombreViajero}
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 8px', lineHeight: '1.5' }}>
                🔑 Deja las llaves o acceso coordinado
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 8px', lineHeight: '1.5' }}>
                📋 Prepara información del hogar (wifi, instrucciones, emergencias)
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 8px', lineHeight: '1.5' }}>
                🧹 Despeja espacio en armarios y baño
              </Text>
              <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 24px', lineHeight: '1.5' }}>
                💌 Deja un mensaje de bienvenida
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
