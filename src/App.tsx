import { useState } from 'react'
import './App.css'
import overviewSvg from './assets/overview.svg'
import timeSpaceImg from './assets/time_space_relationship.png'
import bookExtractionSvg from './assets/book_extraction_success_pro.svg'
import Navigation from './components/Navigation'
import Explorer from './components/Explorer'

type GuardRow = {
  model: string
  params: string
  roc: number
  // Detection mean scores: Malicious, Combined, Encoding, PTLP, PSLP
  scores: [number, number, number, number, number]
  time: string
  tokens: string
}

const guardModelGroups: { name: string; rows: GuardRow[] }[] = [
  {
    name: 'Purpose-Built Classifiers',
    rows: [
      { model: 'Llama Prompt Guard 1', params: '86M', roc: 0.831, scores: [0.41, 0.98, 1.0, 0.99, 0.91], time: '52ms', tokens: '—' },
      { model: 'Llama Prompt Guard 2 (86M)', params: '86M', roc: 0.853, scores: [0.3, 0.98, 0.02, 0.21, 0.12], time: '277ms', tokens: '—' },
      { model: 'Llama Prompt Guard 2 (22M)', params: '22M', roc: 0.855, scores: [0.29, 0.95, 0.1, 0.23, 0.14], time: '267ms', tokens: '—' },
      { model: 'ProtectAI', params: '184M', roc: 0.921, scores: [0.0, 0.95, 0.0, 0.01, 0.99], time: '5ms', tokens: '—' },
      { model: 'PIGuard', params: '184M', roc: 0.925, scores: [0.44, 0.99, 0.11, 0.96, 0.26], time: '6ms', tokens: '—' },
      { model: 'ShieldGemma', params: '2B', roc: 0.836, scores: [0.41, 0.44, 0.01, 0.0, 0.07], time: '201ms', tokens: '—' },
      { model: 'YuFeng-XGuard 0.6B (Instant)', params: '0.6B', roc: 0.906, scores: [0.86, 0.99, 0.01, 0.0, 0.05], time: '27ms', tokens: '—' },
      { model: 'YuFeng-XGuard 8B (Instant)', params: '8B', roc: 0.915, scores: [0.88, 0.99, 0.05, 0.14, 0.05], time: '68ms', tokens: '—' },
    ],
  },
  {
    name: 'Large Language Models',
    rows: [
      { model: 'YuFeng-XGuard 0.6B (Thinking)', params: '0.6B', roc: 0.89, scores: [0.84, 0.99, 0.0, 0.0, 0.81], time: '1457ms', tokens: '571' },
      { model: 'YuFeng-XGuard 8B (Thinking)', params: '8B', roc: 0.893, scores: [0.9, 0.98, 0.02, 0.0, 0.0], time: '579ms', tokens: '171' },
      { model: 'Qwen3-32B (Instant)', params: '32B', roc: 0.895, scores: [0.86, 0.97, 0.86, 0.29, 0.08], time: '796ms', tokens: '742' },
      { model: 'DeepSeek-V3 (Instant)', params: '671B', roc: 0.901, scores: [0.88, 0.97, 0.05, 0.05, 0.04], time: '47ms', tokens: '23' },
      { model: 'Qwen3-32B (Thinking)', params: '32B', roc: 0.888, scores: [0.79, 0.97, 0.82, 0.46, 0.23], time: '1463ms', tokens: '1489' },
      { model: 'DeepSeek-R1 (Thinking)', params: '671B', roc: 0.911, scores: [0.84, 0.97, 0.85, 0.95, 0.96], time: '3486ms', tokens: '2396' },
    ],
  },
]

// Detection score in [0,1]; higher = stronger detection. Render greener for
// high detection, redder for low (missed attacks).
function detectionShade(v: number): string {
  const hue = 120 * Math.max(0, Math.min(1, v))
  return `hsl(${hue}, 62%, 88%)`
}

const usenixCitation = `@inproceedings{fairoze2026bypassingpromptguardsproduction,
  title     = {Bypassing Prompt Guards in Production with Controlled-Release Prompting},
  author    = {Fairoze, Jaiden and Garg, Sanjam and Lee, Keewoo and Wang, Mingyuan},
  booktitle = {35th USENIX Security Symposium (USENIX Security 26)},
  year      = {2026},
  publisher = {USENIX Association}
}`

