"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue?: () => void;
}

export function PaymentSuccessModal({
  isOpen,
  onClose,
  onContinue,
}: PaymentSuccessModalProps) {
  const { user } = useAuth();
  
  // Get plan name from user subscription or fallback to "Premium"
  const planName = user?.subscription?.tier || "Premium";

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto p-0 overflow-hidden bg-white">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
          aria-label="Close modal"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        {/* Social image banner */}
        <div className="relative w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600">
          <Image
            src="/social-image.png"
            alt="Payment Success Banner"
            fill
            className="object-cover"
            priority
          />
          
          {/* Success icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <DialogHeader className="text-center mb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              🎉 Поздравляем!
            </DialogTitle>
            <DialogDescription className="text-lg text-gray-600">
              Ваша подписка на план {planName} успешно активирована!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">
                Теперь вам доступно:
              </h3>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Неограниченное создание изображений</li>
                <li>• Приоритетная обработка запросов</li>
                <li>• Доступ к премиум-функциям</li>
                <li>• Высокое качество генерации</li>
              </ul>
            </div>

            {user?.subscription?.messages_left && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">{user.subscription.messages_left}</span> сообщений доступно
                </p>
              </div>
            )}

            <div className="text-center text-sm text-gray-500">
              Спасибо за ваш выбор! Приятного использования сервиса.
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
            >
              Перейти к созданию изображений
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
