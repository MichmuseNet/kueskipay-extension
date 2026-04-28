
export const alliedStores = [ //arreglo de tiendas aliadas (únicamente tenemos a amazon méxico)
  {
    id: "amazon", //identificador interno de la tienda
    name: "Amazon México",
    domain: "amazon.com.mx",
    category: "Marketplace", 
    isOfficialPartner: true, //indica que si es una tienda aliada
    fixedBenefits: [ //lista de beneficios
      "Compra ahora y paga después con Kueski Pay",
      "Pagos flexibles por quincena",
      "Disponible para compras en línea seleccionadas",
    ],
  },
];

export const staticPromotions = [ //lista de promociones estáticas (escritas por nosotros)
  {
    id: "amazon-cupon-1",
    storeId: "amazon",
    title: "Cupón de descuento en compras en línea",
    description:
      "Promoción general aplicable a compras seleccionadas. Su disponibilidad puede variar según el producto.",
    type: "Cupón",
    coupon: "PROMO10",
    expiresAt: "2026-12-31",
  },
  {
    id: "amazon-cupon-2",
    storeId: "amazon",
    title: "Descuento especial en productos seleccionados",
    description:
      "Beneficio promocional usado como referencia dentro del prototipo.",
    type: "Descuento",
    coupon: "KUESKI15",
    expiresAt: "2026-12-31",
  },
  {
    id: "amazon-cupon-3",
    storeId: "amazon",
    title: "Promoción para compras mayores a cierto monto",
    description:
      "Cupón general para incentivar compras en línea con método de pago flexible.",
    type: "Cupón",
    coupon: "AHORRO20",
    expiresAt: "2026-12-31",
  },
];