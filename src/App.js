import { useState, useCallback } from "react";
import "./App.css";

// Sentinel used to mark sentence boundaries before splitting
const SENTINEL = "\u0000";

const ABBREV_LOOKBEHIND = "(?<!(?:Mrs|Mr|Dr|Ms|Jr|Sr|Prof|etc))";
const countSentences = (text) => {
  if (!text || typeof text !== "string") return 0;
  const trimmed = text.trim();
  if (trimmed === "") return 0;
  const withEndings = trimmed
    // Treat ! and ? as sentence boundaries
    .replace(/!/g, SENTINEL)
    .replace(/\?/g, SENTINEL)
    // Replace periods that are not preceded by common abbreviations with the sentinel
    // Also not followed by a digit (to avoid decimal numbers) or a letter (to avoid abbreviations)
    .replace(
      new RegExp(`${ABBREV_LOOKBEHIND}\\.(?!\\d)(?!\\w)`, "g"),
      SENTINEL,
    );
  const sentences = withEndings.split(SENTINEL).filter((s) => s.trim() !== "");
  return sentences.length;
};

// Build a map of word -> frequency (words normalized to lowercase, non-letters stripped)
const getWordFrequency = (text) => {
  if (!text || typeof text !== "string") return {};
  const words = text
    .toLowerCase()
    // Replace non-word characters (punctuation) with space, then split on whitespace
    .replace(/[^\w\s]/g, " ")
    // Split on one or more whitespace characters, this makes the result into an array of words
    .split(/\s+/)
    .filter((w) => w.length > 0);
  // Build frequency map
  const frequency = {};
  // Increment count for each word
  words.forEach((word) => {
    // Use the current count or 0 if not present, then add 1
    frequency[word] = (frequency[word] || 0) + 1;
  });
  return frequency;
};

function App() {
  const [inputText, setInputText] = useState("");
  const [report, setReport] = useState(null);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const sentenceCount = countSentences(inputText);
      const wordFreq = getWordFrequency(inputText);
      setReport({
        sentenceCount,
        wordFrequency: wordFreq,
      });
    },
    [inputText],
  );

  const handleClear = useCallback(() => {
    setInputText("");
    setReport(null);
  }, []);

  const wordEntries = report?.wordFrequency
    ? Object.entries(report.wordFrequency).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <div className="app">
      <header className="app-header">
        <h1>Text Analyzer</h1>
        <p className="subtitle">Assignment 2 — CPRO 2101</p>
      </header>

      <form onSubmit={handleSubmit} className="analyzer-form">
        <label htmlFor="text-input">Enter your text:</label>
        <textarea
          id="text-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste text here..."
          rows={6}
          className="text-area"
          aria-describedby="input-hint"
        />
        <span id="input-hint" className="hint">
          Click &quot;Analyze&quot; to see sentence count and word frequency.
        </span>
        <div className="button-group">
          <button type="submit" className="btn btn-primary">
            Analyze
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="btn btn-secondary"
          >
            Clear
          </button>
        </div>
      </form>

      {report && (
        <section className="report" aria-labelledby="report-heading">
          <h2 id="report-heading">Analysis Report</h2>
          <div className="report-section">
            <h3>Sentences (by period, !, ?)</h3>
            <p className="stat">
              Total number of sentences: <strong>{report.sentenceCount}</strong>
            </p>
          </div>
          <div className="report-section">
            <h3>Word frequency</h3>
            {wordEntries.length === 0 ? (
              <p className="no-data">No words to display.</p>
            ) : (
              <ul className="word-list">
                {wordEntries.map(([word, count]) => (
                  <li key={word}>
                    <span className="word">"{word}"</span>
                    <span className="count">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
