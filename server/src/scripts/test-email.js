import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env from server root
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

console.log('📧 Testing Email Configuration...');
console.log('Host:', process.env.SMTP_HOST);
console.log('User:', process.env.SMTP_USER);

async function testEmail() {
    // 1. Configure Transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        // 2. Verify connection
        await transporter.verify();
        console.log('✅ SMTP Connection Verified');

        // 3. Send test email
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.SMTP_USER,
            to: process.env.SMTP_USER, // Send to self
            subject: 'Test Email from Inward/Outward System',
            text: 'If you receive this, the email configuration is working!'
        });

        console.log('✅ Test Email Sent!');
        console.log('Message ID:', info.messageId);
        console.log(`Check inbox for: ${process.env.SMTP_USER}`);
    } catch (error) {
        console.error('❌ Email Failed:', error);
    }
}

testEmail();
