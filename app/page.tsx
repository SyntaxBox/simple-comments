"use client";
import { useState } from "react";
import { socket } from "@/app/socket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, User, MessageSquare } from "lucide-react";

export default function ListenersPage() {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      alert("يرجى تعبئة كل من الاسم والتعليق");
      return;
    }

    const message = { name, comment, timestamp: new Date() };
    setIsSubmitting(true);
    socket.emit("message", message);
    await fetch("/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    // Clear form after submission
    setName("");
    setComment("");

    // Reset submission state after a short delay
    socket.close();
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="px-2 py-1 bg-gradient-to-br from-white via-green-50 to-teal-50 min-h-screen flex flex-col items-center justify-center gap-3">
      <Card className="max-w-md w-full shadow-xl transform transition-all hover:scale-[1.01] animate-fade-in">
        <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 ext-white rounded-t-xl">
          <div className="flex items-center justify-between text-white">
            <CardTitle className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8" />
              رسائل الشكر
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="py-6 px-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="flex items-center gap-2 text-gray-700"
              >
                <User className="w-5 h-5 text-green-500" />
                الإسم واللقب
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل إسمك"
                className="border-green-300 transition-all focus-visible:ring-green-400"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="comment"
                className="flex items-center gap-2 text-gray-700"
              >
                <MessageSquare className="w-5 h-5 text-teal-500" />
                رسالة الشكر
              </Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="شارك رأيك"
                rows={4}
                className="border-teal-200 focus-visible:ring-teal-300 transition-all"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r  from-green-500 to-teal-600 items-center justify-center gap-2"
              disabled={isSubmitting || submitted}
            >
              {isSubmitting ? (
                <span className="animate-pulse">جاري الإرسال...</span>
              ) : submitted ? (
                <span>تم ارسال الرسالة</span>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  إرسال التعليق
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p dir="ltr">
        Developed by{" "}
        <a
          href="https://hamid.syntaxbox.dev"
          target="_blank"
          className="text-green-600 underline"
        >
          Abdelhamid Boudit
        </a>
        {", "}
        <span className="font-sans">&copy;</span> CMC 2024
      </p>
    </div>
  );
}
