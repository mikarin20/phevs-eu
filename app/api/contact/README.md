# Contact Form Email Setup

Contact form şu anda çalışıyor ancak email göndermek için bir email servisi yapılandırmanız gerekiyor.

## Email Servisi Seçenekleri

### 1. Resend (Önerilen) - Ücretsiz 100 email/gün

1. [Resend.com](https://resend.com) üzerinde hesap oluşturun
2. API key alın
3. `.env.local` dosyasına ekleyin:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

4. Package.json'a ekleyin:
   ```bash
   npm install resend
   ```

5. `app/api/contact/route.ts` dosyasındaki TODO kısmını açın ve Resend kodunu aktif edin:
   ```typescript
   import { Resend } from 'resend'
   
   const resend = new Resend(process.env.RESEND_API_KEY)
   await resend.emails.send({
     from: 'PHEVs.eu <contact@phevs.eu>',
     to: 'info@phevs.eu',
     subject: `[Contact Form] ${subject}`,
     text: emailContent,
     replyTo: email,
   })
   ```

### 2. SendGrid - Ücretsiz 100 email/gün

1. [SendGrid.com](https://sendgrid.com) üzerinde hesap oluşturun
2. API key alın
3. `.env.local` dosyasına ekleyin:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   ```

4. Package.json'a ekleyin:
   ```bash
   npm install @sendgrid/mail
   ```

5. `app/api/contact/route.ts` dosyasını güncelleyin

### 3. Nodemailer (SMTP) - Kendi SMTP sunucunuz

1. SMTP bilgilerinizi alın (Gmail, Outlook, vb.)
2. `.env.local` dosyasına ekleyin:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

3. Package.json'a ekleyin:
   ```bash
   npm install nodemailer
   ```

4. `app/api/contact/route.ts` dosyasını güncelleyin

## Test Etme

1. Development modunda çalıştırın: `npm run dev`
2. `/contact` sayfasına gidin
3. Formu doldurup gönderin
4. Server console'da log'ları kontrol edin
5. Email servisinizi yapılandırdıktan sonra gerçek email gönderimini test edin

## Notlar

- Şu anda form verisi console'a yazdırılıyor (development için)
- Production'da mutlaka bir email servisi yapılandırın
- Rate limiting eklemek isteyebilirsiniz (spam koruması için)
- Email içeriğini HTML formatında da gönderebilirsiniz

