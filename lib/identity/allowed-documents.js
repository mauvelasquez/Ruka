export const ALLOWED_DOCUMENTS = {
  CL: {
    country: "Chile",
    documents: [
      { type: "national_id",     label: "Cédula de Identidad",  issuer: "Registro Civil" },
      { type: "passport",        label: "Pasaporte",            issuer: "Registro Civil" },
      { type: "drivers_license", label: "Licencia de Conducir", issuer: "Registro Civil / ANTT" }
    ]
  },
  AR: {
    country: "Argentina",
    documents: [
      { type: "national_id",     label: "DNI (Documento Nacional de Identidad)", issuer: "RENAPER" },
      { type: "passport",        label: "Pasaporte",            issuer: "Policía Federal" },
      { type: "drivers_license", label: "Licencia de Conducir", issuer: "provincial" }
    ]
  },
  CO: {
    country: "Colombia",
    documents: [
      { type: "national_id",     label: "Cédula de Ciudadanía", issuer: "Registraduría" },
      { type: "passport",        label: "Pasaporte",            issuer: "Cancillería" },
      { type: "drivers_license", label: "Licencia de Conducción", issuer: "RUNT" }
    ]
  },
  MX: {
    country: "México",
    documents: [
      { type: "national_id",     label: "INE / IFE (Credencial para Votar)", issuer: "INE" },
      { type: "passport",        label: "Pasaporte",            issuer: "SRE" },
      { type: "drivers_license", label: "Licencia de Conducir", issuer: "SEMOVI / estatal" }
    ]
  }
}
