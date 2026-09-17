import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// Note: Configure your email transport here for production
import * as nodemailer from 'nodemailer';

// Mock transporter for demonstration - replace with real SMTP in production
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'mock_user',
        pass: 'mock_pass'
    }
});

export const onResponseCreated = functions.firestore
    .document('responses/{responseId}')
    .onCreate(async (snap, context) => {
        const responseData = snap.data();
        const formId = responseData.form_id;

        if (!formId) {
            console.error('Response missing form_id', context.params.responseId);
            return null;
        }

        const formRef = db.collection('forms').doc(formId);
        
        try {
            await db.runTransaction(async (transaction) => {
                const formDoc = await transaction.get(formRef);
                
                if (!formDoc.exists) {
                    throw new Error('Form does not exist!');
                }
                
                const currentCount = formDoc.data()?.response_count || 0;
                transaction.update(formRef, { response_count: currentCount + 1 });
            });
            console.log(`Successfully incremented response_count for form ${formId}`);

            // Email Notification Logic
            const formDoc = await formRef.get();
            const formData = formDoc.data();
            
            if (formData && formData.email_notifications === true) {
                 const ownerUid = formData.owner_uid;
                 try {
                     const userRecord = await admin.auth().getUser(ownerUid);
                     const ownerEmail = userRecord.email;
                     
                     if (ownerEmail) {
                         console.log(`Sending email notification to ${ownerEmail} for form ${formId}`);
                         // Uncomment and use real SMTP to actually send
                         /* 
                         await transporter.sendMail({
                             from: '"Manifest Forms" <noreply@manifest-forms.example.com>',
                             to: ownerEmail,
                             subject: `New Response: ${formData.title}`,
                             text: `You have received a new response for your form "${formData.title}".\n\nSubmitted at: ${responseData.submitted_at}\n\nView it in your dashboard.`,
                         });
                         */
                     }
                 } catch (authErr) {
                     console.error(`Could not fetch user ${ownerUid} to send email.`, authErr);
                 }
            }

        } catch (err) {
            console.error(`Failed to update response_count for form ${formId}`, err);
        }

        return null;
    });

export const onResponseDeleted = functions.firestore
    .document('responses/{responseId}')
    .onDelete(async (snap, context) => {
        const responseData = snap.data();
        const formId = responseData.form_id;

        if (!formId) {
            return null;
        }

        const formRef = db.collection('forms').doc(formId);
        
        try {
            await db.runTransaction(async (transaction) => {
                const formDoc = await transaction.get(formRef);
                
                if (!formDoc.exists) {
                    return; // Form might already be deleted
                }
                
                const currentCount = formDoc.data()?.response_count || 0;
                const newCount = Math.max(0, currentCount - 1); 
                transaction.update(formRef, { response_count: newCount });
            });
            console.log(`Successfully decremented response_count for form ${formId}`);
        } catch (err) {
            console.error(`Failed to update response_count for form ${formId}`, err);
        }

        return null;
    });
