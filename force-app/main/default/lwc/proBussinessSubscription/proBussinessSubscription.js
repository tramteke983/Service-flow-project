import { LightningElement, api } from 'lwc';
import bluetick from "@salesforce/resourceUrl/rightLogo";
import whiteCart from "@salesforce/resourceUrl/cartLogo";

export default class ProBussinessSubscription extends LightningElement {
    rightLogo = bluetick;
    cartLogo = whiteCart;
    probussinessData;
    probussinessFeatures;

    
    @api isProbussinessActive = false;
     @api isDisabled=false;

    async connectedCallback() {
        try {
            const response = await fetch('https://salesforce.serviceflow.ai/api/packages', {
                method: "GET"
            });
            let data = await response.json();

            if (!response.ok) {
                console.log('response is not ok');
            } else if (data && !data.error) {
                console.log('package data : ', JSON.stringify(data));
                this.probussinessData = data.data[1];
                this.probussinessFeatures = JSON.parse(this.probussinessData.addition_features);

            } else if (data.error) {
                console.log('errror occured: ', data.error);
            }
        } catch (error) {
            console.log('catch block executed of transaction get api:  ', error.message);
        }
    }

    handleProbussiness() {
        const myCustomEvent = new CustomEvent('probussinesspay');
        this.dispatchEvent(myCustomEvent);
    }

    get giveCssDynamically() {
        return this.isProbussinessActive ? 'activePackage' : 'divclass';
    }

   
   
}