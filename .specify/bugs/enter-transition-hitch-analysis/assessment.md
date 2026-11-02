# Bug Assessment: Enter Button Click Transition Hitching & Abrupt Snap Analysis

- **Slug**: enter-transition-hitch-analysis
- **Created**: 2026-11-02T18:55:00+06:00
- **Source**: User Bengali prompt ("এন্টার ক্লিক করার পর হুট করে বাইজা যায় কেন? বাইজা গিয়া একসাথে ঢুকা যায় ধপ কইরা।")
- **Verdict**: valid
- **Severity**: high

## Report (verbatim or summarized)
The user observed:
"আচ্ছা, শোনো, আমার লিঙ্কে ক্লিক করার পর প্রথম যে পেজটা আছে, এন্টার পেজ, তো এই পেজে এন্টার ক্লিক করার পর হুট করে বাইজা যায় কেন? বাইজা গিয়া একসাথে ঢুকা যায় ধপ কইরা। এই বাজার যে সমস্যা, এই সমস্যাটার কারণ কী? উৎক্ষেপণ করে কারণটা খুঁজে বের করে আমাকে জানাও।"

Symptom:
Upon clicking "ENTER IN THE EXPERIENCE", instead of a seamless 60 FPS cinematic transition into the 3D scene, the browser momentarily freezes / hitches ("বাইজা যায়" / frame drops to 0–12 FPS) for 300ms–800ms, and then suddenly snaps / jumps into the scene abruptly ("ধপ করে একসাথে ঢোকা").

## Concrete Profiling Evidence (CDP Throttled Trace)
Benchmarked locally on Chromium with 4x mobile CPU throttling:
- 0ms to 700ms right after Enter click contains 6 distinct long frames (> 50ms):
  - +79ms: Frame duration 100ms (Severe main thread freeze)
  - +163ms: Frame duration 83ms (Dropped frame)
  - +229ms: Frame duration 67ms (Dropped frame)
  - +379ms: Frame duration 67ms (Dropped frame)
  - +463ms: Frame duration 83ms (Dropped frame)
  - +696ms: Frame duration 100ms (Dropped frame)

## Root Cause Analysis (৪টি প্রধান কারণ)

### ১. ভিজ্যুয়াল কাউন্টার বনাম আসল GPU শেডার কম্পাইলেশন মিসম্যাচ (Shader Compilation Jitter)
- কোড পাথ: `cloned_site/_next/static/chunks/3-0-2h2vnc5wo.js` এবং `2vs2yctr590c-.js`
- কারণ: সাইটের 3D ইঞ্জিন (Three.js/WebGPU/WebGL) ব্যাকগ্রাউন্ডে জটিল শেডার্স (Volumetric fog, Water glow, 8192 particle compute simulation, Displacement normal maps) কম্পাইল করে।
- লোডিং বার যখন কৃত্রিমভাবে দ্রুত ১.২–১.৪ সেকেন্ডে ১০০% এ পৌঁছে Gate শো করে, তখন GPU ব্যাকগ্রাউন্ডে পুরো রেন্ডার গ্রাফ ও শেডার কম্পাইলেশন শেষ করতে পারে না।
- ইউজার এন্টারে ক্লিক করার সাথে সাথে ব্রাউজার "First Draw" করতে বাধ্য হয়। ব্রাউজারের মেইন থ্রেডে `gl.compileShader`, `gl.linkProgram` ও `createRenderPipeline` এক্সিকিউট হওয়ায় মেইন থ্রেড সিনক্রোনাসলি ১–২টি ফ্রেম ব্লক হয়ে যায়। ফলে স্ক্রিন কিছুক্ষণের জন্য "আটকে বা বেজে যায়"।

