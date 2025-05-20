import { LightningElement, wire } from 'lwc';

import orgDomainUrlRef from '@salesforce/apex/OrgInfoController.domainUrl';


export default class LoginComponent extends LightningElement {
  domainUrl;

  @wire(orgDomainUrlRef)
  domainUrl({ data, error }) {
    if (data) {
      this.domainUrl = data;
      console.log('wire executed: ', JSON.stringify(this.domainUrl));
    }
    if (error) {
      console.log('error: ', JSON.stringify(error));
    }
  }

  // Function to redirect to Salesforce OAuth 2.0 authorization endpoint
  async aiRedirectServer() {
    
    if (this.domainUrl) {
      // Prepare stateData and encode domainUrl into state
      console.log('this.domainUrl',this.domainUrl);
      const stateData = encodeURIComponent(JSON.stringify(this.domainUrl));
      const redirectUrl = 'https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=3MVG9rZjd7MXFdLjywntq9mOPN7nPgBFoT4P4AQcTywVIFl2mLFSH5.PZ8UjiNao8IWZSC7OgBmtkE0Dkqlrc&redirect_uri=https://salesforce.serviceflow.ai/api/home/auth/salesforce&scope=full';
      //const redirectUrl = 'https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=3MVG9bZIBBVRES4FfU8Xk..nvm7ECptMQT2aRDAgGfhvEukgDoFajzk1cGr_x_KJfyhsJoCwkd8s9f.hHTyCl&redirect_uri=https://salesforce.serviceflow.ai/api/home/auth/salesforce&scope=full';

      console.log('redirectUrl--->',redirectUrl);
      window.location.href = redirectUrl;
    
    }
  }

}