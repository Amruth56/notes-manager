"use client";

import { Github, Linkedin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-100 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-gray-500 text-sm">
          <p className="flex items-center justify-center md:justify-start gap-1">
            Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by{" "}
            <span className="font-bold text-orange-600">Amruth Mandappa T S</span>
          </p>
          <p className="mt-1">© {new Date().getFullYear()} Notes Manager. All rights reserved.</p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Amruth56"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-orange-600 hover:text-white transition-all shadow-sm border border-gray-100"
            title="GitHub Profile"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/amruth-mandappa-t-s-48838a203/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-gray-100"
            title="LinkedIn Profile"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
