import { LightningElement, wire } from 'lwc';

//import stripeJs from '@salesforce/resourceUrl/stripeJs'; // Import your Static Resource
import { loadScript } from 'lightning/platformResourceLoader';

import orgDomainUrlRef from '@salesforce/apex/OrgInfoController.domainUrl';

import getCustomSetting from '@salesforce/apex/ServiceFlowCustomSetting.getCustomsetting';
import currentUserId from '@salesforce/user/Id';
export default class checkOutSessionStripeSubscription extends LightningElement {

    domainUrl;
    stripeJs;
    apiToken;
    sessionId;
    publisherKey;
    userId = currentUserId;
    subscriptionDetails;
    subscriptionData;

    isJumpstartActive = false;
    isProbussinessActive = false;
    isEnterpriseActive = false;


    @wire(orgDomainUrlRef)
    domainUrl({ data, error }) {
        if (data) {
            this.domainUrl = data;
            console.log('wire executed orgDomainUrlRef: ', JSON.stringify(this.domainUrl));
        }
        if (error) {
            console.log('error: orgDomainUrlRef', JSON.stringify(error));
        }
    }
    // Handler to initiate payment
    @wire(getCustomSetting)
    getApiToken({ data, error }) {
        if (data) {
            this.apiToken = data;
            console.log('in subscription data apiToken from custom setting------>: ', JSON.stringify(data));
        }
        if (error) {
            console.log('error----->: ', JSON.stringify(error));
        }
    }

    async connectedCallback() {
        console.log('Inside connected call back');
        try {
            //  const url = new URL("https://serviceflowai.hktechlabs.com/api/subscription-success");
            const url = new URL("https://salesforce.serviceflow.ai/api/subscription-success");

            url.searchParams.append("user_id", this.userId);

            const response = await fetch(url, {
                method: "GET"
            });
            if (!response.ok) {
                console.log('checkout :Response is not ok------->: Error is occured while put');
            }

            let data = await response.json();
            if (data && !data.error) {
                console.log("checkout : subscription api hit successfully and got data: ", JSON.stringify(data));
                this.subscriptionDetails = data.payment_details;
                this.subscriptionData = data.payment_details[this.subscriptionDetails.length - 1];
                console.log('checkout : this.subscriptionData-------->: ', JSON.stringify(this.subscriptionData));

            } else if (data && data.error) {
                console.error('subscription api hit but returned an error: ', data.error);
            }
        }
        catch (error) {
            console.log('checkout :catch block executed of subscription get api:  ', error.message);
        }

        if (this.subscriptionData) {
            console.log('this.subscriptionData : ', this.subscriptionData);
            console.log('this.subscriptionData.plan_type: **********************', this.subscriptionData.plan_type);
            if (this.subscriptionData.plan_type == "Jumpstart Subscription" && this.subscriptionData.status == 'active') {
                this.isJumpstartActive = true;
            } else if (this.subscriptionData.plan_type == "Pro Business Subscription" && this.subscriptionData.status == 'active') {
                this.isProbussinessActive = true;
            } else if (this.subscriptionData.plan_type == 'Enterprise Subscription' && this.subscriptionData.status == 'active') {
                this.isEnterpriseActive = true;
            }
        } else {
            console.log('this.subscriptionData is null: *************************');
        }
        /*------------------------------------------------------------------------------------ */

        /*try {
            // Load the test script
            let stripeData = await loadScript(this, stripeJs);
            console.log('stripeData loaded------>', stripeData);
            if (window.Stripe) {
                console.log('Stripe.js loaded successfully!');
            } else {
                console.error('Stripe.js not available on window');
            }
            
        } catch (error) {
            console.error('Error loading test.js', error.message);
        }*/



    }

    async handleJumpstartPay() {
        console.log('Button is clicked');
        this.subscriptionFunction(10);
    }

    async handleProbussiness() {
        this.subscriptionFunction(11);
    }

    handleEnterprize() {
        console.log('enterprize button is clicked');
        //this.subscriptionFunction(12);
        window.location.href = 'https://serviceflow.ai/contact/';
        // window.open('https://serviceflow.ai/contact/', '_blank');
    }

    async subscriptionFunction(packageIdParam) {
        //this code is for getting the publisher key and sessionId from server
        try {
            if (this.domainUrl && this.apiToken) {
                // let response = await fetch('https://serviceflowai.hktechlabs.com/api/checkout/create', {
                let response = await fetch('https://salesforce.serviceflow.ai/api/checkout/create', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "salesforce-auth": `Bearer ${this.apiToken}`
                    },
                    body: JSON.stringify({
                        packageId: packageIdParam,
                        instanceUrl: this.domainUrl
                    })
                });

                if (!response.ok) {
                    console.log('Response is not ok------->: Error is occured while post');
                }

                let data = await response.json();
                if (data && !data.error) {
                    console.log("checkout api hit successfully and got data: ", data);
                    this.sessionId = data.checkout_id;
                    console.log('checkoutId: ', this.sessionId);
                    this.publisherKey = data.public_key;
                    console.log('publisherKey: ', this.publisherKey);

                    // ✅ Check for both sessionId and publisherKey before redirect
                    //called vf page
                    if (this.sessionId && this.publisherKey) {
                        const vfUrl = `/apex/servflow__StripePage?key=${encodeURIComponent(this.publisherKey)}&session=${encodeURIComponent(this.sessionId)}`;
                        window.open(vfUrl, '_self'); // redirect to Visualforce page
                    } else {
                        console.error("Missing sessionId or publisherKey.");
                    }

                } else if (data && data.error) {
                    console.error('api hit but returned an error: ', data.error);
                }

            }
        } catch (error) {
            console.error('Catch block while heating checkout api-------> : ', error.message);
        }
    }

    get isAnyPackageActive() {
        return this.isJumpstartActive || this.isProbussinessActive || this.isEnterprizeActive;
    }

    get isJumpstartButtonDisabled() {
        return this.isAnyPackageActive && !this.isJumpstartActive;
    }

    get isProbussinessButtonDisabled() {
        return this.isAnyPackageActive && !this.isProbussinessActive;
    }

    get isEnterprizeButtonDisabled() {
        return this.isAnyPackageActive && !this.isEnterprizeActive;
    }

}