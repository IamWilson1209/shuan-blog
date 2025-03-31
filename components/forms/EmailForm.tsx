'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Send, Mail } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function EmailForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const recipientEmail = 'zenfonlee@gmail.com';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const subject = `Message from Ex* - ${formData.name}`;
    const content = `
      <p><strong>Your Name:</strong> ${formData.name}</p>
      <p><strong>Your contact email:</strong> ${formData.email}</p>
      <p><strong>Message:</strong> ${formData.message}</p>
    `;

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: recipientEmail, subject, content }),
      });
      if (!response.ok) {
        toast.error('Email sent failed');
      }
      const result = await response.json();
      toast.success('Email send successfully');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => {
        setIsOpen(false);
        // setStatus('');
      }, 2000);
    } catch (error) {
      console.error('發送錯誤:', error);
      toast.error('Fail to send email');
    }
  };
  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
        >
          <span className="text-2xl">
            <Mail />
          </span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white p-5 rounded-lg shadow-xl w-96 ">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-black">Contact me</h3>

            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <input
              type="email"
              placeholder="Your email, let me contact you"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <textarea
              placeholder="Message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              className="w-full p-2 border border-gray-300 rounded h-48 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                <Send />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>

            {/* {status && (
              <p
                className={`text-sm ${
                  status.includes('成功') ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {status}
              </p>
            )} */}
          </form>
        </div>
      )}
    </div>
  );
}
