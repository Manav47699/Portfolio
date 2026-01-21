"use client";
import React from 'react';
import Image from 'next/image';
import { Home } from 'lucide-react';
import Chatbot from "../../components/Chatbot";


export default function MySocials() {
  const socials = [
    {
      name: 'Facebook',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Logo_de_Facebook.png',
      url: 'https://www.facebook.com/manav.acharya.503/',
      buttonText: 'Connect'
    },
    {
      name: 'Instagram',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
      url: 'https://www.instagram.com/manav.ar/',
      buttonText: 'Connect'
    },
    {
      name: 'LinkedIn',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/960px-LinkedIn_logo_initials.png',
      url: 'https://www.linkedin.com/in/manav-acharya-a252272b8/',
      buttonText: 'Connect'
    },
    {
      name: 'GitHub',
      icon: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
      url: 'https://github.com/Manav47699',
      buttonText: 'Connect'
    },
    {
      name: 'Gmail',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png',
      url: 'mailto:acharyamanav7@gmail.com',
      buttonText: 'Mail'
    }
  ];

  return (
    <div className="min-h-screen bg-black font-sans">
      {/* Home Icon */}
      <div className="p-6">
        <a href="/" className="inline-block">
          <Home className="w-12 h-12 text-yellow-400 hover:scale-110 transition-transform" />
        </a>
      </div>

      {/* Main Content */}
      <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-24 xl:mx-32 mt-12 mb-20 p-6 sm:p-8 md:p-12 lg:p-16 text-center relative bottom-12 rounded-[50px] sm:rounded-[100px] md:rounded-[150px] lg:rounded-[200px] animate-glow">
        <style jsx>{`
          @keyframes glow {
            0% {
              box-shadow: 0 0 10px rgb(255, 247, 0), 
                          0 0 20px rgb(208, 255, 0), 
                          0 0 30px rgb(183, 255, 0);
            }
            100% {
              box-shadow: 0 0 20px rgb(255, 77, 0), 
                          0 0 40px rgb(255, 60, 0), 
                          0 0 60px rgb(255, 0, 0);
            }
          }
          .animate-glow {
            animation: glow 2s infinite alternate;
          }
        `}</style>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-blue-100 font-bold mb-4">
          MY SOCIALS
        </h1>
        <hr className="border-blue-100 mb-12" />

        {/* Social Cards Grid */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-10">
          {socials.map((social, index) => (
            <div
              key={index}
              className="bg-gray-900/70 rounded-3xl p-8 w-full sm:w-64 md:w-56 lg:w-64 text-center transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
            >
              {/* Icon */}
              <div className="mb-4 flex justify-center">
                <Image
                  src={social.icon}
                  alt={social.name}
                  width={80}
                  height={80}
                  className="animate-bounce rounded-xl"
                  unoptimized
                />
              </div>

              {/* Platform Name */}
              <h2 className="text-white text-xl font-semibold mb-6">
                {social.name}
              </h2>

              {/* Button */}
              <a
                href={social.url}
                target={social.name !== 'Gmail' ? '_blank' : undefined}
                rel="noreferrer"
              >
                <button className="text-xl px-6 py-3 rounded-xl bg-gray-800 text-white border-none cursor-pointer transition-all duration-300 hover:bg-gray-600 active:scale-95">
                  {social.buttonText}
                </button>
              </a>
            </div>
          ))}
        </div>
      </div>
      <Chatbot/>
    </div>
    
  );
}
