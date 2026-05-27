import { Img, Section, Text } from '@react-email/components'

export function RukkaHeader() {
  return (
    <Section
      style={{
        backgroundColor: '#2D5016',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <Img
        src="https://rukka.cl/rukka-logo-nuevo.png"
        alt="Rukka"
        width={80}
        style={{ margin: '0 auto', display: 'block' }}
      />
      <Text
        style={{
          color: '#ffffff',
          fontSize: '13px',
          margin: '8px 0 0',
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          letterSpacing: '0.5px',
        }}
      >
        Mi casa es tu casa.
      </Text>
    </Section>
  )
}
