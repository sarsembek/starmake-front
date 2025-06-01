"use client";

import React, { useState } from "react";
import { PaymentSuccessModal } from "@/components/payment/PaymentSuccessModal";
import { Button } from "@/components/ui/button";

export default function ModalTestPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-6">Payment Success Modal Test</h1>
        <Button
          onClick={() => setShowModal(true)}
          className="mb-4"
        >
          Test Payment Success Modal
        </Button>
        
        <div className="text-sm text-gray-600 max-w-md">
          <p>This page allows you to test the payment success modal.</p>
          <p className="mt-2">The modal includes:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Social image banner from /public/social-image.png</li>
            <li>Congratulations message in Russian</li>
            <li>Success icon overlay</li>
            <li>Premium features list</li>
            <li>User subscription information</li>
            <li>Continue to image creation button</li>
          </ul>
        </div>

        <PaymentSuccessModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onContinue={() => {
            setShowModal(false);
            alert("Redirecting to image creation...");
          }}
        />
      </div>
    </div>
  );
}
