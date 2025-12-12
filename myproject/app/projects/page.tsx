'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

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
  const projects = [
    {
      id: 1,
      title: 'Agrinova App',
      description: 'Machine learning app that identifies invasive plant species using a built-in CNN model. Built with TensorFlow and PyQt5.',
      video: '/videos/ai detector video (online-video-cutter.com).mp4',
      date: '2024-12-25',
      githubLink: '#',
      tag: 'application'
    },
    {
      id: 2,
      title: 'Simple Calculator',
      description: 'Desktop calculator application with basic arithmetic operations. Clean interface built using PyQt5.',
      video: '/videos/simplecalculator video.mp4',
      date: '2024-10-20',
      githubLink: '#',
      tag: 'application'
    },
    {
      id: 3,
      title: 'Portfolio',
      description: 'Modern portfolio website built with Next.js and Tailwind CSS.',
      video: '/videos/new website video.mp4',
      date: '2025-2-01',
      githubLink: '#',
      tag: 'webapp'
    },
    {
      id: 4,
      title: 'Old Portfolio',
      description: 'First web project. Built with HTML, CSS, and vanilla JavaScript.',
      video: '/videos/old website video.mp4',
      date: '2024-08-10',
      githubLink: '#',
      tag: 'webapp'
    },
    {
      id: 5,
      title: 'PID Line Follower Robot(2024)',
      description: 'A line follower robot built with PID algorithm. Won the 1st place in 2024 Delta5.0 event 🏆 ',
      video: '/videos/pid video.mp4',
      date: '2024-12-05',
      githubLink: '#',
      tag: 'robotics'
    },
    {
      id: 6,
      title: 'AI garbage classifier',
      description: 'An AI-powered smart garbage classifier made with Yolo + robotic components. Won the 2nd runner-up in 2025 Technomorph hach-a-thon 🏆 ',
      video: '/videos/ai_garbage_classifier.mp4',
      date: '2025-04-10',
      githubLink: '#',
      tag: 'robotics'
    },
    {
      id: 7,
      title: 'Makalu Jadibuti Website',
      description: 'Website for Makalu Jadibuti Production Pvt. Ltd.',
      video: '/videos/ai_garbage_classifier.mp4',
      date: '2025-11-20',
      githubLink: '#',
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

  const getTagColor = (tag) => {
    switch(tag) {
      case 'robotics':
        return 'bg-gradient-to-br from-gray-100 to-gray-200';
      case 'webapp':
        return 'bg-gradient-to-br from-sky-50 to-blue-100';
      case 'application':
        return 'bg-gradient-to-br from-green-50 to-emerald-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getTagTextColor = (tag) => {
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

  const getGithubHoverColor = (tag) => {
    switch(tag) {
      case 'robotics':
        return 'hover:from-gray-800 hover:to-gray-900';
      case 'webapp':
        return 'hover:from-sky-600 hover:to-blue-700';
      case 'application':
        return 'hover:from-green-600 hover:to-emerald-700';
      default:
        return 'hover:from-blue-600 hover:to-blue-700';
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
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-0 left-0"></div>
          <div className="absolute w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-0 right-0" style={{animationDelay: '2s'}}></div>
          <div className="absolute w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bottom-0 left-1/2" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-12">
          
          {/* Search and Sort Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 w-full group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" size={20} />
                <input 
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 
                           focus:border-blue-400 focus:ring-4 focus:ring-blue-100 
                           shadow-md hover:shadow-lg
                           transition-all duration-300 focus:outline-none text-gray-800"
                />
              </div>

              {/* Order By Dropdown */}
              <div className="relative w-full lg:w-auto">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full lg:w-auto px-6 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-2xl border border-amber-300 
                           hover:from-amber-500 hover:to-amber-600 hover:shadow-lg transition-all duration-300 
                           flex items-center justify-between gap-3 min-w-[180px] font-medium"
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
                      className={`w-full px-5 py-3 text-left transition-colors ${sortOrder === 'latest' ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-700 hover:bg-amber-50'}`}
                    >
                      Latest First
                    </button>
                    <button
                      onClick={() => {
                        setSortOrder('oldest');
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-5 py-3 text-left transition-colors ${sortOrder === 'oldest' ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-700 hover:bg-amber-50'}`}
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
                  Found <span className="font-medium text-blue-600">{filteredProjects.length}</span> project{filteredProjects.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

          {/* Projects Grid */}
          <div className="space-y-8">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-20">
                <Search size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-light text-gray-700 mb-2">No projects found</h3>
                <p className="text-gray-500">Try a different search term</p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className={`group ${getTagColor(project.tag)} rounded-3xl shadow-lg border border-gray-200
                           hover:shadow-2xl hover:border-blue-200
                           transition-all duration-500 overflow-hidden
                           hover:scale-[1.01]`}
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Video Section */}
                    <div className="lg:w-2/5 relative overflow-hidden bg-black">
                      <div className="aspect-video lg:aspect-auto lg:h-full relative">
                        <video 
                          src={project.video}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                          muted
                          playsInline
                          loop
                          onMouseOver={(e) => e.currentTarget.play()}
                          onMouseOut={(e) => e.currentTarget.pause()}
                          onTouchStart={(e) => e.currentTarget.play()}
                          onTouchEnd={(e) => e.currentTarget.pause()}
                        />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-3/5 p-8 lg:p-10 flex flex-col justify-between">
                      <div className="mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <h2 className="text-2xl lg:text-3xl font-light text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                            {project.title}
                          </h2>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTagTextColor(project.tag)} bg-white/60 backdrop-blur-sm`}>
                            {project.tag}
                          </span>
                        </div>
                        
                        <div className="w-16 h-px bg-blue-400 mb-6 group-hover:w-24 transition-all duration-300"></div>
                        
                        <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                      
                      <div>
                        <a href={project.githubLink}>
                          <button className={`bg-gradient-to-r from-gray-900 to-gray-800 ${getGithubHoverColor(project.tag)} text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 hover:scale-105 hover:shadow-lg`}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">Visit GitHub Repo</span>
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}