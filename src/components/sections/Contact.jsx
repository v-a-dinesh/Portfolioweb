import React, { useRef, useState } from "react";
import styled from "styled-components";
import emailjs from "@emailjs/browser";
import EarthCanvas from "../canvas/Earth";

// Your existing styled components (keep them all the same)
const Container = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  z-index: 1;
  align-items: center;
  @media (max-width: 960px) {
    padding: 0px;
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1350px;
  padding: 0px 0px 80px 0px;
  gap: 12px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const Title = styled.div`
  font-size: 52px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;

const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  max-width: 600px;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 16px;
  }
`;

const ContactForm = styled.form`
  width: 95%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  background-color: rgba(17, 25, 40, 0.83);
  border: 1px solid rgba(255, 255, 255, 0.125);
  padding: 32px;
  border-radius: 12px;
  box-shadow: rgba(23, 92, 230, 0.1) 0px 4px 24px;
  margin-top: 28px;
  gap: 12px;
  position: relative;
`;

const ContactTitle = styled.div`
  font-size: 28px;
  margin-bottom: 6px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const ContactInput = styled.input`
  flex: 1;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  outline: none;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 12px;
  padding: 12px 16px;
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
  }
`;

const ContactInputMessage = styled.textarea`
  flex: 1;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  outline: none;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 12px;
  padding: 12px 16px;
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
  }
`;

const ContactButton = styled.input`
  width: 100%;
  text-decoration: none;
  text-align: center;
  background: hsla(271, 100%, 50%, 1);
  background: linear-gradient(
    225deg,
    hsla(271, 100%, 50%, 1) 0%,
    hsla(294, 100%, 50%, 1) 100%
  );
  padding: 13px 16px;
  margin-top: 2px;
  border-radius: 12px;
  border: none;
  color: ${({ theme }) => theme.text_primary};
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

// Add just these 3 new styled components
const StatusMessage = styled.div`
  padding: 12px;
  border-radius: 8px;
  margin-top: 12px;
  text-align: center;
  font-weight: 500;

  &.success {
    background-color: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.3);
    color: #22c55e;
  }

  &.error {
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  z-index: 10;
`;

const Spinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid ${({ theme }) => theme.primary};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Contact = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Simple validation
  const validateForm = (formData) => {
    if (!formData.get("from_name")?.trim()) return "Please enter your name";
    if (!formData.get("from_email")?.trim()) return "Please enter your email";
    if (!formData.get("subject")?.trim()) return "Please enter a subject";
    if (!formData.get("message")?.trim()) return "Please enter a message";

    const email = formData.get("from_email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(form.current);
    const validationError = validateForm(formData);

    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Send admin email (to you)
      await emailjs.sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_ADMIN_TEMPLATE,
        form.current,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      // Send user confirmation email
      // In your Contact.js handleSubmit function, replace the userTemplateParams:
      const userTemplateParams = {
        to_email: formData.get("from_email"),
        from_name: formData.get("from_name"),
        subject: formData.get("subject"),
        message: formData.get("message"),
        your_name: "Dinesh VA", // Replace with your actual name
        sent_date: new Date().toLocaleString(),
        phone: formData.get("phone") || "Not provided", // Add phone field if needed
      };

      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_USER_TEMPLATE,
        userTemplateParams,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      setMessage({
        type: "success",
        text: "Message sent successfully! You should receive a confirmation email shortly.",
      });

      form.current.reset();
    } catch (error) {
      console.error("Email error:", error);
      setMessage({
        type: "error",
        text: "Failed to send message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Wrapper>
        <EarthCanvas />
        <Title>Contact</Title>
        <Desc>
          Feel free to reach out to me for any questions or opportunities!
        </Desc>
        <ContactForm ref={form} onSubmit={handleSubmit}>
          <ContactTitle>Email Me 🚀</ContactTitle>
          <ContactInput
            placeholder="Your Email*"
            name="from_email"
            type="email"
            required
          />
          <ContactInput
            placeholder="Phone Number (Optional)"
            name="phone"
            type="tel"
          />
          <ContactInput placeholder="Your Name*" name="from_name" required />
          <ContactInput placeholder="Subject*" name="subject" required />
          <ContactInputMessage
            placeholder="Message*"
            name="message"
            rows={4}
            required
          />
          <ContactButton
            type="submit"
            value={loading ? "Sending..." : "Send"}
            disabled={loading}
          />
          {message && (
            <StatusMessage className={message.type}>
              {message.text}
            </StatusMessage>
          )}
          {loading && (
            <LoadingOverlay>
              <Spinner />
            </LoadingOverlay>
          )}
        </ContactForm>
      </Wrapper>
    </Container>
  );
};

export default Contact;
