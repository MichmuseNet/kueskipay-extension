import { useEffect, useState } from "react";
 //useState para guardar datos que pueden cambiar como el monto de compra 
 // o la detección de la tienda

 //useEffect para ejecutar una acción cuando se abre el popup, 
 // en este caso, leer la pestaña del navegador
import "./popup.css";
import {detectAlliedStore,getPromotionsForStore,} from "../utils/storeDetection";
import {calculatePaymentPlan,formatCurrency,} from "../utils/payments";

function Popup() { //estados del componente, guardan url, guarda tienda detectada
  //guarda promociones dque pertenecen a la tienda
  const [currentUrl, setCurrentUrl] = useState("");
  const [store, setStore] = useState(null);
  const [promotions, setPromotions] = useState([]);
  //estados del simulador, monto de compra inicial, número de quincenas
  // indicador si el usuario activó el escenario con atraso
  const [amount, setAmount] = useState(5000);
  const [installments, setInstallments] = useState(4);
  const [isLatePayment, setIsLatePayment] = useState(false);

  //cuando se abre el popup, el codigo checa con chrome cual es la pestaña activa
  //en la ventana, o sea obtiene el url de la tienda

  useEffect(() => {
    async function getCurrentTab() {
      try {
        // Verificamos que chrome.tabs exista (para el entorno de extensión)
        if (typeof chrome !== "undefined" && chrome.tabs) {
          const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
          });
//guarda url en el estado currenturl
          const url = tab?.url || "";
          setCurrentUrl(url);
//manda la url a detectalliedstore, comparando el dominio con las tiendas en stores.js
//si encuentra amazon entonces guarda amazon en store
//si n oencuentra nada regresa null
          const detectedStore = detectAlliedStore(url);
          setStore(detectedStore || null);
//si encontró tienda aliada busca las promociones relacionadas con esa tienda
//busca promociones donde el storeid sea "amazon"
          if (detectedStore) {
            const storePromotions = getPromotionsForStore(detectedStore.id);
            setPromotions(storePromotions);
          }
        }
      } catch (error) {
        console.error("Error al obtener la pestaña actual:", error);
      }
    }

    getCurrentTab();
  }, []);
//cada que el monto cambia, las quincenas o el escenario de atraso se recalcula
//el plan de pagos
  const paymentPlan = calculatePaymentPlan({
    amount: Number(amount), // Aseguramos que sea número para el cálculo
    installments: Number(installments),
    isLatePayment,
  });
