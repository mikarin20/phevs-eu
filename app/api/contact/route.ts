import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message, locale } = body

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Email gönderme işlemi
    // Burada email servisinizi kullanabilirsiniz:
    // - Resend (https://resend.com) - Önerilen
    // - SendGrid
    // - Nodemailer (SMTP)
    // - AWS SES
    
    // Şimdilik basit bir response döndürüyoruz
    // Gerçek uygulamada burada email gönderilir
    
    const emailContent = `
New Contact Form Submission from PHEVs.eu

Name: ${name}
Email: ${email}
Subject: ${subject}
Language: ${locale}

Message:
${message}

---
This email was sent from the contact form on PHEVs.eu
    `.trim()

    // TODO: Burada email gönderme işlemini ekleyin
    // Örnek: Resend ile email gönderme
    /*
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'PHEVs.eu <contact@phevs.eu>',
      to: 'info@phevs.eu',
      subject: `[Contact Form] ${subject}`,
      text: emailContent,
      replyTo: email,
    })
    */

    // Geçici olarak console'a yazdırıyoruz (production'da kaldırın)
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      message,
      locale,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

