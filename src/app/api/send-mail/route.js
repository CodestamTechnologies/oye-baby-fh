import nodemailer from 'nodemailer';

export async function POST(req) {
  const { to, customerName ,isorder,order} = await req.json(); 

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
const orderDetailsHtml = isorder
  ? `
    <table width="100%" cellpadding="10" cellspacing="0" style="font-family: Arial, sans-serif; background-color: #f9f9f9;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="20" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
            <tr>
              <td align="center" style="border-bottom: 1px solid #eee;">
                <h2 style="margin: 0; color: #333;">🧾 Your Order</h2>
              </td>
            </tr>
            <tr>
              <td>
                <h3 style="margin-bottom: 10px; color: #444;">Order Details</h3>
                <p><strong>Price:</strong> ${order?.total}</p>
                <p><strong>Category:</strong> ${order?.cartItems[0]?.product?.category?.name}</p>
                <p><strong>Color:</strong> ${order?.cartItems[0]?.product?.colors[0]?.name}</p>
                <p><strong>Quantity:</strong> ${order?.cartItems[0].quantity}</p>
                <p style="font-size: 12px; color: #999;">This is an automated message from your print-on-demand system.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `
  : '';
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: [to, process.env.ADMIN_EMAIL],
    subject: '📦 Your Order Has Been Placed Successfully!',
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
          <h2 style="color: #2d2d2d;">Hello ${customerName},</h2>
          <p style="color: #333;">Thank you for your order! We're excited to process it shortly.</p>
          <p style="color: #333;">Here are the details of your order:</p>

          ${orderDetailsHtml}
          <p style="color: #333;">We will send you an update once your order is on its way!</p>
          <br>
          <p style="color: #333;">If you have any questions, feel free to reach out to us.</p>
          <p style="color: #333;">Thank you for shopping with us!</p>
          <p style="color: #555; font-size: 0.9em;">Best regards,<br><strong>Your Company Name</strong></p>
          <footer style="color: #aaa; font-size: 0.8em;">
            <p>If you didn't place this order, please contact us immediately at <a href="mailto:support@yourcompany.com" style="color: #1a73e8;">support@yourcompany.com</a></p>
          </footer>
        </body>
      </html>
    `,
    text: `
      Hello ${customerName},
          ${orderDetailsHtml}

      Thank you for your order! We're excited to process it shortly.

      Status: Processing

      We will send you an update once your order is on its way!

      Best regards,
      Your Company Name

      If you didn't place this order, please contact us immediately at support@yourcompany.com
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("❌ Email sending error:", error.message);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
