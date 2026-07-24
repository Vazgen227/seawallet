import type { Currency } from "../types/types";

async function fetchCurrency(c: Currency) {
    try{
        const responce = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${c}.json`)
                    if(!responce.ok){
            throw new Error(`Failed to fetch currency rates ${c}`)
         }
         const data = await responce.json()


         const rate = data[c]
         
         return rate;

    }catch(err) {
        throw new Error(`Failed to fetch currency rates ${err}`)
    }

}

export {fetchCurrency}