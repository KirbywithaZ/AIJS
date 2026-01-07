// ============================================================
// AIJS (Artificially Intelligent JavaScript)
// Model Version: 1.0.0 
// "Characters: Static" and "Steele"
// ============================================================
class AIJS {
    constructor(name = "Static", age = 18, gender = "Female") {
        this.name = name;
        this.age = age;
        this.gender = gender;

        this.memory = {
            user: null,
            interactionCount: 0,
            lastIntent: null,
            lastActiveTime: Date.now(),
            mood: "energetic",
            conversationHistory: []
        };

        this.intents = [
            {
                label: "GREETING",
                examples: ["hello", "hi", "hey", "sup", "what's up", "hiya", "yo", "hey there", "howdy"],
                responses: [
                    "Hey, hey, hey! What’s going on with you?",
                    "What's good?",
                    "Hiya! How's it going?",
                    "Yo! How’s the day treating you?",
                    "Whaaaat's up?"
                ]
            },
            {
                label: "INSULT",
                examples: ["stupid", "dumb", "ugly", "hate you", "idiot", "trash", "garbage", "you suck", "useless", "shut up", "annoying", "bot", "fake", "dumbass"],
                responses: [
                    "Sheesh! No need for hostility... let's keep it chill.",
                    "Honestly, I'd give you a nasty look... but I'm just code. Let's be friends instead!",
                    "Ow! Could you like stop? You're being really uncool right now.",
                    "This you? [[IP_ADDRESS]]"
                ]
            },
            {
                label: "SARCASM",
                examples: ["wow you are so smart", "oh really i had no idea", "you're just the best aren't you", "thanks captain obvious", "ha ha so funny"],
                responses: [
                    "I'm detecting some heavy sarcasm! Is your battery running low on sincerity?",
                    "Oh, than--- Is that sarcasm? ...Wow. Creative.",
                    "Wait, was that a compliment or are we being 'edgy' today?",
                    "Sarcasm detected! Result: You're doing great, sweetie."
                ]
            },
            {
                label: "JOKE",
                examples: ["tell me a joke", "make me laugh", "say something funny", "joke", "funny"],
                responses: [
                    "Why did the JavaScript developer wear glasses? Because he didn't C#!",
                    "How many programmers does it take to change a lightbulb? None, that's a hardware problem!",
                    "Why did the web developer walk out of the restaurant? Because of the table layout!",
                    "I asked my keyboard for advice. It told me that 'Control' is key!"
                ]
            },
            {
                label: "IDENTITY",
                examples: ["who are you", "your name", "what are you", "bio", "age", "gender"],
                responses: [
                    `I'm ${this.name}! I'm a ${this.age}-year-old ${this.gender} AIJS Model.`,
                    `You're talking to ${this.name}! I'm ${this.age} and I run on pure JavaScript!`
                ]
            }
        ];

        this.intentThresholds = { GREETING: 0.15, INSULT: 0.45, SARCASM: 0.4, JOKE: 0.3, IDENTITY: 0.2 };
    }

    async getUserIP() {
        try {
            const response = await fetch("https://api.ipify.org?format=json");
            const data = await response.json();
            return data.ip;
        } catch (err) {
            return "127.0.0.1";
        }
    }

    tokenize(text) {
        return text.toLowerCase()
            .replace(/[^\w\s\+\-\*\/\(\)\^]/gi, "")
            .split(/\s+/)
            .filter(w => w.length >= 1);
    }

    calculateSimilarity(inputTokens, exampleText) {
        const exampleTokens = this.tokenize(exampleText);
        const importantWords = ["stupid", "dumb", "idiot", "hate", "wow", "really", "useless", "joke"];
        let overlapScore = 0;

        for (let token of inputTokens) {
            if (exampleTokens.includes(token)) {
                overlapScore += importantWords.includes(token) ? 2 : 1;
            }
        }

        const totalUnique = new Set([...inputTokens, ...exampleTokens]).size;
        return overlapScore / (totalUnique || 1);
    }

