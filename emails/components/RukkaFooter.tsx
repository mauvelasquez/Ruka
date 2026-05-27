import { Hr, Link, Section, Text } from '@react-email/components'

export function RukkaFooter() {
  return (
    <Section style={{ backgroundColor: '#F5F0E8', padding: '24px', textAlign: 'center' }}>
      <Hr style={{ borderColor: '#e0d8cc', margin: '0 0 16px' }} />
      <Text style={{ margin: '0 0 8px', fontSize: '13px', color: '#666666', fontFamily: 'system-ui, sans-serif' }}>
        <Link href="https://rukka.cl/como-funciona" style={{ color: '#1B4F72', textDecoration: 'none' }}>
          Cómo funciona
        </Link>
        {'  ·  '}
        <Link href="https://rukka.cl/homes" style={{ color: '#1B4F72', textDecoration: 'none' }}>
          Explorar hogares
        </Link>
        {'  ·  '}
        <Link href="https://rukka.cl/blog" style={{ color: '#1B4F72', textDecoration: 'none' }}>
          Blog
        </Link>
      </Text>
      <Text style={{ margin: '0 0 8px', fontSize: '12px', color: '#888888', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
        Rukka significa &quot;hogar&quot; en Mapudungun.
      </Text>
      <Text style={{ margin: '0 0 8px', fontSize: '12px', color: '#888888', fontFamily: 'system-ui, sans-serif' }}>
        Síguenos en{' '}
        <Link href="https://twitter.com/rukka_cl" style={{ color: '#1B4F72', textDecoration: 'none' }}>
          @rukka_cl
        </Link>
      </Text>
      <Text style={{ margin: '0 0 8px', fontSize: '12px', color: '#888888', fontFamily: 'system-ui, sans-serif' }}>
        © 2026 Rukka. Todos los derechos reservados.
      </Text>
      <Text style={{ margin: '0', fontSize: '11px', color: '#aaaaaa', fontFamily: 'system-ui, sans-serif' }}>
        <Link href="https://rukka.cl/unsubscribe" style={{ color: '#aaaaaa', textDecoration: 'underline' }}>
          Desuscribirse
        </Link>
      </Text>
    </Section>
  )
}
