import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css',
})
export class ContactUsComponent {
  public contactForm;

  constructor(private fb: FormBuilder, private emailService: EmailService) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      reason: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  async onSubmit() {
    if (!this.contactForm.valid) {
      return;
    }

    const formValue = this.contactForm.value;

    // Prepare email content
    const subject = `Contact Form: ${formValue.reason}`;
    const emailBody = `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${formValue.firstName} ${formValue.lastName}</p>
      <p><strong>Email:</strong> ${formValue.email}</p>
      <p><strong>Phone:</strong> ${formValue.phone || 'Not provided'}</p>
      <p><strong>Reason:</strong> ${formValue.reason}</p>
      <p><strong>Message:</strong></p>
      <p>${formValue.message ? formValue.message.replace(/\n/g, '<br>') : ''}</p>
    `;

    try {
      // Send email to admin/support (you may want to change this email address)
      await this.emailService.sendEmailTC('thepaddock1game@gmail.com', subject, emailBody);
      alert('Thank you for your message! We will get back to you soon.');
      this.contactForm.reset();
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Sorry, there was an error sending your message. Please try again later.');
    }
  }
}
