import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { quotes } from "../../data/quotes";
import "./InspirationalQuote.css";

const InspirationalQuote = () => {
  const { showQuote } = useTheme();
  const [quote] = useState(
    () => quotes[Math.floor(Math.random() * quotes.length)]
  );

  if (!showQuote) return null;

  return (
    <div className="inspirational-quote" aria-live="polite">
      <p className="quote-text">"{quote.text}"</p>
      <span className="quote-author">— {quote.author}</span>
    </div>
  );
};

export default InspirationalQuote;
