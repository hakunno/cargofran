const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const nodemailer = require('nodemailer');

// Load Gmail credentials from config
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

// Set up transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// 1. Email on request submission (onCreate shipRequests)
exports.sendRequestConfirmation = functions.firestore
  .document('shipRequests/{requestId}')
  .onCreate(async (snap) => {
    const data = snap.data();
    const mailOptions = {
      from: gmailEmail,
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
exports.sendRequestStatusUpdate = functions.firestore
  .document('shipRequests/{requestId}')
  .onUpdate(async (change) => {
    const newData = change.after.data();
    const oldData = change.before.data();

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
        const mailOptions = {
          from: gmailEmail,
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
exports.sendShipmentStatusUpdate = functions.firestore
  .document('Packages/{packageId}/statusHistory/{historyId}')
  .onCreate(async (snap, context) => {
    const newStatus = snap.data().status;
    const packageId = context.params.packageId;

    // Get the package document
    const packageRef = admin.firestore().collection('Packages').doc(packageId);
    const packageSnap = await packageRef.get();
    const packageData = packageSnap.data();

    const mailOptions = {
      from: gmailEmail,
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