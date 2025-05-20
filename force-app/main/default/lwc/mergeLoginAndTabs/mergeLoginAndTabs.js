import { LightningElement } from 'lwc';
import createOrUpdateCustomSetting from '@salesforce/apex/ServiceFlowCustomSetting.createOrUpdateCustomSetting';
import makeNullCustomSetting from '@salesforce/apex/ServiceFlowCustomSetting.blankCustomSetting';
export default class MergeLoginAndTabs extends LightningElement {
  openLogin = true;
  openTabs = false;
  status;
  apiToken;

  connectedCallback() {
    //if in query paramter there is apiToken run below code
    console.log('User Id :', this.userId);
    console.log('Connected call back......');
    const urlParams = new URLSearchParams(window.location.search);
  
    console.log('URL Parameters:', urlParams);
    this.apiToken = urlParams.get('apitoken__c');
    this.status = urlParams.get('status__c');

    if (this.apiToken) {
      //if apiToken is present in url, that means user is authenticated,close the login tab
      this.openLogin = false;
      this.openTabs = true;

      console.log('API Token:', this.apiToken);
      createOrUpdateCustomSetting({apiTokenParam: this.apiToken })
        .then((result) => {
          console.log('custom setting created or updated successfully');

        })
        .catch((error) => {
          console.log('Error occured while creating or updating custom setting.... ',JSON.stringify(error));
        })

    }
    else if (this.status === 'openSubscription' || this.status === 'jumpstartsuccessful' 
      || this.status==='jumpstartcancel' || this.status=== 'probussinessSuccessfull') {
      console.log('openSubscription---->');
      this.openLogin = false;
      this.openTabs = true;

    } else {
      console.log('status not found in query');
    }

   
  }

  handleLogout(){
    console.log('Custom event listened in parent component');
    this.openLogin = true;
    this.openTabs = false;

    makeNullCustomSetting({})
    .then(()=>{
      console.log('custom setting field is null successfully');
    }).catch((error)=>{
      console.log('failed to make null: ',JSON.stringify(error));
    })
  }

}