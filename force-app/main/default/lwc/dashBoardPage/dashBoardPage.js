import { LightningElement, api } from 'lwc';
import currentUserId from '@salesforce/user/Id';

export default class DashBoardPage extends LightningElement {
    isSubscriptionActive = true;
    userId = currentUserId;
    subscriptionDetails;
    subscriptionData = [];

    isJumpstartActive = false;
    isProbussinessActive = false;
    isEnterprizeActive = false;

    isLoading = true;

    async connectedCallback() {
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
        } finally {
            this.isLoading = false; // ✅ Hide spinner after all logic
        }
    }

  
    handleClick() {
        window.open("https://serviceflow.ai/", "_blank");
    }

    get isPlanActive() {
        return !this.isLoading && (this.isJumpstartActive || this.isProbussinessActive || this.isEnterprizeActive);
    }

    // Optional: Add class for status styling
    get statusClass() {
        return this.subscriptionData && this.subscriptionData.status === 'active' ? 'activeStatus' : 'inactiveStatus';
    }
}