### ২. GSAP ক্যামেরা টাইমলাইনে ফ্রেমে-ফ্রেমে Projection Matrix রিক্যালকুলেশন
- কোড পাথ: `cloned_site/_next/static/chunks/1361kj0d795e7.js:6550-6600`
- কারণ: এন্টার ক্লিকে ক্যামেরা FOV পরিবর্তন হয় (`extra: 11` থেকে `extra: 0`, duration 2.85s)। প্রতি ফ্রেমে `onUpdate: () => { e.fov = (0,D.T)(e.aspect) + t.extra; e.updateProjectionMatrix(); }` কল হয়।
- শেডার ড্রপ ও হেভি জ্যামিতির মাঝে প্রতি ফ্রেমে প্রজেকশন ম্যাট্রিক্স রিক্যালকুলেট হওয়ায় ফ্রেম রেট ৬০ FPS থেকে নিচে নেমে যায়।
- যখন ব্রাউজার আটকে গিয়ে ৭০০ মিলিসেকেন্ড পর আনফ্রিজ হয়, তখন GSAP জমে থাকা সময় এক লাফে কভার করে—ফলে ইউজার মনে করে ক্যামেরা স্মুথলি না এসে "ধপ করে ড্রপ" করল।

### ৩. প্রতি ১৫০ মিলিসেকেন্ড অন্তর স্তরে স্তরে ইউনিফর্ম টুইন শুরু হওয়া (Cascading Timeline Tweens)
- কোড পাথ: `cloned_site/_next/static/chunks/1361kj0d795e7.js`
- কারণ: এন্টার ক্লিকের পর GSAP টাইমলাইন একসাথে না চালিয়ে staggered সময় অনুযায়ী চালায়:
  - t = 0ms: Fog Density + Camera Drift + Directional Light + Camera FOV
  - t = 150ms: Spot Light Intensity + Spot Light Angle
  - t = 300ms: Water Glow Intensity + Water Glow Radius
  - t = 450ms: Volumetric Fog Opacity + Emissive Boost
  - t = 600ms: Depth Uniforms
- প্রতি ১৫০ms পর পর নতুন একটি ভারী GPU ইউনিফর্ম অ্যানিমেশন শুরু হওয়ায় জিপিইউতে ধারাবাহিক মাইক্রো-স্টাটার তৈরি হয় (আমাদের টেস্টে +79ms, +163ms, +379ms, +463ms, +696ms এ এই কারণেই ফ্রেম ড্রপ পাওয়া গেছে)।

### ৪. ওয়েব অডিও কনটেক্সট রেজ্যুম ল্যাটেন্সি (AudioContext Resume Lock)
- কোড পাথ: `cloned_site/custom-enhancements.js:1178-1188` এবং `cloned_site/_next/static/chunks/3-0-2h2vnc5wo.js`
- কারণ: মোবাইল ও ব্রাউজার সিকিউরিটি পলিসির কারণে এন্টার বাটনে ক্লিক করার ঠিক মুহূর্তেই `AudioContext.resume()` কল করে অ্যাম্বিয়েন্ট ও এন্ট্রান্স সাউন্ড ডিকোড ও প্লে করা হয়। কোনো কোনো ডিভাইসে অডিও থ্রেড ইনিশিয়ালাইজেশনের সময় মেইন ইউআই থ্রেড ১০০–১৫০ms লেটেন্সি অনুভব করে।

## Proposed Remediation (ভবিষ্যতে সমাধানের উপায়)
১. **শেডার ওয়ার্মআপ ক্যাশিং ও প্রাক-কম্পাইলেশন**: এন্টার বাটনে ক্লিক করার আগেই ব্যাকগ্রাউন্ডে ল্যান্ডিং শেডার্স প্রি-ওয়ার্ম করা।
২. **ক্যামেরা FOV টুইন অপটিমাইজেশন**: প্রতি ফ্রেমে ভারী প্রজেকশন ম্যাট্রিক্সের বদলে লিনিয়ার বা কাস্টম স্মুথ লার্প ব্যবহার।
৩. **Staggered Uniforms কমপ্যাকশন**: প্রতি ১৫০ms এ আলাদা আলাদা টুইন শুরু না করে কম্বাইন্ড টাইমলাইনে স্মুথ পাওয়ার-ইজিং ব্যবহার করা।
৪. **CSS অপাসিটি ফেড-আউট সিঙ্ক**: গেট কন্টেইনারের ফেইড-আউটের সাথে ক্যামেরা মোশনের টাইমিং পারফেক্টলি লক করা।
