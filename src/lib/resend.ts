import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

// Adresse expéditeur
// En test : onboarding@resend.dev (fonctionne sans domaine vérifié)
// En prod  : remplacer par noreply@lp-transport.fr une fois le domaine vérifié dans Resend
export const FROM = 'Luiz Placencia Transport <onboarding@resend.dev>'

// Email admin qui reçoit les notifications
export const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? 'sebcasse9@gmail.com'
