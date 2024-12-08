"use client";
import { useState, useEffect } from "react";
import { socket } from "@/app/socket";
import { CardTitle } from "@/components/ui/card";
import { User, MessageCircle, Clock } from "lucide-react";

interface Comment {
  name: string;
  comment: string;
  timestamp: Date;
}

export default function InstructorPage() {
  const [comments, setComments] = useState<Comment[]>([]);

  // Fetch the comments from the backend on component mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch("/api/data"); // Adjust with your API endpoint
        const data = await response.json();
        console.log(data);
        if (data) setComments([...comments, ...data]); // Add fetched data to comments state
      } catch (error) {
        console.log("Error fetching comments:", error);
      }
    };

    fetchComments();

    // Real-time socket listener
    socket.on("message", (data: Comment) => {
      setComments((prevComments) => [data, ...prevComments]); // Add new comment on socket message
    });

    // Clean up socket listener on component unmount
    return () => {
      socket.off("message");
    };
  }, []); // Empty dependency array to run only on mount

  // Color palette for dynamic background
  const getColorVariant = (index: number) => {
    const colors = [
      "bg-blue-50 border-blue-300",
      "bg-green-50 border-green-300",
      "bg-purple-50 border-purple-300",
      "bg-pink-50 border-pink-300",
      "bg-indigo-50 border-indigo-300",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="flex flex-col">
      <div className="min-h-[calc(100vh-32px)]">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <MessageCircle className="w-8 h-8" />
              لوحة تعليقات المستمعين
            </CardTitle>
          </div>
        </div>
        <div className="p-2 pt-4 bg-white ">
          {comments.length === 0 ? (
            <div className="text-center py-12 text-gray-400 flex flex-col items-center">
              <MessageCircle className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-xl">لم يتم استلام أي تعليقات بعد</p>
              <p className="text-sm mt-2">
                انتظار التعليقات في الوقت الفعلي...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments
                .sort(
                  (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime(),
                )
                .map((comment, index) => (
                  <div
                    key={index}
                    className={`
                    ${getColorVariant(index)}  
                    border rounded-lg 
                    overflow-hidden
                    transition-all duration-300 
                    hover:shadow-md 
                    hover:translate-x-1
                    animate-fade-in-up
                  `}
                  >
                    <div
                      dir={getLanguageDirection(comment.name)}
                      className="p-3 flex flex-col justify-between items-start gap-2"
                    >
                      <div
                        dir="ltr"
                        className="flex items-center gap-1 text-sm ml-1 text-gray-600"
                      >
                        <Clock className="w-4 h-4 " />
                        {new Date(comment.timestamp).toLocaleString()}
                      </div>
                      <h3 className="capitalize font-bold text-xl text-gray-800 flex items-center gap-2">
                        <User className="w-6 h-6 text-gray-600" />
                        {comment.name}
                      </h3>
                    </div>
                    <div
                      dir={getLanguageDirection(comment.name)}
                      className="bg-white p-3"
                    >
                      <p className="text-gray-700 font-medium">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <p dir="ltr" className="text-center">
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
function getLanguageDirection(text: string) {
  // Regular expression to match Arabic characters
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;

  // Regular expression to match English (Latin) characters
  const englishRegex = /[a-zA-Z]/;

  // Count Arabic and English characters
  const arabicChars = (text.match(arabicRegex) || []).length;
  const englishChars = (text.match(englishRegex) || []).length;

  // Determine the language based on character count
  if (arabicChars > englishChars) {
    return "rtl";
  } else if (englishChars > arabicChars) {
    return "ltr";
  } else {
    return "ltr";
  }
}
