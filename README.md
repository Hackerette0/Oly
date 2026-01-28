# ōly — AI-Powered Personal Beauty & Skincare Ecosystem

ōly is a luxury MERN-stack e-commerce platform that bridges the gap between traditional retail and personalized skincare through generative AI. Built as a proof-of-concept for a venture-building environment, it leverages the **Google Gemini 1.5 Flash** model to provide real-time skin analysis and color harmony consultation.

---

## 🌟 Unique Value Proposition (MVP Features)

While standard e-commerce focuses on transactions, ōly focuses on **Validation and Personalization**:

- **AI Beauty Assistant**: A natively integrated chatbot using RAG (Retrieval-Augmented Generation) to suggest products based on skin concerns.
- **Visual Skin Analysis**: Users can upload or capture photos for real-time analysis of skin texture, age estimation, and health insights.
- **Personal Color Harmony**: A 15-point diagnostic quiz combined with AI vision to determine a user's seasonal color palette (Winter, Spring, Summer, Autumn).
- **AI-Moderated Community Forum (The "Skin Journey")**:A real-time hub for users to share personal skincare transformations, fostering emotional connections in a social-driven market.
(e.g., *"80% of users with oily skin in high-humidity regions prefer tea tree formulations"*).

---

## 📸 Product Showcase

### 1. The Shopping Experience
An aesthetic, high-conversion interface featuring a curated selection of premium skincare.
![Shop Landing](https://github.com/Hackerette0/ecommerce--ly/blob/main/docs/images/Screenshot%202026-01-24%20232725.png) 
*Screenshot Reference: Product Grid with 'Best for Oily Skin' filters.*

### 2. Conversational AI & Image Review
The "ōly Beauty Assistant" in action, reviewing a user's skin photo and providing a tailored wellness routine.
![AI Chatbot](https://github.com/Hackerette0/ecommerce--ly/blob/main/docs/images/Screenshot%202026-01-24%20232909.png)
*Screenshot Reference: "Based on the photo, this skin appears to be in its mid-s..."*

### 3. Personal Color Verdict
The unique feature that identifies the user's "Natural Glow" using seasonal color theory.
![Color Analysis](https://github.com/Hackerette0/ecommerce--ly/blob/main/docs/images/Screenshot%202026-01-24%20232744.png)
*Screenshot Reference: The Vivid Winter Palette with hex-code swatches.*

### 4. Advanced User Profile Studio
A luxury-app feel for account management, including dynamic profile picture updates and order tracking.
![Profile Card](https://github.com/Hackerette0/ecommerce--ly/blob/main/docs/images/Screenshot%202026-01-24%20232655.png)
*Screenshot Reference: Centered Profile Card with India-based contact details.*

---

## 🛠 Technical Stack

- **Frontend**: React.js, Tailwind CSS (Custom Luxury Theme), Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (User profiles, product catalogs, and order history).
- **AI Engine**: Google Gemini 1.5 Flash via OpenRouter API.
- **State Management**: React Hooks (useRef, useState, useEffect) & Axios for API orchestration.

---

## 🚀 Venture-Building Potential (For VentureCube)

This project aligns with the VentureCube internship framework:
- **Scalability**: The AI analysis engine can be scaled into a standalone B2B SaaS for other beauty retailers.
- **Tech Innovation**: Implementation of ML-driven age detection and computer vision in a consumer-facing app.
- **Market Entry**: Solves the "paradox of choice" in skincare by providing data-backed recommendations.

---

## 🏗 Setup & Installation

1. Clone the repository.
2. Run `npm install` in both `root` and `frontend` folders.
3. Create a `.env` file with your `OPENROUTER_API_KEY` and `MONGO_URI`.
4. Run `npm start`.
