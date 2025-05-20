import { LightningElement } from 'lwc';

export default class ServiceFlowTabs extends LightningElement {
    // Track the active tab
    isUserDetailsActive = false;
    isSubscriptionActive = false;
    isBillingHistoryActive = false;
    isBussinessDetailsActive = false;
    isDashboardActive = false;
    isLogoutActive = false;

  
    connectedCallback() {

        const urlParams = new URLSearchParams(window.location.search);
        this.status = urlParams.get('status__c');

        if (this.status === 'openSubscription') {
            console.log('openSubscription-----------');
            this.isUserDetailsActive = false;
            this.isSubscriptionActive = true;
            this.isBillingHistoryActive = false;
            this.isBussinessDetailsActive = false;
            this.isDashboardActive = false;
            this.isLogoutActive = false;
        } else if (this.status === 'jumpstartsuccessful') {
            console.log('jumpstartsuccessful---');
            this.isUserDetailsActive = false;
            this.isSubscriptionActive = false;
            this.isBillingHistoryActive = true;
            this.isBussinessDetailsActive = false;
            this.isDashboardActive = false;
            this.isLogoutActive = false;
        } else if (this.status === 'jumpstartcancel') {
            console.log('jumpstartcancel----');
            this.isUserDetailsActive = false;
            this.isSubscriptionActive = true;
            this.isBillingHistoryActive = false;
            this.isBussinessDetailsActive = false;
            this.isDashboardActive = false;
            this.isLogoutActive = false;
        } else if (this.status === 'probussinesssuccessful') {
            console.log('probussinesssuccessful---');
            this.isUserDetailsActive = false;
            this.isSubscriptionActive = false;
            this.isBillingHistoryActive = true;
            this.isBussinessDetailsActive = false;
            this.isDashboardActive = false;
            this.isLogoutActive = false;
        } else if (this.status === 'probussinesscancel') {
            console.log('probussinesscancel----');
            this.isUserDetailsActive = false;
            this.isSubscriptionActive = true;
            this.isBillingHistoryActive = false;
            this.isBussinessDetailsActive = false;
            this.isDashboardActive = false;
            this.isLogoutActive = false;
        }
    }

  
    // Handle tab click event
    handleTabClick(event) {
        console.log('button click');
        // Reset all tabs to inactive
       
        // Set the active tab based on the clicked tab's data-id
        const tabId = event.target.closest('li').dataset.id; // Get the data-id of the clicked tab
        console.log('tabId---------> : ', tabId);
        if (tabId === 'user-details') {
            this.isUserDetailsActive = true;
            this.isSubscriptionActive = false;
            this.isBillingHistoryActive = false;
            this.isBussinessDetailsActive = false;
            this.isDashboardActive = false;
            
            console.log('User Details Active');
        } else if (tabId === 'subscription') {
            this.isUserDetailsActive = false;
            this.isSubscriptionActive = true;
            this.isBillingHistoryActive = false;
            this.isBussinessDetailsActive = false;
            this.isDashboardActive = false;
            
            console.log('sub Active');
        } else if (tabId === 'billing-history') {
            this.isUserDetailsActive = false;
            this.isSubscriptionActive = false;
            this.isBillingHistoryActive = true;
            this.isBussinessDetailsActive = false;
            this.isDashboardActive = false;
            
            console.log('bill Active');

        } else if (tabId === 'bussiness-details') {
            this.isUserDetailsActive = false;
            this.isSubscriptionActive = false;
            this.isBillingHistoryActive = false;
            this.isBussinessDetailsActive = true;
            this.isDashboardActive = false;
            
            console.log('buss Active');

        } else if (tabId === 'dashboard') {
            this.isUserDetailsActive = false;
            this.isSubscriptionActive = false;
            this.isBillingHistoryActive = false;
            this.isBussinessDetailsActive = false;
            this.isDashboardActive = true;
            
            console.log('dash Active');

        } else if(tabId === 'log-out'){
            console.log('logout active');
            const customEvent = new CustomEvent('logout');
            this.dispatchEvent(customEvent);
        }else {
            console.log('else block');
        }
    }

    
}