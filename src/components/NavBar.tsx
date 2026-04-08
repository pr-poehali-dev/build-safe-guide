import { useState } from "react";
import { PageId } from "@/pages/Index";
import Icon from "@/components/ui/icon";

const navItems: { id: PageId; label: string; icon: string }[] = [
  { id: "home", label: "Главная", icon: "House" },
  { id: "schema", label: "Схема", icon: "GitBranch" },
  { id: "reference", label: "Справочник", icon: "BookOpen" },
  { id: "calculator", label: "Калькулятор", icon: "Calculator" },
  { id: "recommendations", label: "Рекомендации", icon: "ClipboardList" },
  { id: "authors", label: "Литература", icon: "Library" },
];

interface NavBarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

const NavBar = ({ currentPage, onNavigate }: NavBarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center">
            <Icon name="Layers" size={16} className="text-white" />
          </div>
          <span className="font-oswald text-lg font-bold tracking-widest text-white uppercase">СтройРасчёт</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === item.id
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon name={item.icon} size={14} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-white/70 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuOpen ? "X" : "Menu"} size={22} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0f0f1a] border-t border-white/10 px-4 py-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                currentPage === item.id
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default NavBar;