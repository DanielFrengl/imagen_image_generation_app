// You can place this code directly into a Next.js project page, e.g., `app/page.tsx`
// Make sure to install the required dependencies:
// npm install lucide-react
"use client";
import React, { useState, useEffect } from "react";

// --- Helper Components & Icons ---

// Using lucide-react for icons. In a real project, you'd install this.
// For this self-contained example, we'll create simple SVG components.
type IconProps = React.SVGProps<SVGSVGElement>;

const SunIcon = (props: IconProps) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon = (props: IconProps) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const DownloadIcon = (props: IconProps) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const SparklesIcon = (props: IconProps) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

const ImageIcon = (props: IconProps) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

const Spinner = ({ className }: { className?: string }) => (
  <div
    className={`animate-spin rounded-full border-t-2 border-r-2 border-current ${
      className ?? ""
    }`}
  />
);

// --- Main Application Component ---

export default function Page() {
  const [theme, setTheme] = useState<string>("dark");
  const [prompt, setPrompt] = useState<string>("");
  const [aspectRatio, setAspectRatio] = useState<string>("1:1");
  const [imageCount, setImageCount] = useState<number>(4);
  const [generatedImages, setGeneratedImages] = useState<
    { bytesBase64Encoded: string }[]
  >([]);

  // Loading and Error States
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isAdvising, setIsAdvising] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- THEME CONTROL ---
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  // --- API LOGIC ---

  /**
   * Uses Gemini to enhance a user's simple prompt into a detailed one.
   */
  const handlePromptAdvice = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt to get advice.");
      return;
    }
    setIsAdvising(true);
    setError(null);
    try {
      const geminiSystemPrompt = `You are a creative assistant and an expert prompt engineer for a text-to-image AI model. Your task is to take a user's simple prompt and rewrite it into a much more detailed and vivid prompt. Focus on adding details about the subject, environment, lighting, artistic style, composition, and mood. The final output should be only the new prompt, without any other text, labels, or explanations.`;
      const chatHistory = [
        { role: "user", parts: [{ text: geminiSystemPrompt }] },
        {
          role: "model",
          parts: [
            {
              text: "Okay, I understand. I will take the user's prompt and enhance it. Please provide the prompt.",
            },
          ],
        },
        { role: "user", parts: [{ text: prompt }] },
      ];
      const payload = { contents: chatHistory };
      const apiKey = ""; // Environment provides this for Gemini
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

      const result = await response.json();
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        setPrompt(result.candidates[0].content.parts[0].text.trim());
      } else {
        setError("Failed to get advice from the API.");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("Prompt Advisor Error:", err);
      } else {
        setError("An unknown error occurred.");
        console.error("Prompt Advisor Error:", err);
      }
    } finally {
      setIsAdvising(false);
    }
  };
  /**
   * Generates images using the Imagen model based on the current state.
   */
  const handleImageGeneration = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt to generate images.");
      return;
    }
    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const payload = {
        instances: [{ prompt }],
        parameters: { sampleCount: imageCount, aspectRatio },
      };
      const apiKey = ""; // Environment provides this for stable Imagen models
      const model = "imagen-3.0-generate-002";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

      const result = await response.json();
      // Assuming the API returns an array of images in result.predictions[0].bytesBase64Encoded
      // or similar structure. Adjust as needed for your API response.
      if (
        result?.predictions &&
        Array.isArray(result.predictions[0]?.bytesBase64Encoded)
      ) {
        setGeneratedImages(
          result.predictions[0].bytesBase64Encoded.map((b64: string) => ({
            bytesBase64Encoded: b64,
          }))
        );
      } else if (result?.predictions && Array.isArray(result.predictions)) {
        // Fallback: if predictions is an array of objects with bytesBase64Encoded
        setGeneratedImages(
          result.predictions.map((img: any) => ({
            bytesBase64Encoded: img.bytesBase64Encoded,
          }))
        );
      } else {
        setError("Failed to generate images from the API.");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("Image Generation Error:", err);
      } else {
        setError("An unknown error occurred.");
        console.error("Image Generation Error:", err);
      }
    } finally {
      setIsGenerating(false);
    }
  };
  // --- RENDER ---
  return (
    <div
      className={`min-h-screen w-full font-sans transition-colors duration-300 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
    >
      <div className="container mx-auto p-4 lg:p-8">
        {/* Header and Theme Toggle */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white">
            AI Image Generator
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === "dark" ? (
              <SunIcon className="w-6 h-6" />
            ) : (
              <MoonIcon className="w-6 h-6" />
            )}
          </button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel (Left Side) */}
          <aside className="lg:col-span-1 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl shadow-sm flex flex-col">
            <div className="flex-grow space-y-6">
              {/* Prompt Input & Advisor */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="prompt" className="font-semibold">
                    Your Prompt
                  </label>
                  <button
                    onClick={handlePromptAdvice}
                    disabled={isAdvising}
                    className="flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition disabled:opacity-50 disabled:cursor-wait"
                  >
                    <SparklesIcon className="w-4 h-4 mr-1.5" />
                    {isAdvising ? "Advising..." : "Advise"}
                    {isAdvising && <Spinner className="w-4 h-4 ml-2" />}
                  </button>
                </div>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={8}
                  className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition"
                  placeholder="e.g., A photo of a raccoon wearing a tiny chef hat..."
                />
              </div>

              {/* Aspect Ratio Selector */}
              <div>
                <label
                  htmlFor="aspectRatio"
                  className="font-semibold mb-2 block"
                >
                  Aspect Ratio
                </label>
                <select
                  id="aspectRatio"
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition"
                >
                  <option value="1:1">Square (1:1)</option>
                  <option value="9:16">Portrait (9:16)</option>
                  <option value="16:9">Landscape (16:9)</option>
                </select>
              </div>

              {/* Image Count Selector */}
              <div>
                <label
                  htmlFor="imageCount"
                  className="font-semibold mb-2 block"
                >
                  Number of Images
                </label>
                <select
                  id="imageCount"
                  value={imageCount}
                  onChange={(e) => setImageCount(Number(e.target.value))}
                  className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition"
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleImageGeneration}
              disabled={isGenerating}
              className="mt-8 w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-wait flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <Spinner className="w-5 h-5 mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Generate
                </>
              )}
            </button>
            {!isGenerating && !error && generatedImages.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-xl font-semibold">
                  Your masterpieces appear here
                </h2>
                <p>Enter a prompt and click "Generate" to start.</p>
              </div>
            )}

            {!isGenerating && !error && generatedImages.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
                {generatedImages.map((imgData, index) => (
                  <div
                    key={index}
                    className="group relative rounded-lg overflow-hidden aspect-square"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`data:image/png;base64,${imgData.bytesBase64Encoded}`}
                      alt={`Generated image ${index + 1} for prompt: ${prompt}`}
                      className="w-full h-full object-cover"
                    />
                    <a
                      href={`data:image/png;base64,${imgData.bytesBase64Encoded}`}
                      download={`ai_image_${index + 1}.png`}
                      className="absolute bottom-3 right-3 p-2 bg-black bg-opacity-50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Download Image"
                    >
                      <DownloadIcon className="w-5 h-5" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </main>
      </div>
    </div>
  );
}
