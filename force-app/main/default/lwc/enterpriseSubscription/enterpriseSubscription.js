import { LightningElement, api } from 'lwc';
import bluetick from "@salesforce/resourceUrl/rightLogo";
import whiteCart from "@salesforce/resourceUrl/cartLogo";

export default class EnterpriseSubscription extends LightningElement {
    rightLogo=bluetick;
    cartLogo=whiteCart;
    eneterpriseData;
    
    @api isEnterprizeActive = false;
    @api isDisabled=false;

    async connectedCallback() {
        try {
            const response = await fetch('https://salesforce.serviceflow.ai/api/packages', {
                method: "GET"
            });
            if (!response.ok) {
                console.log('response is not ok');
            } 

            let data =await  response.json();
            if (data && !data.error) {
                console.log('package data : ', JSON.stringify(data));
                this.eneterpriseData = data.data[2];
                console.log('eneterpriseData: ', JSON.stringify(this.eneterpriseData));
                this.enterpriseFeatures = JSON.parse(this.eneterpriseData.addition_features);
                console.log('enterpriseFeatures: ', JSON.stringify(this.enterpriseFeatures));
            } else if (data.error) {
                console.log('errror occured: ', data.error);
            }

            
        } catch (error) {
            console.log('catch block executed of transaction get api:  ', error.message);
        }
    }

    handleEnterPrize(){
        const myCustomEvent = new CustomEvent('enterprizesubscription');
        this.dispatchEvent(myCustomEvent);
    }

    

    
}