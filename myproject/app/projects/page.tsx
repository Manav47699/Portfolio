'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Chatbot from "../../components/Chatbot";

type ProjectTag = 'robotics' | 'webapp' | 'application';
type Project = {
  id: number;
  title: string;
  description: string;
  video: string;
  date: string;
  githubLink: string;
  tag: ProjectTag;
};



export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  // Project data with tags
  const projects:Project[] = [
    {
      id: 1,
      title: 'Agrinova App',
      description: 'Machine learning app that identifies invasive plant species using a built-in CNN model. Built with TensorFlow and PyQt5.',
      video: '/videos/ai detector video (online-video-cutter.com).mp4',
      date: '2024-12-25',
      githubLink: 'https://github.com/Manav47699/AGRINOVA-app.git',
      tag: 'application'
    },
    {
      id: 2,
      title: 'Simple Calculator',
      description: 'Desktop calculator application with basic arithmetic operations. Clean interface built using PyQt5.',
      video: '/videos/simplecalculator video.mp4',
      date: '2024-10-20',
      githubLink: 'https://github.com/Manav47699/Calculator-app.git',
      tag: 'application'
    },
    {
      id: 3,
      title: 'Portfolio',
      description: 'Modern portfolio website built with Next.js and Tailwind CSS.',
      video: '/videos/new website video.mp4',
      date: '2025-02-01',
      githubLink: 'https://github.com/Manav47699/Portfolio.git',
      tag: 'webapp'
    },
    {
      id: 4,
      title: 'First Website',
      description: 'First web project. Built with HTML, CSS, and vanilla JavaScript.',
      video: '/videos/old website video.mp4',
      date: '2024-08-10',
      githubLink: 'https://github.com/Manav47699/Old_Portfolio.git',
      tag: 'webapp'
    },
    {
      id: 5,
      title: 'PID Line Follower Robot (2024)',
      description: 'A line follower robot built with PID algorithm. Won the 1st place in 2024 Delta5.0 event 🏆',
      video: '/videos/pid video.mp4',
      date: '2024-12-05',
      githubLink: 'https://github.com/navidadelpour/line-follower-robot.git',
      tag: 'robotics'
    },
    {
      id: 6,
      title: 'AI Garbage Classifier',
      description: 'An AI-powered smart garbage classifier made with YOLO + robotic components. Won the 2nd runner-up in 2025 Technomorph hack-a-thon 🏆',
      video: '/videos/ai_garbage_classifier.mp4',
      date: '2025-06-10',
      githubLink: 'https://github.com/Manav47699/ROBOTICS-ai-garbage-classifier.git',
      tag: 'robotics'
    },
    {
      id: 7,
      title: 'Makalu Jadibuti Website',
      description: 'Website for Makalu Jadibuti Production Pvt. Ltd. deployed at "makalujadibuti.com"',
      video: '/videos/makalu_jadibuti.mp4',
      date: '2025-11-20',
      githubLink: 'https://github.com/Manav47699/Makalu-Jadibuti-Website.git',
      tag: 'webapp'
    }
  ];

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project => 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [searchQuery, sortOrder]);

  const getTagColor = (tag: ProjectTag) => {

    switch(tag) {
      case 'robotics':
        return 'bg-gradient-to-br from-gray-50 to-slate-100';
      case 'webapp':
        return 'bg-gradient-to-br from-sky-50 to-blue-50';
      case 'application':
        return 'bg-gradient-to-br from-green-50 to-emerald-50';
      default:
        return 'bg-white';
    }
  };

  const getTagTextColor = (tag: ProjectTag) => {

    switch(tag) {
      case 'robotics':
        return 'text-gray-700';
      case 'webapp':
        return 'text-blue-700';
      case 'application':
        return 'text-green-700';
      default:
        return 'text-gray-700';
    }
  };

  const getTagBgColor = (tag: ProjectTag) => {
    switch(tag) {
      case 'robotics':
        return 'bg-gray-100';
      case 'webapp':
        return 'bg-blue-100';
      case 'application':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getGithubHoverColor = (tag: ProjectTag) => {
    switch(tag) {
      case 'robotics':
        return 'hover:from-gray-700 hover:to-gray-800';
      case 'webapp':
        return 'hover:from-blue-600 hover:to-blue-700';
      case 'application':
        return 'hover:from-green-600 hover:to-emerald-700';
      default:
        return 'hover:from-gray-700 hover:to-gray-800';
    }
  };

  return (
    <>
      {/* Header - Same as home page */}
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
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse top-0 left-0"></div>
          <div className="absolute w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse top-0 right-0" style={{animationDelay: '2s'}}></div>
          <div className="absolute w-96 h-96 bg-amber-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse bottom-0 left-1/2" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-3">My Projects</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          
          {/* Search and Sort Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 w-full group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" size={20} />
                <input 
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-gray-200 
                           focus:border-blue-400 focus:ring-2 focus:ring-blue-100 
                           shadow-sm hover:shadow-md
                           transition-all duration-300 focus:outline-none text-gray-800 placeholder:text-gray-400"
                />
              </div>

              {/* Order By Dropdown */}
              <div className="relative w-full lg:w-auto">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full lg:w-auto px-5 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-xl 
                           hover:from-amber-500 hover:to-amber-600 hover:shadow-md transition-all duration-300 
                           flex items-center justify-between gap-3 min-w-[180px] font-medium shadow-sm"
                >
                  <span className="text-sm">Order by: {sortOrder === 'latest' ? 'Latest' : 'Oldest'}</span>
                  <svg className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full mt-2 right-0 bg-white rounded-xl border border-gray-200 shadow-xl w-full lg:w-48 overflow-hidden z-10">
                    <button
                      onClick={() => {
                        setSortOrder('latest');
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors ${sortOrder === 'latest' ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      Latest First
                    </button>
                    <button
                      onClick={() => {
                        setSortOrder('oldest');
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors ${sortOrder === 'oldest' ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      Oldest First
                    </button>
                  </div>
                )}
              </div>
            </div>

            {searchQuery && (
              <div className="mt-4 text-center">
                <p className="text-gray-600 text-sm">
                  Found <span className="font-semibold text-blue-600">{filteredProjects.length}</span> project{filteredProjects.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

          {/* Projects Grid */}
          <div className="space-y-6">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                  <Search size={40} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-light text-gray-700 mb-2">No projects found</h3>
                <p className="text-gray-500">Try adjusting your search terms</p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className={`group ${getTagColor(project.tag)} rounded-2xl shadow-md border border-gray-200/50
                           hover:shadow-xl hover:border-blue-300/50
                           transition-all duration-500 overflow-hidden
                           hover:-translate-y-1`}
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Video Section */}
                    <div className="lg:w-2/5 relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
                      <div className="aspect-video lg:aspect-auto lg:h-full relative">
                        <video 
                          src={project.video}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          muted
                          playsInline
                          loop
                          onMouseOver={(e) => e.currentTarget.play()}
                          onMouseOut={(e) => e.currentTarget.pause()}
                          onTouchStart={(e) => e.currentTarget.play()}
                          onTouchEnd={(e) => e.currentTarget.pause()}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-3/5 p-6 lg:p-8 flex flex-col justify-between">
                      <div className="mb-5">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h2 className="text-xl lg:text-2xl font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                            {project.title}
                          </h2>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTagTextColor(project.tag)} ${getTagBgColor(project.tag)}`}>
                            {project.tag}
                          </span>
                        </div>
                        
                        <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-transparent mb-4 group-hover:w-20 transition-all duration-300"></div>
                        
                        <p className="text-gray-700 text-sm lg:text-base leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                      
                      <div>
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                          <button className={`bg-gradient-to-r from-gray-800 to-gray-900 ${getGithubHoverColor(project.tag)} text-white px-5 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 hover:gap-3 hover:shadow-lg text-sm font-medium`}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            <span>View on GitHub</span>
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                </div>
              ))
            )}
          </div>
        </div>
        <Chatbot/>
      </main>
    </>
  );
}