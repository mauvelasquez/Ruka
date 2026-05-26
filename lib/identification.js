export const COUNTRY_ID_CONFIG = {
  CL: {
    label: 'RUT',
    doc_type: 'rut',
    description: 'Cédula de Identidad chilena',
    format_hint: '12.345.678-9',
  },
  AR: {
    label: 'DNI',
    doc_type: 'dni_ar',
    description: 'Documento Nacional de Identidad argentino',
    format_hint: '12 345 678',
  },
  CO: {
    label: 'Cédula de Ciudadanía',
    doc_type: 'cedula_co',
    description: 'Cédula de Ciudadanía colombiana',
    format_hint: '1.234.567.890',
  },
  MX: {
    label: 'CURP',
    doc_type: 'curp_mx',
    description: 'Clave Única de Registro de Población (CURP)',
    format_hint: 'ABCD123456HDFXXX00',
  },
}

export const SUPPORTED_COUNTRIES = ['CL', 'AR', 'CO', 'MX']

export const COUNTRY_NAMES = {
  CL: 'Chile', AR: 'Argentina', CO: 'Colombia', MX: 'México',
}
