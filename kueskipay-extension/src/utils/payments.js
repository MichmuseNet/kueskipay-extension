// funcion principal, aqui se declara una funcion
//llamada calculatePaymentPlan
// recibe un objeto con tres datos: amount, que es el monto de compra
// installments que son el numero de quincenas
//isLatePayment=false, indica que el usuario activó el escenario con atraso,
// por defecto es false, o sea un pago puntual

//el export significa que esta funcion puede usarse en otro archivo, 
//como en popup.jsx

export function calculatePaymentPlan({
  amount,
  installments,
  isLatePayment = false,
}) {
  //convierte los datos a número

//convierte amount e installments a número
// los valores vienen de un input o un select normalmente
//llegan como texto

  const purchaseAmount = Number(amount);
  const numberOfInstallments = Number(installments);
//validación esta parte checa si el monto o el número de quincenas no son válidos
// esto para regresar valores en cero
  if (!purchaseAmount || !numberOfInstallments) {
    return {
      total: 0,
      paymentPerInstallment: 0,
      lateFee: 0,
      schedule: [],
    };
  }
// calcula cargo por atraso
  const lateFeeRate = isLatePayment ? 0.08 : 0; //esta línea usa un operador ternario
  // significa que si latepayment es true, latefeerate vale 0.08, si es false, latefeerate vale 0
  //donde 0.08 representa un 8% de cargo por atraso
  const lateFee = purchaseAmount * lateFeeRate; //entonces esta linea calcula el cargo
  const total = purchaseAmount + lateFee; // el total es el monto de compra más el cargo por atraso
  const paymentPerInstallment = total / numberOfInstallments; //calcula pago por quincena


  //tabla de pagos
  //la linea de abajo crea un arreglo con tantas posiciones como quincenas haya
  //si numberofinstallments es 4, crea 4 elementos
  //index comienza en cero
  //0,1,2,3
  const schedule = Array.from({ length: numberOfInstallments }, (_, index) => {
    
    //crea una fecha con el día actual, luego le suma 15 días por quincena
    // por eso usa 15 * (index + 1)
    const paymentDate = new Date();
    paymentDate.setDate(paymentDate.getDate() + 15 * (index + 1));
//regresa cada fila de la tabla
//por cada quincena crea un objeto con tres datos
    return {
      installmentNumber: index + 1,
      date: paymentDate.toLocaleDateString("es-MX", { //fecha formateada en español méxico
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      amount: paymentPerInstallment, //monto que se paga en esa quincena
    };
  });
//regresa resultado completo, al final, la función regresa los calculos
  return {
    total,
    paymentPerInstallment,
    lateFee,
    schedule,
  };
}
//función formatcurrency
//esat funcion convierte un numero normal en formato de dinero mexicano
export function formatCurrency(value) {
  return new Intl.NumberFormat("es-MX", { //es-MX indica usar formato de méxico
    style: "currency",
    currency: "MXN", //indica que la moneda es peso mexicano
  }).format(value);
}