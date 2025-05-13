import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import 'dotenv/config'; // Changed require to import

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const OWNER_EMAIL = process.env.OWNER_EMAIL || EMAIL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, phone, service, package: bookedPackage, addons, vehicle, date, time, message: specialInstructions, address, city } = req.body;

    const config = { // Changed let to const
  service: 'gmail',
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
};

    const transporter = nodemailer.createTransport(config); // Changed let to const

const MailGenerator = new Mailgen({ // Changed let to const
  theme: 'default',
  product: {
    name: 'Bridge Auto Detailing',
    link: 'https://www.bridgeautodetailing.com/',
  },
});

    const response = { // Changed let to const
  body: {
    greeting: `Dear ${name}`,
    intro: 'Thank you for your booking with Bridge Auto Detailing!',
    table: {
      data: [
        { key: 'Service', value: service },
        { key: 'Package', value: bookedPackage || 'Not Selected' },
        { key: 'Ad-ons', value: Array.isArray(addons) ? addons.join(', ') : addons || 'None' },
        { key: 'Vehicle', value: vehicle },
        { key: 'Preferred Date', value: date },
        { key: 'Preferred Time', value: time },
        { key: 'Phone', value: phone },
        { key: 'Email', value: email },
        { key: 'Special Instructions', value: specialInstructions || 'None' },
      ],
    },
    outro: 'We will contact you shortly to confirm your booking details. If you have any questions, please do not hesitate to contact us.',
  },
};

    const mailToUser = MailGenerator.generate(response); // Changed let to const

const messageToUser = { // Changed let to const
  from: EMAIL,
  to: email,
  subject: 'Your Car Detailing Booking Confirmation',
  html: mailToUser,
};

    try {
      await transporter.sendMail(messageToUser);
      console.log('Confirmation email sent to user:', messageToUser.to);

      // --- Send email to the owner ---
      const mailToOwner = `
          <h2>New Booking Details:</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Address:</strong> ${address || 'Not Provided'}</p>
          <p><strong>City:</strong> ${city || 'Not Provided'}</p>
          <p><strong>Vehicle:</strong> ${vehicle}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Package (if applicable):</strong> ${bookedPackage || 'Not Selected'}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Special Instructions:</strong> ${specialInstructions || 'None'}</p>
          <p><strong>Add-ons (if any):</strong> ${Array.isArray(addons) ? addons.join(', ') : addons || 'None'}</p>
        `;

      const messageToOwner = { // Changed let to const
  from: EMAIL,
  to: OWNER_EMAIL,
  subject: 'New Booking Received!',
  html: mailToOwner,
};

    //   const infoOwner = await transporter.sendMail(messageToOwner);
      console.log('Booking details sent to owner:', messageToOwner.to);

      return res.status(200).json({ msg: 'Booking confirmation email sent successfully!' });
    } catch (error) {
      console.error('Error sending booking confirmation email:', error);
      return res.status(500).json({ error: 'Failed to send booking confirmation email.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}