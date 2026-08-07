import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from app.config import settings

logger = logging.getLogger(__name__)

def send_brevo_email(recipient_email: str, subject: str, html_content: str) -> bool:
    """
    Sends an email using Brevo SMTP relay service.
    Gracefully logs warnings if credentials are not configured.
    """
    # Check configurations
    smtp_key = getattr(settings, "BREVO_SMTP_KEY", "")
    sender_email = getattr(settings, "BREVO_SENDER_EMAIL", "")

    if not smtp_key or not sender_email:
        logger.warning(
            "Brevo email sending skipped: BREVO_SMTP_KEY or BREVO_SENDER_EMAIL is not set in environment settings."
        )
        return False

    try:
        # Create email envelope
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"Buddhi Talent Match <{sender_email}>"
        msg["To"] = recipient_email

        # Attach HTML body
        part = MIMEText(html_content, "html")
        msg.attach(part)

        # Connect to Brevo SMTP server (standard port 587 with TLS)
        server = smtplib.SMTP("smtp-relay.brevo.com", 587)
        server.starttls()
        server.login(sender_email, smtp_key)
        server.sendmail(sender_email, recipient_email, msg.as_string())
        server.quit()
        
        logger.info(f"Successfully sent email notification to {recipient_email} via Brevo.")
        return True
    except Exception as e:
        logger.error(f"Failed to send email via Brevo to {recipient_email}: {e}")
        return False

def send_client_match_approved_email(
    client_email: str, client_name: str, job_title: str, candidate_name: str, match_score: float
):
    """Sends an automated email introduction to a company client when a candidate match is approved."""
    subject = f"🔥 New Elite Match Approved: {candidate_name} ({match_score}% Fit) for {job_title}"
    
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <h2 style="color: #1e1b4b; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-top: 0;">Buddhi Talent Match</h2>
          <p>Hello {client_name},</p>
          <p>Good news! Our placement recruiter has verified and approved a high-performance developer match for your campaign: <strong>{job_title}</strong>.</p>
          
          <div style="background-color: #f1f5f9; padding: 18px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4f46e5;">
            <p style="margin: 0; font-size: 16px;"><strong>Candidate:</strong> {candidate_name}</p>
            <p style="margin: 4px 0 0 0; font-size: 18px; color: #4f46e5;"><strong>AI compatibility Score:</strong> {match_score}% Fit Score</p>
          </div>
          
          <p>Their verified portfolio, rate details, and interactive AI Match analysis are now fully unlocked and viewable in your client workspace.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://buddhi-talent-match-two.vercel.app/company" 
               style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; display: inline-block;">
               View Unlocked Candidate Profile
            </a>
          </div>
          
          <p style="font-size: 13px; color: #64748b; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            Thank you for choosing Buddhi Talent Match. For help, contact support@buddhi.com.
          </p>
        </div>
      </body>
    </html>
    """
    return send_brevo_email(client_email, subject, html)

def send_candidate_matched_email(
    candidate_email: str, candidate_name: str, job_title: str, match_score: float
):
    """Sends an automated email notification to a candidate when they are successfully matched with a client job."""
    subject = f"⚡ Match Alert: You have been recommended for {job_title}"
    
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <h2 style="color: #1e1b4b; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-top: 0;">Buddhi Talent Match</h2>
          <p>Hello {candidate_name},</p>
          <p>We are excited to inform you that our semantic scoring engine matched your profile to an active client position:</p>
          
          <div style="background-color: #f1f5f9; padding: 18px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <p style="margin: 0; font-size: 16px;"><strong>Job Title:</strong> {job_title}</p>
            <p style="margin: 4px 0 0 0; font-size: 18px; color: #10b981;"><strong>Match Compatibility:</strong> {match_score}% Score</p>
          </div>
          
          <p>Our recruitment team has sent your profile metrics to the client's evaluation pool. We will keep you updated if they schedule an interview sandbox run.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://buddhi-talent-match-two.vercel.app/candidate" 
               style="background-color: #10b981; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; display: inline-block;">
               View Match Details
            </a>
          </div>
          
          <p style="font-size: 13px; color: #64748b; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            Thank you for being part of Buddhi AI Network.
          </p>
        </div>
      </body>
    </html>
    """
    return send_brevo_email(candidate_email, subject, html)
