import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, purpose, message } = body;

    if (!name || !email || !message || !purpose) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a transporter using Gmail
    // For production, you'd likely use an email service like SendGrid, Mailgun, etc.
    // This example uses Gmail which requires less secure app access
    // or an app-specific password if you have 2FA enabled
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'michaelcstraus@gmail.com',
        pass: process.env.EMAIL_PASS, // You'll need to set this in your .env file
      },
    });

    // Purpose map for more readable subject line
    const purposeMap: Record<string, string> = {
      job: 'Job Opportunity',
      project: 'Project Collaboration',
      feedback: 'Feedback',
      other: 'Other Inquiry',
    };
    
    const purposeText = purposeMap[purpose] || 'Website Contact';

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER || 'michaelcstraus@gmail.com',
      to: 'michaelcstraus@gmail.com',
      subject: `Portfolio Contact: ${purposeText} from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Purpose: ${purposeText}
        
        Message:
        ${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Purpose:</strong> ${purposeText}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email,
    };

    // If EMAIL_PASS is not set, return a message instead of trying to send
    if (!process.env.EMAIL_PASS) {
      console.warn('EMAIL_PASS environment variable not set. Email would have been sent with these details:', mailOptions);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email configuration is incomplete. Please set up EMAIL_PASS environment variable.' 
        },
        { status: 200 }
      );
    }

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: 'Email sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 