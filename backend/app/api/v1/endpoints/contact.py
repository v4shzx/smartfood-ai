from typing import Any
from fastapi import APIRouter, HTTPException, status
import resend

from app.schemas.contact import ContactCreate
from app.core.config import settings

router = APIRouter()

if settings.RESEND_API_KEY:
    resend.api_key = settings.RESEND_API_KEY

@router.post("/", status_code=status.HTTP_201_CREATED)
async def send_contact_email(contact_in: ContactCreate) -> Any:
    """
    Sends a contact email using Resend.
    """
    if not settings.RESEND_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Resend API Key not configured"
        )
    
    try:
        # Build the email content
        html_content = f"""
        <html>
            <body style="font-family: sans-serif; color: #333;">
                <h2 style="color: #10b981;">Nuevo mensaje de contacto - SmartFood AI</h2>
                <p><strong>De:</strong> {contact_in.name} ({contact_in.email})</p>
                <p><strong>Asunto:</strong> {contact_in.subject}</p>
                <hr style="border: 0; border-top: 1px solid #eee;" />
                <p style="white-space: pre-wrap;">{contact_in.message}</p>
                <hr style="border: 0; border-top: 1px solid #eee;" />
                <p style="font-size: 12px; color: #666;">Este correo fue enviado desde el formulario de contacto de SmartFood AI.</p>
            </body>
        </html>
        """

        params = {
            "from": "SmartFood AI <onboarding@resend.dev>",
            "to": [settings.CONTACT_EMAIL],
            "subject": f"Contacto: {contact_in.subject}",
            "html": html_content,
            "reply_to": contact_in.email
        }

        email = resend.Emails.send(params)
        return {"status": "success", "message": "Email sent successfully", "id": email.get("id")}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error sending email: {str(e)}"
        )
