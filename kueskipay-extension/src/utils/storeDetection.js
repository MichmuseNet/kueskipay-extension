import { alliedStores, staticPromotions } from "../data/stores";

//funcion que recibe una url completa y extrae solo el dominio

export function getCurrentDomain(url) {
  try {
    const parsedUrl = new URL(url); //convierte el texto de la url en un objeto 
    // que javascript puede leer mejor

    return parsedUrl.hostname.replace("www.", ""); //obtiene el dominio y le quita el www.
  } catch (error) { //try y catch para evitar que la extensión se rompa si la url no es válida
    //si hay una falla regresa un texto vacío
    return "";
  }
}
// esta función recibe la url actual y revisa si pertenece a una tienda aliada
export function detectAlliedStore(url) {
  const currentDomain = getCurrentDomain(url); //obtiene el dominio

  return alliedStores.find((store) => //busca dentro de alliedstores
  // .find() recorre la lista de tiendas y devuelve la primera que cumpla la condición
    currentDomain.includes(store.domain) //esta es la condición, el dominio actual contiene el dominio de esta tienda?
  );
}
// da true o false a ver si detecta la tienda o no

//esta funcion recibe el id de una tienda y busca sus promociones

//si recibe amazon, entonces revisa las promociones y 
// se queda con las que tengan storeid:amazon

export function getPromotionsForStore(storeId) {
  return staticPromotions.filter(

    //.find() devuelve un solo resultado, la primera tienda que encuentre
    // .filter() devuelve una lista de resultados, porque una tienda puede
    //tener varias promociones
    (promotion) => promotion.storeId === storeId
  );
}

//en resumen se limpia la url y se obtiene el dominio, luego se revisa si
//ese dominio coincide con la tienda aliada
// busca promociones que pertenecen a esa tienda