"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { flushSync } from 'react-dom';
import { X, Clock, ChevronRight, BookOpen, Calendar, Rocket, Search, Users } from 'lucide-react';
import type Fuse from 'fuse.js';

interface SearchIndexItem {
  id: string;
  title: string;
  type: 'blog' | 'event' | 'project' | 'funzone' | 'team';
  slug: string;
  tags: string[];
  description: string;
  category: string;
  date: string;
  image?: string;
  url?: string;
  author?: string;
  projectType?: string;
}

const Tan3Accent = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.08]">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="tan3-pattern" x="0" y="0" width="80" height="120" patternUnits="userSpaceOnUse">
          <line x1="10" y1="40" x2="20" y2="10" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="100" x2="60" y2="70" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#tan3-pattern)" />
    </svg>
  </div>
);

export function SearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [fuseInstance, setFuseInstance] = useState<Fuse<SearchIndexItem> | null>(null);
  const [results, setResults] = useState<SearchIndexItem[]>([]);
  const [fullIndex, setFullIndex] = useState<SearchIndexItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 1. Initial Mount & Load Index
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('slashdot_search_history');
    if (saved) setRecentSearches(JSON.parse(saved));

    const loadIndex = async () => {
      try {
        const res = await fetch('/slashdot-website-2026/search-index.json');
        const data = await res.json();
        setFullIndex(data);
      } catch (err) {
        console.error('Failed to load search index:', err);
      }
    };
    loadIndex();
  }, []);

  // 2. Global Ctrl + K Trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleOverlay();
      }
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    // Custom trigger from navbar and tag pills
    const handleOpenWithQuery = (e: any) => {
      const { query: q } = e.detail || {};
      if (q) {
        if (!document.startViewTransition) {
          setisOpenState(true);
          setQuery(q);
        } else {
          document.startViewTransition(() => {
            flushSync(() => {
              setIsOpen(true);
              setQuery(q);
            });
          });
        }
      } else {
        toggleOverlay();
      }
    };

    window.addEventListener('slashdot:open-search' as any, handleOpenWithQuery);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('slashdot:open-search' as any, handleOpenWithQuery);
    };
  }, [isOpen]);

  // Helper for internal state sync to avoid naming conflict with toggleOverlay
  const setisOpenState = (val: boolean) => {
    setIsOpen(val);
  };

  const toggleOverlay = () => {
    if (!document.startViewTransition) {
      setIsOpen(prev => !prev);
      return;
    }
    document.startViewTransition(() => {
      flushSync(() => {
        setIsOpen(prev => !prev);
      });
    });
  };

  // 3. Command Parsing [scope]/[query] — isTagMode, isAuthorMode, isTypeMode derived here
  const { activeScope, searchTerms, isTagMode, isAuthorMode, isTypeMode } = useMemo(() => {
    const parts = query.split('/');
    if (parts.length > 1) {
      const scope = parts[0].toLowerCase();
      const valid = ['blog', 'events', 'projects', 'funzone', 'team', 'all'];
      if (valid.includes(scope)) {
        const terms = parts.slice(1).join('/').trim();
        return {
          activeScope: scope,
          searchTerms: terms,
          isTagMode: terms.startsWith('#'),
          isAuthorMode: terms.startsWith('@'),
          isTypeMode: terms.toLowerCase().startsWith('type:'),
        };
      }
    }
    const terms = query.trim();
    return {
      activeScope: 'all',
      searchTerms: terms,
      isTagMode: terms.startsWith('#'),
      isAuthorMode: terms.startsWith('@'),
      isTypeMode: terms.toLowerCase().startsWith('type:'),
    };
  }, [query]);

  // 4. Fluid Transition for Scoped Mode
  const handleQueryChange = (newVal: string) => {
    const oldParts = query.split('/');
    const newParts = newVal.split('/');
    const oldScope = oldParts.length > 1 ? oldParts[0].toLowerCase() : 'all';
    const newScope = newParts.length > 1 ? newParts[0].toLowerCase() : 'all';
    const valid = ['blog', 'events', 'projects', 'team'];
    
    const isScopeTrigger = (valid.includes(oldScope) || valid.includes(newScope)) && oldScope !== newScope;

    if (isScopeTrigger && document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          setQuery(newVal);
        });
      });
    } else {
      setQuery(newVal);
    }
  };

  // 5. Build Fuse Instance — rebuilds only when scope or search MODE flips
  useEffect(() => {
    if (isOpen && fullIndex.length > 0) {
      const initFuse = async () => {
        const Fuse = (await import('fuse.js')).default;
        
        const scopedData = activeScope === 'all' 
          ? fullIndex 
          : fullIndex.filter(item => {
              if (activeScope === 'events') return item.type === 'event';
              if (activeScope === 'projects') return item.type === 'project';
              if (activeScope === 'funzone') return item.type === 'funzone';
              if (activeScope === 'team') return item.type === 'team';
              return item.type === 'blog';
            });

        // Dynamic key weights based on detected mode
        let keys: { name: string; weight: number }[];
        let threshold: number;

        if (isAuthorMode) {
          // @Author mode: near-exact author match is paramount
          keys = [
            { name: 'author', weight: 1.0 },
            { name: 'title', weight: 0.1 },
          ];
          threshold = 0.25;
        } else if (isTypeMode) {
          // type: mode: match project category
          keys = [
            { name: 'projectType', weight: 1.0 },
            { name: 'title', weight: 0.1 },
          ];
          threshold = 0.25;
        } else if (isTagMode) {
          keys = [
            { name: 'tags', weight: 1.0 },
            { name: 'title', weight: 0.2 },
            { name: 'description', weight: 0.1 },
          ];
          threshold = 0.3;
        } else {
          keys = [
            { name: 'title', weight: 1.0 },
            { name: 'tags', weight: 0.7 },
            { name: 'description', weight: 0.4 },
            { name: 'author', weight: 0.3 },
          ];
          threshold = 0.4;
        }

        const fuse = new Fuse(scopedData, { threshold, includeScore: true, keys });
        setFuseInstance(fuse);
      };
      initFuse();
    }
  // isTagMode/isAuthorMode/isTypeMode — only rebuild when mode flips, not every keystroke
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, fullIndex, activeScope, isTagMode, isAuthorMode, isTypeMode]);

  // 6. Perform Search — strip prefix characters before querying Fuse
  useEffect(() => {
    if (fuseInstance && searchTerms) {
      let fuseQuery = searchTerms;
      if (isTagMode)    fuseQuery = searchTerms.slice(1).trim();       // strip #
      if (isAuthorMode) fuseQuery = searchTerms.slice(1).trim();       // strip @
      if (isTypeMode)   fuseQuery = searchTerms.slice(5).trim();       // strip type:
      if (!fuseQuery) { setResults([]); return; }
      const res = fuseInstance.search(fuseQuery);
      setResults(res.map(r => r.item));
    } else {
      setResults([]);
    }
  }, [fuseInstance, searchTerms, isTagMode, isAuthorMode, isTypeMode]);

  // 7. Reset active index when query or scope changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query, activeScope]);

  // 8. Scroll active item into view
  useEffect(() => {
    if (isOpen && activeIndex >= 0) {
      const activeEl = document.querySelector(`[data-index="${activeIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [activeIndex, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    }
  };

  const handleSelect = (item: SearchIndexItem) => {
    const history = [query, ...recentSearches.filter(s => s !== query)].slice(0, 3);
    setRecentSearches(history);
    localStorage.setItem('slashdot_search_history', JSON.stringify(history));
    
    setIsOpen(false);
    if (item.type === 'funzone') {
      // Funzone items that have external urls open externally, otherwise navigate to page
      if (item.url) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      } else {
        router.push(`/fun-zone/${item.slug}`);
      }
      return;
    }
    if (item.type === 'team') {
      router.push(item.url || '/team');
      return;
    }
    const basePath = item.type === 'blog' ? '/blog/' : item.type === 'event' ? '/events/' : '/projects/';
    router.push(`${basePath}${item.slug}`);
  };

  if (!isMounted || !isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[12vh] px-4 backdrop-blur-xl bg-background/80 transition-all duration-300"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-neutral-900 border-2 border-primary/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center gap-4 bg-white/50 dark:bg-neutral-900/50">
          <div className="flex-1 flex items-center relative gap-3">
            {activeScope !== 'all' && (
              <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-black rounded uppercase tracking-tighter animate-in slide-in-from-left-2">
                {activeScope}/
              </span>
            )}
            {searchTerms.startsWith('#') && searchTerms.length > 1 && (
              <span className="px-2 py-0.5 bg-primary text-black text-[10px] font-black rounded uppercase tracking-tighter animate-in zoom-in-75 duration-300 flex items-center gap-1">
                # Tag: {searchTerms.slice(1).split(' ')[0]}
              </span>
            )}
            {isAuthorMode && searchTerms.length > 1 && (
              <span className="px-2 py-0.5 bg-sky-500 text-white text-[10px] font-black rounded uppercase tracking-tighter animate-in zoom-in-75 duration-300 flex items-center gap-1">
                @ {searchTerms.slice(1).split(' ')[0]}
              </span>
            )}
            {isTypeMode && searchTerms.length > 5 && (
              <span className="px-2 py-0.5 bg-violet-500 text-white text-[10px] font-black rounded uppercase tracking-tighter animate-in zoom-in-75 duration-300 flex items-center gap-1">
                📁 {searchTerms.slice(5).split(' ')[0].replace(/_/g, ' ')}
              </span>
            )}
            <input
              ref={inputRef}
              autoFocus
              className="flex-1 bg-transparent border-none outline-none font-bold text-lg md:text-xl placeholder:text-neutral-400 py-1"
              placeholder={activeScope === 'all' ? "Try 'blog/' or 'events/'..." : "Searching content..."}
              value={query}
              onChange={e => handleQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-black/10 dark:border-white/10 bg-neutral-100 dark:bg-neutral-800 text-[10px] font-bold text-neutral-500 shadow-sm">ESC</kbd>
             </div>
             <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-neutral-400" />
             </button>
          </div>
        </div>

        {/* Content */}
        <div 
          ref={scrollContainerRef}
          className="overflow-y-auto flex-1 p-2 custom-scrollbar"
        >
          {!query && (
            <div className="p-4 space-y-8">
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 pl-2">
                    <Clock className="w-3.5 h-3.5" /> Recent
                  </h3>
                  <div className="space-y-1">
                    {recentSearches.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleQueryChange(s)}
                        className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-primary/10 transition-colors text-left group"
                      >
                        <Search className="w-4 h-4 text-neutral-400 group-hover:text-primary transition-colors" />
                        <span className="text-sm font-bold text-neutral-600 dark:text-neutral-300">{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 pl-2">
                  <Rocket className="w-3.5 h-3.5" /> Quick Scopes
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'blog/', name: 'Blogs', icon: BookOpen, color: 'text-blue-500 bg-blue-500/10' },
                    { id: 'events/', name: 'Events', icon: Calendar, color: 'text-green-500 bg-green-500/10' },
                    { id: 'projects/', name: 'Projects', icon: Rocket, color: 'text-primary bg-primary/10' },
                    { id: 'funzone/', name: 'Fun Zone', icon: Search, color: 'text-orange-500 bg-orange-500/10' },
                  ].map(sc => (
                    <button
                      key={sc.id}
                      onClick={() => handleQueryChange(sc.id)}
                      className={`p-4 rounded-xl flex flex-col items-center gap-2 border border-transparent hover:border-primary/20 transition-all hover:scale-[1.03] ${sc.color}`}
                    >
                      <sc.icon className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{sc.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="p-2 space-y-6 pb-4">
              {/* Author mode hint banner */}
              {isAuthorMode && searchTerms.length > 1 && (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 animate-in fade-in duration-300">
                  <span className="text-sky-500 text-lg font-black">@</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest">
                      Posts by {searchTerms.slice(1).trim()}
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Showing all content by this author</p>
                  </div>
                </div>
              )}
              {['event', 'blog', 'project', 'team', 'funzone'].map(type => {
                const group = results.filter(r => r.type === type);
                if (group.length === 0) return null;

                const sectionLabel = type === 'funzone' ? '🎮 Fun Zone' : type === 'team' ? 'Team Members' : `${type}s`;
                const sectionIcon = type === 'event' ? <Calendar className="w-3.5 h-3.5" /> : type === 'blog' ? <BookOpen className="w-3.5 h-3.5" /> : type === 'funzone' ? <Search className="w-3.5 h-3.5 text-orange-500" /> : type === 'team' ? <Users className="w-3.5 h-3.5 text-purple-500" /> : <Rocket className="w-3.5 h-3.5" />;

                return (
                  <div key={type}>
                    <div className="relative h-8 flex items-center mb-3 rounded-lg overflow-hidden border border-primary/10">
                      <Tan3Accent />
                      <h3 className="relative z-10 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                        {sectionIcon}
                        {sectionLabel}
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {group.map(item => {
                        const globalIndex = results.indexOf(item);
                        const isSelected = globalIndex === activeIndex;

                        return (
                          <div 
                            key={item.id}
                            data-index={globalIndex}
                            onClick={() => handleSelect(item)}
                            aria-selected={isSelected}
                            className={`group p-3 rounded-xl transition-all cursor-pointer border-2 ${
                              isSelected 
                                ? 'bg-primary/5 border-primary shadow-sm scale-[1.01]' 
                                : 'border-transparent hover:bg-primary/10 hover:border-primary/20'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-3">
                              {/* Thumbnail for funzone items */}
                              {item.type === 'funzone' && item.image && (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-10 h-10 rounded-lg object-cover shrink-0 border border-primary/10"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                   <h4 className={`font-extrabold flex items-center gap-2 transition-colors ${isSelected ? 'text-primary' : 'text-neutral-800 dark:text-neutral-100 group-hover:text-primary'}`}>
                                     {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                                     {item.title}
                                   </h4>
                                   <ChevronRight className={`w-4 h-4 shrink-0 transition-all ${isSelected ? 'text-primary translate-x-1' : 'text-neutral-400 group-hover:translate-x-1 group-hover:text-primary'}`} />
                                </div>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-1 font-medium italic">{item.description}</p>
                                <div className="flex gap-1.5 mt-2 flex-wrap">
                                   {item.tags.slice(0, 3).map(tag => (
                                     <span key={tag} className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase transition-colors ${isSelected ? 'bg-primary text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>#{tag}</span>
                                   ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {query.trim() && searchTerms && results.length === 0 && (
            <div className="p-12 text-center text-neutral-400 space-y-2">
              <Search className="w-12 h-12 mx-auto opacity-20" />
              <p className="font-bold">No results for &quot;{searchTerms}&quot;</p>
              <p className="text-xs">Try a different scope or check your spelling.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 border-t border-black/5 dark:border-white/5 flex items-center justify-between px-4">
          <div className="flex items-center gap-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <kbd className="px-1 py-0.5 rounded ring-1 ring-inset ring-black/10 dark:ring-white/10 bg-white dark:bg-neutral-900 shadow-sm text-[9px]">ENTER</kbd>
              <span>To Select</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1 py-0.5 rounded ring-1 ring-inset ring-black/10 dark:ring-white/10 bg-white dark:bg-neutral-900 shadow-sm text-[9px]">/</kbd>
              <span>To Scope</span>
            </div>
          </div>
          <div className="text-[9px] font-black text-primary/50 flex items-center gap-1 uppercase tracking-widest italic">
            Search Engine v2.0
          </div>
        </div>
      </div>
    </div>
  );
}