//esta funcion devuelve total, paymentperinstallment, latefee, schedule
  return (
    <main className="popup-container"> {/*todo lo que se muestra está en pop-up-container,
    ese main es el contenedor principal de la ventana*/}

      <section className="header-card"> {/*tarjeta superior morada que muestra el titulo y 
      funcionamiento de la extension*/}
        <div>
          <p className="eyebrow">KueskiPay Assistant</p>
          <h1>Compra con más claridad</h1>
          <p className="subtitle">
            Verifica tiendas, revisa promociones y simula tus pagos por quincena.
          </p>
        </div>
      </section>
{/*en la línea de abajo, aqui el CSS cambia dependiendo si hay tienda detectada, 
si Store existe, usa clase Verified, 
si Store es null, usa clase not-Verified*/}

      <section className={`status-card ${store ? "verified" : "not-verified"}`}>
        
        {/*luego viene una condicion, esto significa que si hay una tienda detectada
        entonces muestra el mensaje al usuario de que fue detectada, también muestra 
        los beneficios, ese .map() recorre la lista de beneficios de amazon y crea
        una etiqueta por cada beneficio*/}
        {store ? (
          <>
            <div className="status-top">
              <span className="status-icon">✓</span>
              <div>
                <h2>Tienda verificada</h2>
                <p>{store.name}</p>
              </div>
            </div>

            <div className="benefits-list">
              {store.fixedBenefits.map((benefit) => (
                <span key={benefit}>{benefit}</span>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="status-top">
              <span className="status-icon warning">!</span>
              <div>
                <h2>Tienda no detectada</h2>
                <p>
                  Esta página no aparece como tienda aliada dentro del prototipo.
                </p>
              </div>
            </div>
          </>
        )}
      </section>
{/* aqui se indica que la sección de promociones solo aparece si la tienda fue detectada
 por ejemplo, si estas en google no aparece, si estas en amazon si aparece*/}
      {store && (
        <section className="card">
          <div className="section-title">
            <h2>Promociones disponibles</h2>
            <p>Datos estáticos para el MVP</p>
          </div>
{/*estas lineas recorren todas las promociones de amazon y crea una tarjeta por cada una*/}
          <div className="promotions">
            {promotions.map((promo) => (
              <article className="promo-card" key={promo.id}>
                <div>
                  {/*muestra el tipo de promocion, titulo y descripcion*/}
                  <span className="promo-type">{promo.type}</span>
                  <h3>{promo.title}</h3>
                  <p>{promo.description}</p>
                </div>
{/* estas lineas signofican que el cupón solo se muestra si existe, si una promocion no tuviera cupón, 
no aparecería el recuadro de cupón*/}
                {promo.coupon && (
                  <div className="coupon">
                    <span>Cupón</span>
                    <strong>{promo.coupon}</strong>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
{/* aqui es el simulador de quincenas, esta seccion siempre aparece, aunque la tienda no esté detectada
esta sección tiene dos campos principales*/}
      <section className="card">
        <div className="section-title">
          <h2>Simulador de quincenas</h2>
          <p>Calcula un plan aproximado de pago</p>
        </div>

        <div className="form-grid">
          <label>
            Monto de compra
            {/*este input permite cambiar el monto de compra, cuando escribes otro número,
            se actualiza amount*/}
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </label>
{/* luego está esta sección, permite elegir el número de quincenas: 2,4,6 u 8. cuando cambias la opción,
se actualiza installments*/}
          <label>
            Número de quincenas
            <select
              value={installments}
              onChange={(event) => setInstallments(event.target.value)}
            >
              <option value="2">2 quincenas</option>
              <option value="4">4 quincenas</option>
              <option value="6">6 quincenas</option>
              <option value="8">8 quincenas</option>
            </select>
          </label>
        </div>

        <div className="toggle-row">
          <span>Escenario puntual</span>
          <label className="switch">
{/*este es el switch de escenario puntual o con atraso, este checkbox funciona como switch
si está apagado es un escenario puntual
si está encendido es un escenario con atraso
cuando lo activas, islatepayment cambia a true, y entonces calculatepaymentplan agrega el cargo con atraso */}
            <input
              type="checkbox"
              checked={isLatePayment}
              onChange={() => setIsLatePayment(!isLatePayment)}
            />
            <span className="slider"></span>
          </label>
          <span>Escenario con atraso</span>
        </div>
{/* resumen de pago, aqui se muestran tres resultados*/}
        <div className="summary-grid">
          <div>
            <span>Total a pagar</span>
            <strong>{formatCurrency(paymentPlan.total)}</strong> {/*total a pagar*/}
          </div>

          <div>
            <span>Pago por quincena</span>
            <strong>{formatCurrency(paymentPlan.paymentPerInstallment)}</strong>{/*pago con quincena*/}
          </div>

          <div>
            <span>Cargo por atraso</span>
            <strong>{formatCurrency(paymentPlan.lateFee)}</strong> {/*pago por atraso*/}
          </div>
        </div>
{/*format currency convierte números normales en formato de pesos mexicanos, por ejemplo: 5000 a $5,000*/}
        <div className="schedule">
          <h3>Tabla de pagos</h3>
{/*tabla de pagos, esta parte recorre la tabla de pagos calculada*/}
          {paymentPlan.schedule.map((payment) => (
            <div className="schedule-row" key={payment.installmentNumber}>
              {/*por cada quincena, muestra algo como: Quincena 1 | 12 may 2026 | $1,250.00 
              como en un formato de tabla*/}
              <span>Quincena {payment.installmentNumber}</span>
              <span>{payment.date}</span>
              <strong>{formatCurrency(payment.amount)}</strong>
            </div>
          ))}
        </div>
      </section>
{/*disclaimer final, este texto aclara que las promociones so datos estáticos y 
que no representan una oferta real vigente*/}
      <p className="disclaimer">
        Prototipo académico. Las promociones son datos estáticos de referencia y no representan una oferta real vigente.
      </p>
    </main>
  );
}

export default Popup;