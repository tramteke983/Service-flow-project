import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import ID from '@salesforce/user/Id';
import { getFieldValue, getRecord } from 'lightning/uiRecordApi';
import USER_FIRST_NAME from '@salesforce/schema/User.FirstName';
import USER_LAST_NAME from '@salesforce/schema/User.LastName';
import USER_EMAIL from '@salesforce/schema/User.Email';
import USER_PHONE from '@salesforce/schema/User.Phone';
import USER_COMPANY_NAME from '@salesforce/schema/User.CompanyName';
import USER_COUNTRY from '@salesforce/schema/User.Country';
import USER_STATE from '@salesforce/schema/User.State';
//import aiImage from '@salesforce/resourceUrl/loginPageImage';
import orgDomainUrlRef from '@salesforce/apex/OrgInfoController.domainUrl';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


const userFields = [USER_FIRST_NAME, USER_LAST_NAME, USER_EMAIL, USER_PHONE, USER_COMPANY_NAME,
  USER_COUNTRY, USER_STATE
];

export default class UserForm extends LightningElement {
  userId = ID;
  apiToken;
  @track modifiedData = {};
  @wire(getRecord, { recordId: '$userId', fields: userFields })
  userDetails;

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

  get firstName() {
    return this.modifiedData.fisrtName || getFieldValue(this.userDetails.data, USER_FIRST_NAME);
  }
  get lastName() {
    return this.modifiedData.lastName || getFieldValue(this.userDetails.data, USER_LAST_NAME);
  }
  get email() {
    return this.modifiedData.email || getFieldValue(this.userDetails.data, USER_EMAIL);
  }
  get phone() {
    return this.modifiedData.phone || getFieldValue(this.userDetails.data, USER_PHONE);
  }
  get country() {
    return this.modifiedData.country || getFieldValue(this.userDetails.data, USER_COUNTRY);
  }
  get company() {
    return this.modifiedData.company || getFieldValue(this.userDetails.data, USER_COMPANY_NAME);
  }
  get state() {
    return this.modifiedData.state || getFieldValue(this.userDetails.data, USER_STATE);
  }

  handleInput(event) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    this.modifiedData[fieldName] = fieldValue;
    console.log('this.modifiedData: ', JSON.stringify(this.modifiedData));
    this.phoneValidation();
   
  }

  phoneValidation(){
    // Select phone input element
    const phone = this.modifiedData.phone;
    const phoneInput = this.template.querySelector('.phoneClass');

    if(phone.length < 10 || phone.length > 10 ){
        console.log('if block og handlephone');
        phoneInput.setCustomValidity('Enter 10 digit number only');
        phoneInput.reportValidity();
      }
      else{
        console.log('else block og handlephone');
        phoneInput.setCustomValidity('');
        phoneInput.reportValidity();
      }
    
  }

  
  async submitButton() {
    console.log('submit button clisked...');
    
    
    if (this.userDetails.data) {
      //assign getters variables to variable
      const firstName = this.firstName;
      console.log('firstName on submit: ', firstName);
      const lastName = this.lastName;
      console.log('lastname on submit: ', lastName);
      const email = this.email;
      console.log('email on submit: ', email);
      const phone = this.phone;
      console.log('phone on submit: ', phone);
      const company = this.company;
      console.log('comp on submit: ', company);
      const country = this.country;
      console.log('country on submit: ', country);
      const state = this.state;
      console.log('state on submit: ', state);

      try {
        if(this.domainUrl){
          //https://salesforce.serviceflow.ai
          //let response = await fetch(`https://serviceflowai.hktechlabs.com/api/update/${this.userId}`, {

          let response = await fetch(`https://salesforce.serviceflow.ai/api/update/${this.userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.apiToken}`
            },
            body: JSON.stringify({
              fname: firstName,
              lname: lastName,
              email: email,
              telephone: phone,
              company: company,
              country: country,
              state: state
            })
          });

          if (!response.ok) {
            console.log('Response is not ok------->: Error is occured while put');
            
              /*const successEvent = new ShowToastEvent({
              title: 'Error Occured',
              variant: 'error',
              message:
                'Something went wrong !',
              });
              this.dispatchEvent(successEvent);*/
          }
  
          let data = await response.json();
          if(data && !data.errors){
            console.log("Data updated/received successfully : ", data);
              const successEvent = new ShowToastEvent({
              title: 'Submitted Successfully',
              variant: 'success',
              message:
                'Your details submitted successfully.',
              });
              this.dispatchEvent(successEvent);

            //window.location.href = `${this.domainUrl}/lightning/n/sflowai__Service_Flow_Page?status__c=openSubscription`;
          }else if (data && data.errors) {
                    console.error('api hit but returned an error: ', JSON.stringify(data.errors));

                   /* const errorEvent = new ShowToastEvent({
                    title: 'User data is not submitted !',
                    variant: 'error',
                    message:  data.errors.message,
                    });
                    this.dispatchEvent(errorEvent);*/

            }
          
        }
       
      } catch (error) {
        console.error('Catch block-------> : ', error.message);
      }
    }


  }

}