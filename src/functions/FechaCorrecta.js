export function FechaCorrecta(fecha){
  if (!fecha) {
    return ""; // o cualquier otro valor predeterminado que desees
  }
  const nuevaFecha = new Date(fecha);
  const dia = nuevaFecha.getDate().toString().padStart(2, '0');
  const mes = (nuevaFecha.getMonth() + 1).toString().padStart(2, '0');
  const anio = nuevaFecha.getFullYear().toString();
  return `${anio}-${mes}-${dia}`;
};
