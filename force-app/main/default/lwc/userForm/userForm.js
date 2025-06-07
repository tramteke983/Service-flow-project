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
  console.log('submit button clicked...');

  if (this.userDetails.data) {
    const firstName = this.firstName;
    const lastName = this.lastName;
    const email = this.email;
    const phone = this.phone;
    const company = this.company;
    const country = this.country;
    const state = this.state;

    try {
      if (this.domainUrl) {
        console.log('User Id :>>>>>>>> ', this.userId);

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
          console.error('Response is not OK');
          this.dispatchEvent(new ShowToastEvent({
            title: 'Submission Failed',
            message: 'Unable to submit your details. Please try again later.',
            variant: 'error'
          }));
          return; // ✅ Stop execution here
        }

        let data = await response.json();

        if (data && !data.errors) {
          console.log("Data updated successfully: ", data);
          this.dispatchEvent(new ShowToastEvent({
            title: 'Submitted Successfully',
            message: 'Your details were submitted successfully.',
            variant: 'success'
          }));

        } else if (data && data.errors) {
          console.error('API returned error: ', data.errors);
          this.dispatchEvent(new ShowToastEvent({
            title: 'Submission Error',
            message: 'Failed to update user data: ' + (data.errors.message || 'Unknown error.'),
            variant: 'error'
          }));
        }
      }

    } catch (error) {
      console.error('Exception occurred: ', error.message);
      this.dispatchEvent(new ShowToastEvent({
        title: 'Network Error',
        message: 'Something went wrong while submitting. Please check your network or try again later.',
        variant: 'error'
      }));
    }
  }
}


}