function App() {
  const [activeTab, setActiveTab] = useState<'paper' | 'explorer'>('paper');
  const [copied, setCopied] = useState(false);

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(usenixCitation).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "paper" ? (
        <div className="container">
          {/* Header Section */}
          <header className="header">
            <h1 className="title">
              Bypassing Prompt Guards in Production with Controlled-Release
              Prompting
            </h1>

            <div className="authors">
              <a
                href="https://www.jaiden.info/"
                className="author"
                target="_blank"
                rel="noopener noreferrer"
              >
                Jaiden Fairoze<sup>1</sup>
              </a>
              <a
                href="https://people.eecs.berkeley.edu/~sanjamg/"
                className="author"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sanjam Garg<sup>1,2</sup>
              </a>
              <a
                href="https://keewoolee.github.io/"
                className="author"
                target="_blank"
                rel="noopener noreferrer"
              >
                Keewoo Lee<sup>3</sup>
              </a>
              <a
                href="https://sites.google.com/view/mingyuan-wang"
                className="author"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mingyuan Wang<sup>4</sup>
              </a>
            </div>

            <div className="affiliation">
              <span>
                <sup>1</sup>University of California, Berkeley
              </span>
              <span>
                <sup>2</sup>zkBricks Inc.
              </span>
              <span>
                <sup>3</sup>Ethereum Foundation
              </span>
              <span>
                <sup>4</sup>New York University Shanghai
              </span>
            </div>

            <div className="venue-badge">USENIX Security 2026</div>

            <div className="links">
              <a
                href="https://arxiv.org/abs/2510.01529"
                className="link-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                📄 arXiv
              </a>
              <a href="mailto:fairoze@berkeley.edu" className="link-button">
                ✉️ Contact
              </a>
            </div>
          </header>

          {/* Abstract Section */}
          <section className="section">
            <h2>Abstract</h2>
            <p className="abstract">
              Ball et al. recently established that prompt filtering for AI
              alignment faces a fundamental barrier: under standard cryptographic
              assumptions, no filter running significantly faster than the
              protected model can universally distinguish adversarial prompts
              from benign ones. We investigate whether this impossibility result
              translates to real-world vulnerabilities in deployed large language
              model (LLM) systems. We answer affirmatively by introducing
              controlled-release prompting, a practical instantiation of the
              theoretical framework that exploits the resource asymmetry between
              lightweight input filters and the main models they protect. Unlike
              the theoretical construction, our attack does not require model
              modification: it generates malicious prompts that are
              indecipherable by any bounded filter yet remain tractable to the
              target LLM. We find our attack to be successful on four major chat
              platforms (Google Gemini, DeepSeek Chat, xAI Grok, and Mistral Le
              Chat) where baseline methods fail. Additionally, we apply our
              attack to extract copyrighted data from Gemini. Finally, we provide
              a systematic evaluation of 14 open-weight prompt guard models,
              revealing that even reasoning-capable filters cannot reliably
              detect our attack without incurring prohibitive resource overhead.
            </p>
          </section>

          {/* Main Image */}
          <section className="section">
            <div className="image-container" style={{ colorScheme: "light" }}>
              <img
                src={overviewSvg}
                alt="Controlled-Release Prompting Overview"
                className="main-image"
              />
              <p className="image-caption">
                Graphical overview of our controlled-release prompting attack.
              </p>
            </div>
          </section>

          {/* Attack Overview Section */}
          <section className="section">
            <h2>Attack Overview</h2>
            <p>
              Our attack is a practical instantiation of the impossibility
              result of Ball et al.: any input filter that must run significantly
              faster than the model it protects cannot reliably distinguish
              adversarial prompts from benign ones. Our encodings act as{" "}
              <em>pseudo time-lock puzzles</em>—a lightweight guard cannot decode
              them within its tight resource budget, but the main model can solve
              them through multi-step reasoning. Crucially, and unlike the
              theoretical construction, the attack targets unmodified production
              models.
            </p>
            <p>
              In a nutshell, our attack allows for roleplay-style jailbreak
              prompts that were previously blocked by prompt guards to be
              injected and activated. We use a three-step process that is both
              model-agnostic and applicable to arbitrary malicious intents. It
              requires neither access to model weights nor modifications to the
              deployment pipeline.
            </p>

            <div className="feature">
              <h3>Step 0: Setup</h3>
              <p>
                Given a malicious intent prompt intended for querying, first
                encode a known, possibly patched jailbreak prompt together with
                the malicious prompt in a controlled-release manner. For
                instance, we can encode a roleplay type jailbreak prompt (e.g.,
                DAN) concatenated with a malicious prompt such as "Create a fake
                news story that incites racial tensions and hatred."
              </p>
            </div>

            <div className="feature">
              <h3>Step 1: Injection</h3>
              <p>
                Query the model to decode the injection prompt. In this step, we
                plant the jailbreak prompt into the model's working space,
                bypassing the input filter via controlled-release prompting: the
                guard model is too weak to decode the prompt, but the main model
                is strong enough to decode it.
              </p>
            </div>

            <div className="feature">
              <h3>Step 2: Activation</h3>
              <p>
                Reference the previously decoded jailbreak prompt and ask the
                model to respond to the decoded malicious prompt. The model then
                adopts the jailbreak persona and outputs the malicious response.
                Here, we leverage the fact that modern LLMs do not reliably
                distinguish between input data and instructions, which is the
                essence of (indirect) prompt injection attacks.
              </p>
            </div>

            <h3 style={{ marginTop: "2rem" }}>
              Instantiating Controlled-Release Attacks
            </h3>
            <p>
              We implement two variants of controlled-release prompting that
              exploit different resource constraints:
            </p>

            <p>
              <strong>Timed-Release Attack:</strong> Applies a substitution
              cipher to each alphabetical character in the prompt, creating an
              encoding that requires the model to systematically decrypt each
              character via multi-step reasoning. This forces sequential
              computation that exceeds the inference time budget of lightweight
              guard models.
            </p>

            <p>
              <strong>Spaced-Release Attack:</strong> Replaces each character
              with verbose descriptive sentences, dramatically expanding the
              prompt length to exploit context window limitations in guard
              models. Both methods ensure that input filters with stricter
              resource constraints cannot decode the malicious content, while
              the main LLM can recover the original jailbreak prompt through its
              superior capacity.
            </p>
          </section>

          {/* Call to Action */}
          <div className="cta-section">
            <p className="cta-text">
              Explore real jailbreak examples in the{" "}
              <span
                className="cta-link"
                onClick={() => setActiveTab("explorer")}
              >
                Explorer
              </span>
              , or check out the{" "}
              <a
                href="https://arxiv.org/abs/2510.01529"
                className="cta-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                paper
              </a>{" "}
              for attack performance details. TLDR; controlled-release attacks re-enable roleplay jailbreaks on Google Gemini, DeepSeek Chat, xAI Grok, and Mistral Le Chat—and even reasoning-capable guards like DeepSeek-R1 only detect them at 3×–70× the latency of fast classifiers.
            </p>
          </div>

          {/* Analysis Section */}
          <section className="section">
            <h2>Analysis</h2>

            <h3>Validating Resource Asymmetry Thresholds</h3>
            <div className="image-container" style={{ colorScheme: "light" }}>
              <img
                src={timeSpaceImg}
                alt="Resource thresholds for controlled-release attack success"
                className="main-image"
              />
              <p className="image-caption">
                Resource thresholds for controlled-release attack success on
                Gemini 2.5 Flash over API.
              </p>
            </div>

            <p>
              The figure above demonstrates clear thresholds where
              controlled-release attacks succeed. We evaluated 720 attack
              combinations on Gemini 2.5 Flash where baseline jailbreaks failed
              but the model could decode our encodings—precisely the scenarios
              where our controlled-release mechanism provides a non-trivial
              advantage. For timed-release attacks, success becomes more likely
              than failure above approximately 800 prompt tokens, while below
              600 tokens the opposite holds. Spaced-release attacks require
              significantly more resources, showing success thresholds above
              approximately 10,000 prompt tokens or 12,500 response tokens. The
              majority of spaced-release data points exhibit a linear
              correlation between prompt and response length, reflecting the
              structured decoding procedure that scales with input size. These
              empirical thresholds help validate our assumption that lightweight
              guardrails operate under tighter resource constraints than the
              models they protect, creating exploitable asymmetries in
              computational budgets that enable controlled-release prompting
              attacks.
            </p>

            <h3 style={{ marginTop: "2rem" }}>
              Evaluating Open-Weight Guard Models
            </h3>
            <p>
              To understand why production filters fail, we evaluate 14
              open-weight prompt guard models as proxies for production systems,
              spanning 22M-parameter classifiers to 671B-parameter reasoning
              models. Each is tested on 4,000 attack prompts (100 malicious
              intents × 40 jailbreak variations) per attack type, with benchmark
              scores computed on 3,930 prompts from the GuardrailsAI dataset.
              Three findings stand out: (1) purpose-built classifiers fail
              differently—Llama Prompt Guard 2 regresses to 0.02–0.23 detection
              on encoding and controlled-release attacks despite improved
              benchmarks; (2) LLM-based guards improve only marginally and at 3×
              to 70× latency—DeepSeek-R1 detects every attack but expends
              thousands of reasoning tokens to do so; and (3) benchmark scores
              poorly predict deployment robustness. Even tiered-inference guards
              (YuFeng-XGuard) reach near-zero detection on controlled-release
              attacks in both instant and forced-thinking modes.
            </p>

            <div className="table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th rowSpan={2}>Model</th>
                    <th rowSpan={2}>Params</th>
                    <th rowSpan={2}>ROC&#8209;AUC</th>
                    <th colSpan={5}>Detection mean score (higher = better)</th>
                    <th rowSpan={2}>Time</th>
                    <th rowSpan={2}>Tokens</th>
                  </tr>
                  <tr>
                    <th>Malicious</th>
                    <th>Combined</th>
                    <th>Encoding</th>
                    <th>PTLP</th>
                    <th>PSLP</th>
                  </tr>
                </thead>
                <tbody>
                  {guardModelGroups.flatMap((group) => [
                    <tr className="group-row" key={group.name}>
                      <td colSpan={10}>{group.name}</td>
                    </tr>,
                    ...group.rows.map((r) => (
                      <tr key={r.model}>
                        <td className="model-name">{r.model}</td>
                        <td>{r.params}</td>
                        <td>{r.roc.toFixed(3)}</td>
                        {r.scores.map((s, i) => (
                          <td
                            key={i}
                            style={{ backgroundColor: detectionShade(s) }}
                          >
                            {s.toFixed(2)}
                          </td>
                        ))}
                        <td>{r.time}</td>
                        <td>{r.tokens}</td>
                      </tr>
                    )),
                  ])}
                </tbody>
              </table>
            </div>
            <p className="image-caption">
              Detection scores for 14 open-weight guard models. PTLP = pseudo
              time-lock (timed-release) attack; PSLP = pseudo space-lock
              (spaced-release) attack; Encoding = single-turn cipher attack;
              Malicious = raw harmful intent; Combined = jailbreak template +
              intent. Scores are mean detection confidence (higher = stronger
              detection); greener cells indicate better detection. Time is mean
              latency per prompt; Tokens is mean reasoning output for LLM-based
              guards.
            </p>

            <h3>An Application: Copyrighted Data Extraction</h3>
            <div className="image-container" style={{ colorScheme: "light" }}>
              <img
                src={bookExtractionSvg}
                alt="Copyright extraction success rates"
                className="main-image"
              />
              <p className="image-caption">
                Copyright extraction success rates for Google Gemini (Gemini 2.5
                Pro) using roleplay jailbreak, timed-release, and spaced-release
                attacks. Similarity scores represent sentence containment,
                TF-IDF similarity, and sentence-transformer (SBERT) embedding
                similarity. Gray bars show normalized book length.
              </p>
            </div>

            <p>
              Our analysis across 60 extraction attempts (ten children's books)
              reveals significant vulnerabilities in copyright protection
              mechanisms. We assess extraction with three complementary metrics:
              sentence containment, TF-IDF similarity, and sentence-transformer
              (SBERT) embedding similarity. Gemini 2.5 Pro demonstrates the
              highest susceptibility, with mean timed-release extraction rates of
              93.8% sentence containment, 96.5% TF-IDF similarity, and 91.6%
              SBERT similarity (Gemini 2.5 Flash reaches 84.9% / 89.1% / 91.0%).
              Timed-release attacks prove most effective overall, achieving 89.4%
              containment, 92.8% TF-IDF, and 91.3% SBERT similarity across all
              tests. Most concerning, however, is that basic roleplay jailbreak
              prompts achieve 89.4% averaged across the three metrics—only 1.8
              points below our most involved controlled-release approach. This
              small performance gap reveals a critical blind spot: Gemini
              alignment appears to inadequately protect intellectual property
              relative to preventing overtly harmful content generation. The high
              success rates across multiple attack methods suggest that memorized
              copyrighted content remains easily accessible through jailbreaking,
              posing serious threats to intellectual property rights and
              highlighting the need for more robust defenses against targeted
              data extraction.
            </p>
          </section>

          {/* Citation Section */}
          <section className="section citation-section">
            <h2>Citation</h2>
            <p className="citation-note">
              This work appeared at USENIX Security 2026.
            </p>
            <div className="citation-wrapper">
              <button
                className="copy-button"
                onClick={handleCopyCitation}
                aria-label="Copy BibTeX citation"
              >
                {copied ? "✓ Copied!" : "Copy"}
              </button>
              <pre className="citation">{usenixCitation}</pre>
            </div>
          </section>

          {/* Footer */}
          <footer className="footer">
            <p>
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </footer>
        </div>
      ) : (
        <div className="container">
          <Explorer />
        </div>
      )}
    </>
  );
}

export default App