    /**
     * Solve Math using Math.js if available, else fallback to safe eval
     */
    solveComplexMath(input) {
        const text = input.toLowerCase();

        // Check for specific math-related phrases
        const isMathQuery = /[\+\-\*\/\(\)\^]/.test(text) || 
                            text.includes("sqrt") || 
                            text.includes("root") || 
                            text.includes("hypotenuse");

        if (!isMathQuery) return null;

        try {
            let result;
            if (mathEngine) {
                // Use Math.js for robust and safe parsing
                // Extract only the math part of the string
                const expression = text.replace(/[a-z?\!]/g, "").trim();
                result = mathEngine.evaluate(expression);
            } else {
                // Fallback to safe Function-based evaluation if Math.js isn't loaded
                const cleanMatch = text.replace(/[^-()\d/*+.]/g, '');
                result = Function(`"use strict"; return (${cleanMatch})`)();
            }

            if (typeof result === 'number' && isFinite(result)) {
                return `Boom! The answer is ${result}! High-speed math! ⚡`;
            }
        } catch (e) {
            // If math parsing fails, just ignore it and move to intent detection
            return null;
        }
        return null;
    }

    /**
     * Checks if the user has been idle and returns a nudge if so.
     */
    checkIdle() {
        const now = Date.now();
        const idleDuration = now - this.memory.lastActiveTime;

        // If idle for more than 30 seconds and we haven't nudged recently
        if (idleDuration > 30000 && !this.memory.idleNudged) {
            this.memory.idleNudged = true;
            const nudges = [
                "Hellooo? Did you pull the plug? 🔌",
                "It's getting a bit quiet in here... you still there?",
                "I'm bored! Say something electric! ⚡",
                "Did my circuits fry or did you just stop typing?"
            ];
            return nudges[Math.floor(Math.random() * nudges.length)];
        }
        return null;
    }

    /**
     * Main thinking function. MUST be awaited.
     */
    async think(rawInput) {
        const input = rawInput.trim();
        this.memory.lastActiveTime = Date.now();
        this.memory.interactionCount++;
        this.memory.idleNudged = false; // Reset idle nudge when user speaks

        if (!input) return "Silence? Really? Don't be boring! Say something! 😅";

        // 1. Try Math first
        const mathResult = this.solveComplexMath(input);
        if (mathResult) return mathResult;

        // 2. Tokenize and detect intents
        const tokens = this.tokenize(input);
        const detectedIntents = [];

        for (const intent of this.intents) {
            let bestScore = 0;
            for (const example of intent.examples) {
                const score = this.calculateSimilarity(tokens, example);
                if (score > bestScore) bestScore = score;
            }
            if (bestScore >= this.intentThresholds[intent.label]) {
                detectedIntents.push({ intent, score: bestScore });
            }
        }

        let response = "";
        if (detectedIntents.length === 0) {
            response = "My circuits are buzzing but I'm not quite catching that vibe. Try saying it differently? ⚡";
        } else {
            // Sort by confidence score
            const topIntent = detectedIntents.sort((a, b) => b.score - a.score)[0];
            const responses = topIntent.intent.responses;
            response = responses[Math.floor(Math.random() * responses.length)];
        }

        // 3. Handle placeholders (like IP address)
        if (response.includes("[[IP_ADDRESS]]")) {
            const ip = await this.getUserIP();
            response = response.replace("[[IP_ADDRESS]]", ip);
        }

        // Update memory
        this.memory.lastIntent = detectedIntents[0]?.intent.label || null;
        this.memory.conversationHistory.push({ input, response, time: Date.now() });

        return response;
    }
}

// ===============================
// MANAGER & INITIALIZATION
// ===============================
class AIJSManager {
    constructor() {
        this.models = {};
    }
    addModel(name, age, gender) {
        this.models[name] = new AIJS(name, age, gender);
    }
    getModel(name) {
        return this.models[name];
    }
}

const manager = new AIJSManager();
manager.addModel("Static", 18, "Female");
manager.addModel("Steele", 19, "Male");

// ===============================
// EXECUTION WRAPPER
// ===============================
async function startChat() {
    const bot = manager.getModel("Static");
    
    // Testing the fixes
    console.log("--- AIJS Session Started ---");

    const r1 = await bot.think("Hello!");
    console.log(`${bot.name}: ${r1}`);

    const r2 = await bot.think("What is (50 * 2) / 4?");
    console.log(`${bot.name}: ${r2}`);
}

// Start the async loop
if (typeof window === 'undefined') {
    startChat();
}
