'use client';

import { useState } from 'react';
import { BookOpen, Calendar, ArrowLeft, Github, ChevronLeft, ChevronRight } from 'lucide-react';
import Chatbot from "../../../components/Chatbot";


export default function BlogPost() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('scroll');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#scroll';
    }
    setIsSidebarOpen(false);
  };

  // Blog content data
  const blog = {
    number: 'BLOG #03',
    title: 'Setting Up OpenAI Whisper for Speech-to-Text',
    date: 'December 12, 2024',
    githubRepo: 'https://github.com/Manav47699/openai_whisper-tiny_fastapi_stt.git',
    content: [
      {
        type: 'step',
        number: '1',
        title: 'Install necessary tool',
        code: `sudo apt install ffmpeg       # whisper can't work without this`,
        language: 'bash',
        note: 'It is a system level tool which reads audio files, converts audio formats, extracts raw audio for whisper and SO ON.'
      },
      {
        type: 'step',
        number: '2',
        title: 'Install necessary dependencies (virtual env recommended)',
        code: `pip install openai-whisper
pip install torch --index-url https://download.pytorch.org/whl/cpu      # to download the cpu only version
# pip install torch # to install the default version`,
        language: 'bash'
      },
      {
        type: 'warning',
        text: 'Make sure to install other necessary dependencies according to need such as fastapi, langchain etc.'
      }
    ]
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-blue-500 via-blue-950 to-blue-900 text-amber-100 border-b-2 border-none shadow-lg shadow-white/50 hover:shadow-[0_0_50px_25px_rgba(255,255,255,0.9)] transition-shadow duration-500 rounded-b-full">
        <div className="flex justify-between items-center px-4 py-3">
          {/* Hamburger Menu */}
          <button 
            className="text-amber-100 focus:outline-none z-50 lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex w-full justify-center">
            <ul className="flex space-x-8">
              <li>
                <a href="/">
                  <button className="hover:bg-amber-300 transition-colors duration-500 rounded-xl cursor-pointer px-4 py-2 text-lg font-medium">
                    Home
                  </button>
                </a>
              </li>
              <li>
                <button 
                  className="hover:bg-amber-300 transition-colors duration-500 rounded-xl cursor-pointer px-4 py-2 text-lg font-medium"
                  onClick={scrollToAbout}
                >
                  About me
                </button>
              </li>
              <li>
                <a href="/projects">
                  <button className="hover:bg-amber-300 transition-colors duration-500 rounded-xl cursor-pointer px-4 py-2 text-lg font-medium">
                    Projects
                  </button>
                </a>
              </li>
              <li>
                <a href="/blogs">
                  <button className="hover:bg-amber-300 transition-colors duration-500 rounded-xl cursor-pointer px-4 py-2 text-lg font-medium">
                    Blogs
                  </button>
                </a>
              </li>
              <li>
                <a href="/contacts">
                  <button className="hover:bg-amber-300 transition-colors duration-500 rounded-xl cursor-pointer px-4 py-2 text-lg font-medium">
                    Contacts
                  </button>
                </a>
              </li>
            </ul>
          </nav>

          {/* Placeholder */}
          <div className="lg:hidden invisible">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-500 via-blue-950 to-blue-900 text-amber-100 transform transition-transform duration-300 z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden shadow-2xl`}
      >
        <nav className="mt-20 px-4">
          <ul className="space-y-4">
            <li>
              <a href="/">
                <button 
                  className="w-full text-left hover:bg-amber-300 transition-colors duration-500 rounded-xl cursor-pointer px-4 py-3 text-lg font-medium"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Home
                </button>
              </a>
            </li>
            <li>
              <button 
                className="w-full text-left hover:bg-amber-300 transition-colors duration-500 rounded-xl cursor-pointer px-4 py-3 text-lg font-medium"
                onClick={scrollToAbout}
              >
                About me
              </button>
            </li>
            <li>
              <a href="/projects">
                <button 
                  className="w-full text-left hover:bg-amber-300 transition-colors duration-500 rounded-xl cursor-pointer px-4 py-3 text-lg font-medium"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Projects
                </button>
              </a>
            </li>
            <li>
              <a href="/blogs">
                <button 
                  className="w-full text-left hover:bg-amber-300 transition-colors duration-500 rounded-xl cursor-pointer px-4 py-3 text-lg font-medium"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Blogs
                </button>
              </a>
            </li>
            <li>
              <a href="/contacts">
                <button 
                  className="w-full text-left hover:bg-amber-300 transition-colors duration-500 rounded-xl cursor-pointer px-4 py-3 text-lg font-medium"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Contacts
                </button>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="pt-24"></div>

      {/* Main Content */}
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Back Button */}
          <a href="/blogs">
            <button className="flex items-center gap-2 text-amber-700 hover:text-amber-900 mb-8 transition-colors duration-300 group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back to Blogs</span>
            </button>
          </a>

          {/* Blog Header */}
          <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-3xl shadow-xl border border-amber-200/50 p-8 lg:p-12 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-amber-600" size={28} />
              <span className="text-sm font-semibold text-amber-700 tracking-wider">
                {blog.number}
              </span>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex items-center gap-2 text-gray-600 mb-6">
              <Calendar size={18} />
              <span className="text-sm">{blog.date}</span>
            </div>

            {/* GitHub Repo Link */}
            <a href={blog.githubRepo} target="_blank" rel="noopener noreferrer">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-4 rounded-xl transition-all duration-300 flex items-center gap-3 hover:scale-[1.02] shadow-lg border border-gray-700 group">
                <Github size={24} className="group-hover:rotate-12 transition-transform duration-300" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                    For Codes, Refer to This Repo
                  </p>
                  <p className="text-sm font-mono text-gray-300 break-all">
                    {blog.githubRepo}
                  </p>
                </div>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </a>
          </div>

          {/* Blog Content */}
          <article className="bg-gradient-to-br from-white to-amber-50/30 rounded-3xl shadow-xl border border-amber-200/50 p-8 lg:p-12">
            <div className="prose prose-lg max-w-none">
              {blog.content.map((section, index) => {
                if (section.type === 'step') {
                  return (
                    <div key={index} className="mb-10">
                      {/* Step Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {section.number}
                        </div>
                        <div className="flex-1 pt-2">
                          <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
                            Step {section.number}: {section.title}
                          </h2>
                        </div>
                      </div>

                      {/* Code Block */}
                      {section.code && (
                        <div className="ml-16 mb-4">
                          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 overflow-x-auto">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                                {section.language}
                              </span>
                            </div>
                            <pre className="text-sm text-gray-100 font-mono leading-relaxed">
                              <code>{section.code}</code>
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* Note */}
                      {section.note && (
                        <div className="ml-16 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 shadow-sm">
                          <p className="text-sm text-gray-700 italic">
                            💡 {section.note}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                }

                if (section.type === 'warning') {
                  return (
                    <div key={index} className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-2xl p-6 shadow-lg">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                          <span className="text-white text-xl font-bold">⚠️</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-orange-900 mb-2">NOTE</h3>
                          <p className="text-gray-800 leading-relaxed">
                            {'text' in section && section.text}

                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (section.type === 'conclusion') {
                  return (
                    <div key={index} className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 shadow-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Success!</h3>
                      </div>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {'text' in section && section.text}

                      </p>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </article>

         {/* Navigation Footer */}
          <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Previous Blog Button */}
            <a href="#" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-medium group">
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Previous Blog</span>
              </button>
            </a>

            {/* Next Blog Button */}
            <a href="#" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto flex items-center gap-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-medium group">
                <span>Next Blog</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </a>
          </div>
        </div>
        <Chatbot/>
      </main>
    </>
  );
}