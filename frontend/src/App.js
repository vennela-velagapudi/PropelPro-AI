import React, { useMemo, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import html2pdf from "html2pdf.js";
import "./App.css";



function AuthScreen({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const apiBaseUrl = "http://127.0.0.1:8000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      setError("");
      setSuccessMsg("");
      setLoading(true);
      try {
        if (isLogin) {
          const params = new URLSearchParams();
          params.append("username", email);
          params.append("password", password);
          const res = await axios.post(`${apiBaseUrl}/login`, params);
          onAuth(res.data.access_token);
        } else {
          await axios.post(`${apiBaseUrl}/signup`, { email, password });
          setSuccessMsg("Account created successfully. Please log in.");
          setIsLogin(true);
          setPassword("");
        }
      } catch (e) {
        setError(e?.response?.data?.detail || "Authentication failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="pp-page pp-authPage">
      <div className="pp-shell pp-authShell">
        <header className="pp-header" style={{ justifyContent: "center", marginBottom: "32px", textAlign: "center" }}>
          <div>
            <h1 className="pp-title" style={{ fontSize: "36px" }}>PropelPro AI</h1>
            <p className="pp-subtitle" style={{ margin: "12px auto 0" }}>
              Intelligent Sales Proposal Architect
            </p>
          </div>
        </header>

        <div className="pp-card pp-authCard">
          <div className="pp-cardHeader">
            <h2 className="pp-cardTitle">{isLogin ? "Welcome Back" : "Create Account"}</h2>
          </div>
          <div className="pp-cardBody">
            {successMsg && (
              <div className="pp-alert" role="alert" style={{ marginBottom: "16px", borderColor: "rgba(34, 197, 94, 0.45)", background: "rgba(34, 197, 94, 0.10)" }}>
                <p className="pp-alertBody" style={{ color: "rgba(34, 197, 94, 0.9)" }}>{successMsg}</p>
              </div>
            )}
            {error && (
              <div className="pp-alert pp-alertError" role="alert" style={{ marginBottom: "16px" }}>
                <p className="pp-alertBody">{error}</p>
              </div>
            )}
            <form className="pp-form" onSubmit={handleSubmit}>
              <div className="pp-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="pp-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="pp-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  className="pp-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="pp-actions" style={{ gridTemplateColumns: '1fr', marginTop: '14px' }}>
                <button type="submit" className="pp-btn pp-btnPrimary" style={{ fontSize: '15px', padding: '12px' }} disabled={loading}>
                  {loading ? (
                    <>
                      <span className="pp-spinner" />
                      Please wait…
                    </>
                  ) : isLogin ? "Login" : "Sign Up"}
                </button>
              </div>
            </form>
            <div style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
              <button
                type="button"
                className="pp-linkBtn"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setSuccessMsg("");
                }}
                style={{ background: "none", border: "none", color: "var(--accent)" }}
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </button>
              
              {isLogin && (
                <button
                  type="button"
                  className="pp-linkBtn"
                  onClick={() => {
                    if (!email) {
                      setError("Please enter your email above to reset password.");
                      setSuccessMsg("");
                    } else {
                      setError("");
                      setSuccessMsg(`Password reset link sent to ${email}`);
                    }
                  }}
                  style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "13px" }}
                >
                  Forgot your password?
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");

  const handleAuth = (access_token) => {
    setToken(access_token);
    setIsAuthenticated(true);
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  };

  const handleLogout = () => {
    setToken("");
    setIsAuthenticated(false);
    delete axios.defaults.headers.common["Authorization"];
    
    // Clear all user-specific state to prevent data leakage between sessions
    setForm({
      client: "",
      industry: "",
      budget: "",
      services: "",
      discovery_notes: ""
    });
    setResult(null);
    setDiff("");
    setDiffSummary("");
    setHistory(null);
    setSimulation(null);
    setSimulating(false);
    setError("");
    setCurrentView("empty");
  };

  const [form, setForm] = useState({
    client: "",
    industry: "",
    budget: "",
    services: "",
    discovery_notes: ""
  });

  const [result, setResult] = useState(null);
  const [diff, setDiff] = useState("");
  const [diffSummary, setDiffSummary] = useState("");
  const [history, setHistory] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState("empty");

  const apiBaseUrl = useMemo(() => "http://127.0.0.1:8000", []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleViewHistoryVersion = (version) => {
    setResult({
      proposal: version.proposal,
      summary: null,
      risks: null
    });
    if (version.input) {
      setForm({
        client: form.client, // preserve the current client name
        industry: version.input.industry || "",
        budget: version.input.budget || "",
        services: version.input.services || "",
        discovery_notes: version.input.discovery_notes || ""
      });
    }
    setCurrentView("proposal");
  };

  const generateProposal = async () => {
    if (!form.client || !form.industry || !form.budget || !form.services) {
      setError("Please fill in the required fields: client, industry, budget, and services.");
      return;
    }
    
    setError("");
    setLoading(true);
    setDiff("");
    setDiffSummary("");
    setHistory(null);
    setSimulation(null);
    setCurrentView("empty");
    try {
      const res = await axios.post(`${apiBaseUrl}/generate`, form);
      setResult(res.data);
      setCurrentView("proposal");
    } catch (e) {
      const message =
        e?.response?.data?.detail ||
        e?.message ||
        "Request failed";
      setError(String(message));
    } finally {
      setLoading(false);
    }
  };

  const compareVersions = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.get(
        `${apiBaseUrl}/compare/${form.client}`
      );
      setDiff(res.data.diff);
      setDiffSummary(res.data.summary || "");
      setCurrentView("comparison");
    } catch (e) {
      const message =
        e?.response?.data?.detail ||
        e?.message ||
        "Request failed";
      setError(String(message));
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.get(`${apiBaseUrl}/history/${form.client}`);
      setHistory(res.data.history || []);
      setCurrentView("history");
    } catch (e) {
      const message =
        e?.response?.data?.detail ||
        e?.message ||
        "Request failed";
      setError(String(message));
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    setError("");
    setSimulating(true);
    try {
      const payload = {
        proposal: result.proposal,
        industry: form.industry || "General Business"
      };
      const res = await axios.post(`${apiBaseUrl}/simulate`, payload);
      setSimulation(res.data);
      setCurrentView("simulation");
    } catch (e) {
      const message =
        e?.response?.data?.detail ||
        e?.message ||
        "Simulation failed";
      setError(String(message));
    } finally {
      setSimulating(false);
    }
  };

  const downloadProposal = () => {
    if (!result || !result.proposal) return;
    
    const element = document.getElementById("proposal-document");
    if (!element) return;

    element.classList.add("pdf-export");
    
    const opt = {
      margin:       10,
      filename:     `${form.client || 'client'}_proposal.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      element.classList.remove("pdf-export");
    });
  };

  if (!isAuthenticated) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  return (
    <div className="pp-page">
      <div className="pp-shell">
        <header className="pp-header">
          <div>
            <h1 className="pp-title">PropelPro AI</h1>
            <p className="pp-subtitle">
              Generate a client-ready proposal, an executive summary, and key risks.
              Compare versions anytime.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
            <div className="pp-pillrow">
              <div className="pp-pill">Frontend: React</div>
              <div className="pp-pill">Backend: FastAPI</div>
              <div className="pp-pill">LLM: Ollama</div>
            </div>
            <button 
              className="pp-linkBtn" 
              onClick={handleLogout}
              style={{ color: "var(--danger)", borderColor: "rgba(239, 68, 68, 0.25)" }}
            >
              Log Out
            </button>
          </div>
        </header>

        <main className="pp-grid">
          <section className="pp-card">
            <div className="pp-cardHeader">
              <h2 className="pp-cardTitle">Project details</h2>
            </div>
            <div className="pp-cardBody">
              <div className="pp-form">
                <div className="pp-field">
                  <label htmlFor="client">Client</label>
                  <input
                    id="client"
                    name="client"
                    className="pp-input"
                    placeholder="e.g., Stark Trek"
                    value={form.client}
                    onChange={handleChange}
                  />
                </div>

                <div className="pp-field">
                  <label htmlFor="industry">Industry</label>
                  <input
                    id="industry"
                    name="industry"
                    className="pp-input"
                    placeholder="e.g., SaaS / Technology"
                    value={form.industry}
                    onChange={handleChange}
                  />
                </div>

                <div className="pp-field">
                  <label htmlFor="budget">Budget</label>
                  <input
                    id="budget"
                    name="budget"
                    className="pp-input"
                    placeholder="e.g., $150,000"
                    value={form.budget}
                    onChange={handleChange}
                  />
                </div>

                <div className="pp-field">
                  <label htmlFor="services">Services</label>
                  <textarea
                    id="services"
                    name="services"
                    className="pp-textarea"
                    placeholder="Migration, CI/CD, training, support…"
                    value={form.services}
                    onChange={handleChange}
                    style={{ minHeight: "80px" }}
                  />
                </div>

                <div className="pp-field">
                  <label htmlFor="discovery_notes">Discovery Notes (Voice of Customer)</label>
                  <textarea
                    id="discovery_notes"
                    name="discovery_notes"
                    className="pp-textarea"
                    placeholder="Key pain points, specific phrasing the client uses, what they hate/love..."
                    value={form.discovery_notes}
                    onChange={handleChange}
                    style={{ minHeight: "80px" }}
                  />
                </div>

                <div className="pp-actions" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                  <button
                    className="pp-btn pp-btnPrimary"
                    onClick={generateProposal}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="pp-spinner" />
                        Generating…
                      </>
                    ) : (
                      "Generate proposal"
                    )}
                  </button>
                  <button
                    className="pp-btn pp-btnSecondary"
                    onClick={compareVersions}
                    disabled={loading || !form.client}
                    title={!form.client ? "Enter a client name first" : undefined}
                  >
                    Compare versions
                  </button>
                  <button
                    className="pp-btn"
                    onClick={fetchHistory}
                    disabled={loading || !form.client}
                    title={!form.client ? "Enter a client name first" : undefined}
                  >
                    View history
                  </button>
                </div>

                <div className="pp-actions" style={{ marginTop: "12px", gridTemplateColumns: "1fr" }}>
                  <button
                    className="pp-btn"
                    onClick={downloadProposal}
                    disabled={!result}
                    style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--success)", borderColor: "rgba(16, 185, 129, 0.25)" }}
                  >
                    Download proposal
                  </button>
                </div>

                <p className="pp-hint">
                  Tip: first generation on a fresh Ollama model can take longer; subsequent runs are faster.
                </p>
              </div>
            </div>
          </section>

          <section className="pp-stack">
            {error && (
              <div className="pp-alert pp-alertError" role="alert">
                <p className="pp-alertTitle">Request failed</p>
                <p className="pp-alertBody">{error}</p>
              </div>
            )}

            {currentView === "empty" && !error && (
              <div className="pp-alert pp-alertInfo">
                <p className="pp-alertTitle">Ready when you are</p>
                <p className="pp-alertBody">
                  Fill in the project details and generate a proposal. You can compare past versions by client name.
                </p>
                <div className="pp-kv">
                  <span><strong>API</strong> {apiBaseUrl}</span>
                  <span><strong>Docs</strong> {apiBaseUrl}/docs</span>
                </div>
              </div>
            )}

            {currentView === "proposal" && result && (
              <div id="proposal-document">
                <div className="pp-card">
                  <div className="pp-cardHeader" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 className="pp-cardTitle">Proposal</h2>
                    <button 
                      className="pp-btn pp-btnSecondary" 
                      onClick={runSimulation}
                      disabled={simulating}
                      style={{ padding: "6px 12px", fontSize: "12px", background: "rgba(37, 99, 235, 0.15)", borderColor: "rgba(37, 99, 235, 0.3)" }}
                    >
                      {simulating ? "Simulating..." : "⚡ Simulate Client Reaction"}
                    </button>
                  </div>
                  <div className="pp-cardBody">
                    <div className="pp-markdown">
                      <ReactMarkdown>{result.proposal}</ReactMarkdown>
                    </div>
                  </div>
                </div>

                {result.summary && (
                  <div className="pp-card">
                    <div className="pp-cardHeader">
                      <h2 className="pp-cardTitle">Executive summary</h2>
                    </div>
                    <div className="pp-cardBody">
                      <div className="pp-markdown">
                        <ReactMarkdown>{result.summary}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {result.risks && (
                  <div className="pp-card">
                    <div className="pp-cardHeader">
                      <h2 className="pp-cardTitle">Risks & assumptions</h2>
                    </div>
                    <div className="pp-cardBody">
                      <div className="pp-markdown">
                        <ReactMarkdown>{result.risks}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentView === "simulation" && simulation && (
              <div className="pp-card pp-simulationCard">
                <div className="pp-cardHeader">
                  <h2 className="pp-cardTitle" style={{ color: "var(--warning)" }}>Live Negotiation Simulator</h2>
                </div>
                <div className="pp-cardBody pp-stack">
                  <div className="pp-chatBubble pp-clientBubble">
                    <strong>Client Objection:</strong>
                    <p>{simulation.objection}</p>
                  </div>
                  <div className="pp-chatBubble pp-coachBubble">
                    <strong>AI Coach Advice:</strong>
                    <p>{simulation.rebuttal}</p>
                  </div>
                </div>
                <div className="pp-cardFooter" style={{ padding: "16px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
                  <button className="pp-btn" onClick={() => setCurrentView("proposal")}>
                    Back to Proposal
                  </button>
                </div>
              </div>
            )}

            {currentView === "comparison" && (
              <>
                {diffSummary && (
                  <div className="pp-card">
                    <div className="pp-cardHeader">
                      <h2 className="pp-cardTitle">Changes in this Version</h2>
                    </div>
                    <div className="pp-cardBody">
                      <div className="pp-markdown">
                        <ReactMarkdown>{diffSummary}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {diff === "At least 2 versions are needed to compare" && (
                  <div className="pp-alert pp-alertInfo" style={{ marginTop: "14px" }}>
                    <p className="pp-alertTitle" style={{ marginBottom: "0" }}>{diff}</p>
                  </div>
                )}
                
                {result && (
                  <div style={{ textAlign: "center", marginTop: "16px" }}>
                    <button className="pp-btn" onClick={() => setCurrentView("proposal")}>
                      Back to Proposal
                    </button>
                  </div>
                )}
              </>
            )}

            {currentView === "history" && history && (
              <>
                <div className="pp-card">
                  <div className="pp-cardHeader">
                    <h2 className="pp-cardTitle">Negotiation History Timeline</h2>
                  </div>
                  <div className="pp-cardBody">
                    {history.length === 0 ? (
                      <p style={{ color: "var(--muted)", fontSize: "14px", margin: 0 }}>No history found for this client.</p>
                    ) : (
                      <div className="pp-timeline">
                        {history.map((version, idx) => (
                          <div key={idx} className="pp-timelineNode">
                            <div className="pp-timelineHeader" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                              <div>
                                <span className="pp-timelineVersion">Version {idx + 1}</span>
                                <span className="pp-timelineDate">
                                  {version.timestamp 
                                    ? new Date(version.timestamp).toLocaleString() 
                                    : "Legacy Version (No timestamp)"}
                                </span>
                              </div>
                              <button 
                                className="pp-btn pp-btnSecondary"
                                style={{ padding: "4px 10px", fontSize: "12px", background: "white" }}
                                onClick={() => handleViewHistoryVersion(version)}
                              >
                                View Proposal
                              </button>
                            </div>
                            <div className="pp-timelineContent">
                              <div className="pp-kv" style={{ marginTop: 0 }}>
                                {version.input?.budget && (
                                  <span><strong>Budget:</strong> {version.input.budget}</span>
                                )}
                                {version.input?.industry && (
                                  <span><strong>Industry:</strong> {version.input.industry}</span>
                                )}
                                {version.input?.services && (
                                  <span><strong>Services:</strong> {version.input.services.substring(0, 30)}{version.input.services.length > 30 ? "..." : ""}</span>
                                )}
                                {version.input?.discovery_notes && (
                                  <span style={{ width: "100%" }}><strong>Voice of Customer:</strong> {version.input.discovery_notes}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {result && (
                  <div style={{ textAlign: "center", marginTop: "16px" }}>
                    <button className="pp-btn" onClick={() => setCurrentView("proposal")}>
                      Back to Proposal
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;