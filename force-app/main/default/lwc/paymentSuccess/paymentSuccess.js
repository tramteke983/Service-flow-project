import { LightningElement ,wire} from 'lwc';
import currentUserId from '@salesforce/user/Id';

export default class PaymentSuccess extends LightningElement {
    userId=currentUserId;
    transactionDetails;
    isTransactionFound = false;
    isLoading = true;
  async connectedCallback() {
    
        console.log('Full URL: ', window.location.href);  // Log the URL for debugging
        const urlParams = new URLSearchParams(window.location.search);
        console.log('urlParamss:>>>',urlParams);
        this.status = urlParams.get('status__c');  // Capture the 'status' parameter
        console.log('urlParamss:>>>',this.status);

        await this.showTransaction();
        if(this.transactionDetails && this.transactionDetails.length>0){
            this.isTransactionFound = true;
        }

        if (this.status === 'jumpstartsuccessful') {
            console.log('Jumpstart Payment was successful!');
        }else if(this.status==='probussinessSuccess'){
            console.log('probussiness Payment was successful!');
        }else{
            console.log('status not found in query');
        }
        await this.hitSubscriptionApi();

       this.isLoading = false; // ✅ Mark loading complete after everything

    }

     async hitSubscriptionApi(){
         try {
            const url = new URL("https://salesforce.serviceflow.ai/api/subscription-success");
            url.searchParams.append("user_id", this.userId);

            const response = await fetch(url, { method: "GET" });

            if (!response.ok) {
                console.log('Response is not ok');
            }

            let data = await response.json();
            if (data && !data.error) {
                console.log("API success:", JSON.stringify(data));
                this.subscriptionDetails = data.payment_details;
                this.subscriptionData = this.subscriptionDetails[this.subscriptionDetails.length - 1];

                if (this.subscriptionData) {
                    const { plan_type, status } = this.subscriptionData;
                    if (plan_type === "Jumpstart Subscription" && status === 'active') {
                        this.isJumpstartActive = true;
                    } else if (plan_type === "Pro Business Subscription" && status === 'active') {
                        this.isProbussinessActive = true;
                    } else if (plan_type === "Enterprise Subscription" && status === 'active') {
                        this.isEnterprizeActive = true;
                    }
                }
            } else if (data?.error) {
                console.error('API returned error:', data.error);
            }
        } catch (error) {
            console.error('Fetch error:', error.message);
        } 
    }

   async showTransaction(){
    console.log('User Id : ',this.userId);
        try{
           // const url = new URL("https://serviceflowai.hktechlabs.com/api/payment-success");
           const url = new URL("https://salesforce.serviceflow.ai/api/payment-success");

            url.searchParams.append("user_id",this.userId);

            const response = await fetch(url,{
              method:"GET"
            });
            if (!response.ok) {
              console.log('Response is not ok------->: Error is occured while put');
          }

          let data = await response.json();
          if (data && !data.error) {
              console.log("transaction api hit successfully and got data: ", JSON.stringify(data));
              this.transactionDetails = data.payment_details;
              console.log("transactionDetails: ", JSON.stringify(this.transactionDetails));
              
             
          } else if (data && data.error) {
              console.error('transaction api hit but returned an error: ', data.error);
          }
          }
          catch(error){
           console.log('catch block executed of transaction get api:  ',error.message);
          }
    }
    handleButton(){
      window.location.href="https://cloudintellect680-dev-ed.develop.lightning.force.com/lightning/n/serv__Dashboard_Page";
    }

     get isPlanActive() {
        return !this.isLoading && (this.isJumpstartActive || this.isProbussinessActive || this.isEnterprizeActive);
    }

    // Optional: Add class for status styling
    get statusClass() {
        return this.subscriptionData && this.subscriptionData.status === 'active' ? 'activeStatus' : 'inactiveStatus';
    }
    
}