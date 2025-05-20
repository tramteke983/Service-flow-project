import { LightningElement ,api} from 'lwc';
import bluetick from "@salesforce/resourceUrl/rightLogo";
import whiteCart from "@salesforce/resourceUrl/cartLogo";

export default class JumpstartSubscription extends LightningElement {
    rightLogo = bluetick;
    cartLogo = whiteCart;
    jumpstartData;
    @api isJumpstartActive = false;


    @api isDisabled=false;

    async connectedCallback() {
        try {
            const response = await fetch("https://salesforce.serviceflow.ai/api/packages", {
                method: "GET"
            });
            let data = await response.json();

            if (!response.ok) {
                console.log('response is not ok');
            } else if (data && !data.error) {
                console.log('package data : ', JSON.stringify(data));
                this.jumpstartData = data.data[0];
                this.jumpstartFeatures = JSON.parse(this.jumpstartData.addition_features);
            } else if (data.error) {
                console.log('errror occured: ', data.error);
            }
        } catch (error) {
            console.log('catch block executed of transaction get api:  ', error.message);
        }
    }

    jumpstartPayment() {
        console.log('jumpstart button is clicked');
        const myCustomEvent = new CustomEvent('jumpstartpay');
        this.dispatchEvent(myCustomEvent);
    }
     get giveCssDynamically(){
        return this.isJumpstartActive? 'activePackage':'divclass';
     }

    

}