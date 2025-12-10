import React, { useState } from "react";
import { AnalyzeResponse, WordItem } from "./types";
import { WordCloud3D } from "./components/WordCloud3D";

const SAMPLE_URLS: string[] = [
  "https://www.bbc.com/news",
  "https://www.cnn.com/",
  "https://www.nytimes.com/",
];

const BACKEND_URL = "http://localhost:8000";

const App: React.FC = () => {
  const [url, setUrl] = useState<string>(SAMPLE_URLS[0]);
  const [words, setWords] = useState<WordItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setWords(null);
    try {
      const resp = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.detail || "Request failed");
      }
      const data = (await resp.json()) as AnalyzeResponse;
      setWords(data.words);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        background: "#050816",
        color: "#f5f5f5",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <header style={{ padding: "1rem", borderBottom: "1px solid #222" }}>
        <h1 style={{ margin: 0 }}>3D Word Cloud</h1>
        <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem", opacity: 0.8 }}>
          Visualize topics from a news article as an interactive 3D word cloud.
        </p>
      </header>

      <div style={{ display: "flex", padding: "1rem", gap: "1rem" }}>
        <div style={{ flex: "0 0 320px" }}>
          <label style={{ fontSize: "0.85rem", opacity: 0.9 }}>
            Article URL
          </label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter article URL"
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              marginTop: "0.25rem",
              borderRadius: "4px",
              border: "1px solid #333",
              background: "#0a0f1f",
              color: "#f5f5f5",
              outline: "none",
            }}
          />
          <div style={{ marginTop: "0.5rem" }}>
            <span
              style={{ fontSize: "0.8rem", opacity: 0.8, marginRight: "0.5rem" }}
            >
              Samples:
            </span>
            {SAMPLE_URLS.map((u) => (
              <button
                key={u}
                onClick={() => setUrl(u)}
                style={{
                  fontSize: "0.75rem",
                  marginRight: "0.25rem",
                  marginBottom: "0.25rem",
                  padding: "0.2rem 0.4rem",
                  borderRadius: "3px",
                  border: "none",
                  cursor: "pointer",
                  background: "#1d4ed8",
                  color: "#fff",
                }}
              >
                {new URL(u).hostname.replace("www.", "")}
              </button>
            ))}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !url}
            style={{
              marginTop: "0.75rem",
              padding: "0.5rem 1rem",
              borderRadius: "999px",
              border: "none",
              background: loading ? "#6b7280" : "#22c55e",
              color: "#111827",
              cursor: loading ? "default" : "pointer",
              fontWeight: 600,
            }}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>

          {error && (
            <p style={{ marginTop: "0.75rem", color: "#f97373", fontSize: "0.85rem" }}>
              {error}
            </p>
          )}

          {words && !error && (
            <p style={{ marginTop: "0.75rem", fontSize: "0.85rem", opacity: 0.9 }}>
              Extracted {words.length} keywords. Drag to rotate, scroll to zoom.
            </p>
          )}
        </div>

        <div
          style={{
            flex: 1,
            minHeight: "60vh",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid #111",
            background: "#020617",
          }}
        >
          {words && !loading && !error ? (
            <WordCloud3D words={words} />
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.95rem",
                opacity: 0.7,
                textAlign: "center",
                padding: "1rem",
              }}
            >
              {loading && "Building topics and word cloud..."}
              {!loading && !words && "Enter a URL and click Analyze to generate a 3D word cloud."}
              {!loading && error && "Something went wrong. Try another URL."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
