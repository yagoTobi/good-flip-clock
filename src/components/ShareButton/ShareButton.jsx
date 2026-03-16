import { useState, useRef, useEffect } from "react";
import { FaLink, FaCheck, FaFacebookF, FaRedditAlien, FaWhatsapp, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "./ShareButton.css";

const SHARE_URL = "https://goodflipclock.com";
const SHARE_TEXT = "Check out this beautiful flip clock app — perfect for focus sessions, timers & pomodoro!";

const SOCIALS = [
  {
    id: "copy",
    label: "Copy link",
    icon: null, // handled dynamically (FaLink / FaCheck)
  },
  {
    id: "x",
    label: "Share on X",
    icon: <FaXTwitter size={14} aria-hidden="true" />,
    getUrl: () =>
      `https://x.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`,
  },
  {
    id: "facebook",
    label: "Share on Facebook",
    icon: <FaFacebookF size={14} aria-hidden="true" />,
    getUrl: () =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}&quote=${encodeURIComponent(SHARE_TEXT)}`,
  },
  {
    id: "reddit",
    label: "Share on Reddit",
    icon: <FaRedditAlien size={14} aria-hidden="true" />,
    getUrl: () =>
      `https://www.reddit.com/submit?url=${encodeURIComponent(SHARE_URL)}&title=${encodeURIComponent(SHARE_TEXT)}`,
  },
  {
    id: "whatsapp",
    label: "Share on WhatsApp",
    icon: <FaWhatsapp size={15} aria-hidden="true" />,
    getUrl: () =>
      `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`,
  },
  {
    id: "linkedin",
    label: "Share on LinkedIn",
    icon: <FaLinkedinIn size={14} aria-hidden="true" />,
    getUrl: () =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`,
  },
];

function SharePopup({ onClose, popupPosition, containerRef }) {
  const [copied, setCopied] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Ignore clicks inside the popup or on the trigger button's container
      if (popupRef.current?.contains(e.target)) return;
      if (containerRef?.current?.contains(e.target)) return;
      onClose();
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [onClose, containerRef]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = SHARE_URL;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSocialClick = (social) => {
    if (social.id === "copy") {
      handleCopy();
      return;
    }
    window.open(social.getUrl(), "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div
      ref={popupRef}
      className={`share-popup ${popupPosition}`}
      role="menu"
      aria-label="Share options"
    >
      {SOCIALS.map((social) => (
        <button
          key={social.id}
          className={`share-popup-item${social.id === "copy" && copied ? " copied" : ""}`}
          onClick={() => handleSocialClick(social)}
          aria-label={social.id === "copy" ? (copied ? "Link copied!" : "Copy link") : social.label}
          role="menuitem"
        >
          {social.id === "copy" ? (
            copied ? (
              <FaCheck size={14} aria-hidden="true" />
            ) : (
              <FaLink size={14} aria-hidden="true" />
            )
          ) : (
            social.icon
          )}
        </button>
      ))}
    </div>
  );
}

// Desktop share button (fixed position, mirrors CoffeeButton)
// Popup is always in the DOM — slides up/down via CSS transition on hover.
function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);
  const leaveTimer = useRef(null);

  const handleEnter = () => {
    clearTimeout(leaveTimer.current);
    setIsOpen(true);
  };

  const handleLeave = () => {
    leaveTimer.current = setTimeout(() => setIsOpen(false), 250);
  };

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = SHARE_URL;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSocialClick = (social) => {
    if (social.id === "copy") {
      handleCopy();
      return;
    }
    window.open(social.getUrl(), "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="share-button-container"
      ref={containerRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div
        className={`share-popup popup-above${isOpen ? " open" : ""}`}
        role="menu"
        aria-label="Share options"
      >
        {SOCIALS.map((social) => (
          <button
            key={social.id}
            className={`share-popup-item${social.id === "copy" && copied ? " copied" : ""}`}
            onClick={() => handleSocialClick(social)}
            aria-label={social.id === "copy" ? (copied ? "Link copied!" : "Copy link") : social.label}
            role="menuitem"
            tabIndex={isOpen ? 0 : -1}
          >
            {social.id === "copy" ? (
              copied ? (
                <FaCheck size={14} aria-hidden="true" />
              ) : (
                <FaLink size={14} aria-hidden="true" />
              )
            ) : (
              social.icon
            )}
          </button>
        ))}
      </div>
      <button
        className="share-button"
        aria-label="Share this app"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        title="Share"
      >
        <ShareIcon size={20} className="share-icon" />
      </button>
    </div>
  );
}

// Inline share button for MobileBottomBar / LandscapeBar
function ShareButtonInline({ className, iconSize = 18, onPopupChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    onPopupChange?.(isOpen);
  }, [isOpen, onPopupChange]);

  return (
    <div className="share-inline-container" ref={containerRef}>
      {isOpen && (
        <SharePopup
          onClose={() => setIsOpen(false)}
          popupPosition="popup-above"
          containerRef={containerRef}
        />
      )}
      <button
        className={className}
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Share this app"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <ShareIcon size={iconSize} />
      </button>
    </div>
  );
}

function ShareIcon({ size = 20, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
    </svg>
  );
}

export default ShareButton;
export { ShareButtonInline };
