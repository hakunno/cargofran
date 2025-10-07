const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const admin = require('firebase-admin');
admin.initializeApp();
const nodemailer = require('nodemailer');

const gmailEmail = defineSecret('GMAIL_EMAIL');
const gmailPassword = defineSecret('GMAIL_PASSWORD');

// 1. Email on request submission (onCreate shipRequests)
exports.sendRequestConfirmation = onDocumentCreated({
  document: 'shipRequests/{requestId}',
  secrets: [gmailEmail, gmailPassword]
}, async (event) => {
  const data = event.data.data();
  console.log('Attempting to send email to:', data.email); // Debug
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailEmail.value(),
      pass: gmailPassword.value(),
    },
  });
  const mailOptions = {
    from: gmailEmail.value(),
    to: data.email,
    subject: 'Shipping Request Submitted',
    text: `Dear ${data.name},\n\nYour shipping request has been submitted successfully. We will review it and get back to you soon.\n\nThank you!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to:', data.email);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
});

// 2. Email on request status update (Accepted or Rejected) (onUpdate shipRequests)
exports.sendRequestStatusUpdate = onDocumentUpdated({
  document: 'shipRequests/{requestId}',
  secrets: [gmailEmail, gmailPassword]
}, async (event) => {
  const newData = event.data.after.data();
  const oldData = event.data.before.data();

  if (newData.status !== oldData.status) {
    let subject = '';
    let text = '';

    if (newData.status === 'Accepted') {
      subject = 'Shipping Request Accepted';
      text = `Dear ${newData.name},\n\nYour shipping request has been accepted. Your package number is ${newData.packageNumber}.\n\nWe will update you on the status soon.\n\nThank you!`;
    } else if (newData.status === 'Rejected') {
      subject = 'Shipping Request Rejected';
      text = `Dear ${newData.name},\n\nWe regret to inform you that your shipping request has been rejected.\n\nPlease contact support for more details.\n\nThank you!`;
    }

    if (subject) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailEmail.value(),
          pass: gmailPassword.value(),
        },
      });
      const mailOptions = {
        from: gmailEmail.value(),
        to: newData.email,
        subject,
        text,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`${newData.status} email sent to:`, newData.email);
      } catch (error) {
        console.error(`Error sending ${newData.status} email:`, error);
      }
    }
  }
});

// 3. Email on shipment status update (onCreate statusHistory)
exports.sendShipmentStatusUpdate = onDocumentCreated({
  document: 'Packages/{packageId}/statusHistory/{historyId}',
  secrets: [gmailEmail, gmailPassword]
}, async (event) => {
  const newStatus = event.data.data().status;
  const packageId = event.params.packageId;

  // Get the package document
  const packageRef = admin.firestore().collection('Packages').doc(packageId);
  const packageSnap = await packageRef.get();
  const packageData = packageSnap.data();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailEmail.value(),
      pass: gmailPassword.value(),
    },
  });
  const mailOptions = {
    from: gmailEmail.value(),
    to: packageData.email,
    subject: 'Shipment Status Updated',
    text: `Dear ${packageData.shipperName},\n\nYour shipment (Package Number: ${packageData.packageNumber}) status has been updated to: ${newStatus}.\n\nThank you!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Status update email sent to:', packageData.email);
  } catch (error) {
    console.error('Error sending status update email:', error);
  }
});