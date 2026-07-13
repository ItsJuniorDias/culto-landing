import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initial = (user?.name || "?").trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-[60] border-b border-line bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex h-[70px] max-w-wrap items-center justify-between px-6">
        <Logo to="/" />

        <div className="flex items-center gap-3 sm:gap-5">
          <a
            href="/#packs"
            className="font-util hidden text-[13px] font-medium uppercase tracking-[0.14em] text-ash transition-colors hover:text-bone sm:inline"
          >
            Ver catálogo
          </a>

          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="font-display grid h-9 w-9 place-items-center bg-blood-deep text-sm font-bold text-bone"
            >
              {initial}
            </span>
            <span className="hidden text-sm text-ash sm:inline">
              {user?.name}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="font-util border border-line px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-bone transition-colors hover:border-blood hover:text-blood"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
