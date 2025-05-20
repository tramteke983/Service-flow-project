import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class BussinessDetails extends LightningElement {

  bussinessName;
  bussinessType;
  website;
  phone;
  email;
  link;

  /** "bname": "My Business",
    "btype": "Retail",
    "website": "https://mybusiness.com/",
    "phone": "1234567890",
    "busines_email": "info13@mybusiness.com",
    "social_link": "https://instagram.com/mybusiness" */
  async handleSubmitButton() {
    let response = await fetch('https://salesforce.serviceflow.ai/api/business-deatils', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bname: this.bussinessName,
        btype: this.bussinessType,
        website: this.website,
        phone: this.phone,
        busines_email: this.email,
        social_link: this.link
      })
    })

    if (!response.ok) {
      console.log('Response is not ok------->: Error is occured while post');
    }

    let data = await response.json();
    if (data && !data.error) {
      console.log("bussiness-detail api hit successfully and got data: ", data);
      
       //send toast message
       const event = new ShowToastEvent({
        title: 'Submitted Successfully',
        variant: 'success',
        message:
          'Your bussiness details submitted successfully.',
      });
      this.dispatchEvent(event);

    } else if (data && data.error) {
      console.error('bussiness-detail api hit but returned an error: ', data.error);
    }

    /* const event = new ShowToastEvent({
          title: 'Submitted Successfully',
          variant: 'success',
          message:
              'Your bussiness details submitted successfully.',
      });
      this.dispatchEvent(event);*/
  }

  handleName(event) {
    this.bussinessName = event.target.value;
  }

  handleType(event) {
    this.bussinessType = event.target.value;
  }
  handleWebsite(event) {
    this.website = event.target.value;
  }

  handlePhone(event) {
    this.phone = event.target.value;
    console.log('this.phone: ', this.phone);
    let phoneInput = this.template.querySelector(".phoneClass");
    console.log('phoneInput:', phoneInput);
    if (this.phone.length < 10 || this.phone.length > 10) {
      console.log('if block og handlephone');
      phoneInput.setCustomValidity('Enter 10 digit number only');
      phoneInput.reportValidity();
    }
    else {
      console.log('else block og handlephone');
      phoneInput.setCustomValidity('');
      phoneInput.reportValidity();
    }
  }

  handleEmailAddress(event) {
    this.email = event.target.value;

    let emailInput = this.template.querySelector(".emailClass");

    if (this.email.includes('@') && this.email.includes('.')) {
      emailInput.setCustomValidity(''); 
    } else {
      emailInput.setCustomValidity('Enter a valid email address.'); // ✅ Show error if invalid
    }

    emailInput.reportValidity();
  }

  handleLinks(event) {
    this.link = event.target.value;
  }


}