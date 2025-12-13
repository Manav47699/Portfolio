'use client';

import { useState, useMemo } from 'react';
import { Search, BookOpen } from 'lucide-react';

export default function Blogs() {
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

  // Blog data
  const blogs = [
    {
      id: 1,
      blogNumber: 'BLOG #01',
      title: 'Nextjs Website (static) deployment with C-Panel',
      description: 'Here is how you can deploy a static nextjs site with any C-Panel provider.',
      date: '2025-11-20',
      link: '/blogs/blog1'
    },
    {
      id: 2,
      blogNumber: 'BLOG #02',
      title: 'How to run a local chatbot with RAG',
      description: 'Run a local chatbot in your terminal with RAG using a personal .csv file',
      date: '2025-11-26',
      link: 'blogs/blog2'
    },
    {
      id: 3,
      blogNumber: 'BLOG #03',
      title: 'Using openai whisper for stt (speech to text) processing',
      description: 'Using whisper ai for stt along with a nextjs frontend',
      date: '2025-11-27',
      link: 'blogs/blog3'
    },
    
  ];

  // Filter and sort blogs
  const filteredBlogs = useMemo(() => {
    let filtered = blogs.filter(blog => 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [searchQuery, sortOrder]);

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
                  placeholder="Search blogs..."
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
                  Found <span className="font-medium text-blue-600">{filteredBlogs.length}</span> blog{filteredBlogs.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

          {/* Blogs Grid */}
          <div className="space-y-8">
            {filteredBlogs.length === 0 ? (
              <div className="text-center py-20">
                <Search size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-light text-gray-700 mb-2">No blogs found</h3>
                <p className="text-gray-500">Try a different search term</p>
              </div>
            ) : (
              filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="group bg-gradient-to-br from-amber-50/80 via-white to-amber-50/60 rounded-3xl shadow-lg border border-amber-100/50
                           hover:shadow-2xl hover:border-amber-200
                           transition-all duration-500 overflow-hidden
                           hover:scale-[1.01] backdrop-blur-sm"
                >
                  <div className="p-8 lg:p-10">
                    {/* Blog Number */}
                    <div className="flex items-center gap-3 mb-4">
                      <BookOpen className="text-amber-600" size={24} />
                      <span className="text-sm font-semibold text-amber-700 tracking-wider">
                        {blog.blogNumber}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl lg:text-3xl font-light text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {blog.title}
                    </h2>
                    
                    <div className="w-16 h-px bg-amber-400 mb-6 group-hover:w-24 transition-all duration-300"></div>
                    
                    {/* Description */}
                    <p className="text-gray-700 text-base lg:text-lg leading-relaxed mb-8">
                      {blog.description}
                    </p>
                    
                    {/* Read More Button */}
                    <div>
                      <a href={blog.link}>
                        <button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 hover:scale-105 hover:shadow-lg font-medium">
                          <BookOpen size={20} />
                          <span>Read the Full Blog</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </a>
                    </div>
                  </div>

                  <div className="h-1 bg-gradient-to-r from-amber-400 to-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}