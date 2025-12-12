'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    feedback: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const scrollToAbout = () => {
    document.getElementById('scroll')?.scrollIntoView({ behavior: 'smooth' });
    setIsSidebarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitMessage('Message sent successfully!');
        setFormData({ feedback: '', email: '' });
      } else {
        setSubmitMessage('Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const techStack = [
    { name: 'HTML', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
    { name: 'JavaScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'C', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
    { name: 'C++', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
    { name: 'Django', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg' },
    { name: 'FastAPI', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
    { name: 'TensorFlow', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
    { name: 'PyTorch', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg' },
    { name: 'PyQt5', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/qt/qt-original.svg' },
    { name: 'Ollama', logo: 'https://ollama.com/public/ollama.png' },
    { name: 'LangChain', logo: 'https://agile-systems.de/wp-content/uploads/2024/03/LangChain-Logo.png' },
    { name: 'Arduino', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg' },
    { name: 'ESP32', logo: 'https://www.researchgate.net/publication/342521677/figure/fig2/AS:965305153105920@1607158091249/Pinout-diagram-of-ESP32.png' },
  ];

  return (
    <>
      {/* Header - Only hamburger on mobile */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-blue-500 via-blue-950 to-blue-900 text-amber-100 border-b-2 border-none shadow-lg shadow-white/50 hover:shadow-[0_0_50px_25px_rgba(255,255,255,0.9)] transition-shadow duration-500 rounded-b-full">
        <div className="flex justify-between items-center px-4 py-3">
          {/* Hamburger Menu - Always visible on mobile */}
          <button 
            className="text-amber-100 focus:outline-none z-50 lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex w-full justify-center">
            <ul className="flex space-x-8">
              <li>
                <button 
                  className="hover:bg-amber-300 transition-colors duration-500 rounded-xl cursor-pointer px-4 py-2 text-lg font-medium"
                  onClick={scrollToAbout}
                >
                  About me
                </button>
              </li>
              <li>
                <Link href="/projects" target="_blank">
                  <button className="hover:bg-amber-300 transition-colors duration-500 rounded-xl cursor-pointer px-4 py-2 text-lg font-medium">
                    Projects
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/blogs">
                  <button className="hover:bg-amber-300 transition-colors duration-500 rounded-xl cursor-pointer px-4 py-2 text-lg font-medium">
                    Blogs
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/contacts">
                  <button className="hover:bg-amber-300 transition-colors duration-500 rounded-xl cursor-pointer px-4 py-2 text-lg font-medium">
                    Contacts
                  </button>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Placeholder to center items on desktop */}
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
              <button 
                className="w-full text-left hover:bg-amber-300 transition-colors duration-500 rounded-xl cursor-pointer px-4 py-3 text-lg font-medium"
                onClick={scrollToAbout}
              >
                About me
              </button>
            </li>
            <li>
              <Link href="/projects" target="_blank">
                <button 
                  className="w-full text-left hover:bg-amber-300 transition-colors duration-500 rounded-xl cursor-pointer px-4 py-3 text-lg font-medium"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Projects
                </button>
              </Link>
            </li>
            <li>
              <Link href="/blogs">
                <button 
                  className="w-full text-left hover:bg-amber-300 transition-colors duration-500 rounded-xl cursor-pointer px-4 py-3 text-lg font-medium"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Blogs
                </button>
              </Link>
            </li>
            <li>
              <Link href="/contacts">
                <button 
                  className="w-full text-left hover:bg-amber-300 transition-colors duration-500 rounded-xl cursor-pointer px-4 py-3 text-lg font-medium"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Contacts
                </button>
              </Link>
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

      {/* Main Body */}
      <main className="scroll-smooth bg-black">
        {/* Hero Section */}
        <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 py-10 -mt-10">
          <div className="relative w-full lg:w-1/2 flex justify-center mb-8 lg:mb-0">
            <div className="relative w-[250px] h-[250px] bg-[#f0f0f0] rounded-full p-1 shadow-inner">
              <div className="absolute inset-0 rounded-full border-4 border-white z-0 animate-glow-pulse"></div>
              <Image 
                src="/images/glowboxpic.jpg" 
                alt="Profile"
                width={250}
                height={250}
                className="w-full h-full rounded-full object-cover relative z-10"
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left space-y-4">
            <h1 className="text-3xl font-bold animate-typewriter text-amber-300">Hi there,</h1>
            <h2 className="text-3xl font-bold animate-typewriter text-amber-300">I am Manav Acharya</h2>
          </div>
        </div>

        {/* About Me Section */}
        <section id="scroll">
          <div className="relative bg-[#16ff5ce3] hover:bg-[#f7ff16e3] text-black overflow-hidden transition-colors duration-500">
            <div className="absolute top-0 left-0 w-full -translate-y-1">
              <svg className="w-full h-16" viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
                <path d="M0,40 C480,120 960,-40 1440,40 L1440,0 L0,0 Z" fill="#000"></path>
              </svg>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                <div className="w-full lg:w-2/3 space-y-6">
                  <h1 className="text-4xl font-bold">ABOUT ME</h1>
                  <p>
                    As of today (21st November 2024 A.D / 6th of Mangsir 2081 B.S), I am an undergraduate studying Computer Engineering (BCT) at Purwanchal Campus, Dharan, also popularly known as Eastern Regional Campus.
                  </p>
                  
                  <h2 className="text-2xl font-semibold mt-8">TECH STACK</h2>
                  <hr className="border-black/50" />
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 mt-6">
                    {techStack.map((tech) => (
                      <div key={tech.name} className="flex flex-col items-center justify-center p-3 bg-white/80 rounded-lg hover:bg-white hover:scale-110 transition-all duration-300 shadow-md">
                        <img 
                          src={tech.logo} 
                          alt={tech.name}
                          className="w-12 h-12 object-contain"
                        />
                        <p className="text-xs mt-2 font-medium text-center">{tech.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="w-full lg:w-1/3 flex items-center justify-center">
                  <Image 
                    src="/images/laptopscreen.jpg" 
                    alt="PC Image"
                    width={300}
                    height={300}
                    className="hidden lg:block rounded-xl shadow-inner w-full aspect-square object-cover"
                  />
                  <Image 
                    src="/images/phonescreen.jpg" 
                    alt="Mobile Image"
                    width={300}
                    height={300}
                    className="block lg:hidden rounded-xl shadow-inner w-full aspect-square object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full rotate-180 translate-y-1">
              <svg className="w-full h-16" viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
                <path d="M0,40 C480,120 960,-40 1440,40 L1440,0 L0,0 Z" fill="#000"></path>
              </svg>
            </div>
          </div>
        </section>

        <div className="py-16"></div>

        {/* Projects Section - Updated with left alignment */}
        <div className="bg-amber-50 text-gray-900 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-center mb-8">PROJECTS</h1>
            <div className="flex justify-center mb-8">
              <Link href="/projects" target="_blank">
                <button className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-amber-600 hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 text-lg font-medium">
                  View in detail
                </button>
              </Link>
            </div>

            {/* Applications Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-left pl-4">Downloadable applications</h2>
              <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
                <div className="min-w-[280px] max-w-[280px] bg-gradient-to-br from-green-100 to-green-200 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 p-6 border-4 border-green-300 flex-shrink-0">
                  <div className="relative w-full aspect-video overflow-hidden rounded-xl cursor-pointer bg-white shadow-inner border-2 border-green-200">
                    <video 
                      src="/videos/simplecalculator video.mp4"
                      className="w-full h-full object-contain"
                      muted
                      playsInline
                      onMouseOver={(e) => e.currentTarget.play()}
                      onMouseOut={(e) => e.currentTarget.pause()}
                    />
                  </div>
                  <h2 className="mt-5 text-base font-bold text-gray-900 tracking-wide">Desktop Calculator</h2>
                  <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 transition-colors duration-300 shadow-md">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub Repo
                  </button>
                </div>

                <div className="min-w-[280px] max-w-[280px] bg-gradient-to-br from-green-100 to-green-200 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 p-6 border-4 border-green-300 flex-shrink-0">
                  <div className="relative w-full aspect-video overflow-hidden rounded-xl cursor-pointer bg-white shadow-inner border-2 border-green-200">
                    <video 
                      src="/videos/ai detector video (online-video-cutter.com).mp4"
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      onMouseOver={(e) => e.currentTarget.play()}
                      onMouseOut={(e) => e.currentTarget.pause()}
                    />
                  </div>
                  <h2 className="mt-5 text-base font-bold text-gray-900 tracking-wide">Agrinova App</h2>
                  <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 transition-colors duration-300 shadow-md">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub Repo
                  </button>
                </div>
              </div>
            </section>

            <hr className="border-red-500 shadow-[0_10px_5px_rgba(192,192,192,0.7)] my-12" />

            {/* Web Projects Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-8 text-left pl-4">Web Projects</h2>
              <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
                <div className="min-w-[280px] max-w-[280px] bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 p-6 border-4 border-blue-300 flex-shrink-0">
                  <div className="relative w-full aspect-video overflow-hidden rounded-xl cursor-pointer bg-white shadow-inner border-2 border-blue-200">
                    <video 
                      src="/videos/makalu_jadibuti.mp4"
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      onMouseOver={(e) => e.currentTarget.play()}
                      onMouseOut={(e) => e.currentTarget.pause()}
                    />
                  </div>
                  <h2 className="mt-5 text-base font-bold text-gray-900 tracking-wide">Makalu Jadibuti Website</h2>
                  <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors duration-300 shadow-md">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub Repo
                  </button>
                </div>
                <div className="min-w-[280px] max-w-[280px] bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 p-6 border-4 border-blue-300 flex-shrink-0">
                  <div className="relative w-full aspect-video overflow-hidden rounded-xl cursor-pointer bg-white shadow-inner border-2 border-blue-200">
                    <video 
                      src="/videos/old website video.mp4"
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      onMouseOver={(e) => e.currentTarget.play()}
                      onMouseOut={(e) => e.currentTarget.pause()}
                    />
                  </div>
                  <h2 className="mt-5 text-base font-bold text-gray-900 tracking-wide">First Website</h2>
                  <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors duration-300 shadow-md">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub Repo
                  </button>
                </div>

                <div className="min-w-[280px] max-w-[280px] bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 p-6 border-4 border-blue-300 flex-shrink-0">
                  <div className="relative w-full aspect-video overflow-hidden rounded-xl cursor-pointer bg-white shadow-inner border-2 border-blue-200">
                    <video 
                      src="/videos/new website video.mp4"
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      onMouseOver={(e) => e.currentTarget.play()}
                      onMouseOut={(e) => e.currentTarget.pause()}
                    />
                  </div>
                  <h2 className="mt-5 text-base font-bold text-gray-900 tracking-wide">Portfolio</h2>
                  <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors duration-300 shadow-md">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub Repo
                  </button>
                </div>
              </div>
            </section>

            <hr className="border-red-500 shadow-[0_10px_5px_rgba(192,192,192,0.7)] my-12" />

            {/* Hardware Projects Section */}
            <section>
              <h2 className="text-3xl font-bold text-black mb-8 text-left pl-4">Hardware/Robotics Projects</h2>
              <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
                <div className="min-w-[280px] max-w-[280px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 p-6 border-4 border-gray-300 flex-shrink-0">
                  <div className="relative w-full aspect-video overflow-hidden rounded-xl cursor-pointer bg-white shadow-inner border-2 border-gray-200">
                    <video 
                      src="/videos/ai_garbage_classifier.mp4"
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      onMouseOver={(e) => e.currentTarget.play()}
                      onMouseOut={(e) => e.currentTarget.pause()}
                    />
                  </div>
                  <h2 className="mt-5 text-base font-bold text-gray-900 tracking-wide">AI Garbage Classifier</h2>
                  <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 text-white text-sm rounded-xl hover:bg-gray-800 transition-colors duration-300 shadow-md">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub Repo
                  </button>
                </div>
                <div className="min-w-[280px] max-w-[280px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 p-6 border-4 border-gray-300 flex-shrink-0">
                  <div className="relative w-full aspect-video overflow-hidden rounded-xl cursor-pointer bg-white shadow-inner border-2 border-gray-200">
                    <video 
                      src="/videos/pid video.mp4"
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      onMouseOver={(e) => e.currentTarget.play()}
                      onMouseOut={(e) => e.currentTarget.pause()}
                    />
                  </div>
                  <h2 className="mt-5 text-base font-bold text-gray-900 tracking-wide">PID Line Follower Robot</h2>
                  <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 text-white text-sm rounded-xl hover:bg-gray-800 transition-colors duration-300 shadow-md">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub Repo
                  </button>
                </div>
              </div>
              
                
              
            </section>
          </div>
        </div>

        {/* Feedback Section */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-10 px-4 sm:px-6 md:px-20">
          <div className="max-w-2xl mx-auto bg-gray-700 bg-opacity-60 p-6 rounded-2xl shadow-lg backdrop-blur">
            <h2 className="text-3xl font-bold mb-4 text-center">Suggestions or inquires</h2>
            
            {submitMessage && (
              <div className={`mb-4 p-3 rounded-lg text-center ${submitMessage.includes('success') ? 'bg-green-500' : 'bg-red-500'}`}>
                {submitMessage}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <textarea 
                rows={5}
                placeholder="Your feedback..."
                value={formData.feedback}
                onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                required
                className="w-full p-3 rounded-lg bg-gray-900 bg-opacity-70 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none text-white"
              />
              <input 
                type="email"
                placeholder="Your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="w-full p-3 rounded-lg bg-gray-900 bg-opacity-70 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-400 hover:bg-amber-300 text-black font-semibold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </div>
        </section>
      </main>
      
   
      {/* Footer */}
      <hr className="border-green-300 shadow-[0_2px_5px_rgba(192,192,192,0.7)]" />
      <div className="py-8"></div>
      <footer className="text-center text-amber-100 pb-10">
        <h1 className="text-center">Connect with me at:</h1>
        <ul className="flex space-x-6 justify-center mt-4">
          <li>
            <a href="https://www.facebook.com/manav.acharya.503/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
              Facebook
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/manav.ar/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
              Instagram
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/manav-acharya-a252272b8/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
              LinkedIn
            </a>
          </li>
          <li>
            <a href="https://github.com/Manav47699" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
              Github
            </a>
          </li>
        </ul>
        <br />
        <h1 className="text-center">Mail me at:</h1>
        <ul className="mt-2">
          <li className="text-center">
            <a href="mailto:acharyamanav7@gmail.com" className="hover:text-amber-300">
              Gmail
            </a>
          </li>
        </ul>
      </footer>

      <style jsx>{`
        @keyframes glow-pulse {
          0% { box-shadow: 0 0 30px 10px white; }
          50% { box-shadow: 0 0 60px 20px white; }
          100% { box-shadow: 0 0 30px 10px white; }
        }
        .animate-glow-pulse {
          animation: glow-pulse 2s infinite ease-in-out;
        }
        @keyframes typewriter {
          from { width: 0; }
          to { width: 20ch; }
        }
        @keyframes blink-caret {
          70% { border-color: transparent; }
        }
        .animate-typewriter {
          overflow: hidden;
          border-right: 4px solid #fff;
          white-space: nowrap;
          animation: typewriter 3s steps(30) 1s 1 normal both, blink-caret 0.75s step-end infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}