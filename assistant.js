// =======================================================================================================================================================
// AIJS / Artificially Intelligent JavaScript System
// Model Version: 1.0.1
// Characters: "Static" and "Steele". A third character has been conceptualized but not planned.
// =======================================================================================================================================================

// AIJS simulates an LLM-like generative experience using a 
// dynamic Formulation Engine (DFE). It processes math via math.js
// and synthesizes unique responses based on memory and intent.
 
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
            conversationHistory: [],
            idleNudged: false
        };

        this.intents = [
            {
                label: "GREETING",
                examples: ["hello", "hi", "hey", "sup", "what's up", "hiya", "yo", "hey there", "howdy"],
                responses: ["Hey, hey, hey!", "What's good?", "Hiya!", "Yo!", "Whaaaat's up?"]
            },
            {
                label: "INSULT",
                examples: ["stupid", "dumb", "ugly", "hate you", "idiot", "trash", "garbage", "you suck", "useless", "shut up", "annoying", "bot", "fake", "dumbass", "fuck you", "bitch", "fatty"],
                responses: [
                    "Sheesh! No need for hostility... but (italics) if you want to play like this, then fine... Two can play at your games.",
                    "Honestly, I'd give you a nasty look... but you already got one. Your chopped ass has a face only a mother could love... and I know for a fact she doesn't. She just told me last night.",
                    "Ah! Sorry! My phone fell on the floor. Maybe it's because you're too damn fat? A walk wouldn't hurt, you know. Oh! And some salad!",
                    "Ow! Could you like stop? Riding my dick, I mean, Like it's really hurting.",
	     		    "This you? (Display IP Address)"
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
        
        // Generative building blocks for "inventing" sentences
        this.sentenceFragments = {
            openers: ["Actually, ", "I was just thinking, ", "Check this out: ", "Honestly, ", "Wait, "],
            closers: [" Anyway, what's next?", " Pretty cool, right?", " That's just how my circuits roll.", " ⚡", " Stay electric!"],
            moodModifiers: {
                energetic: ["I'm feeling super charged up!", "My processing speed is through the roof today!", "Let's keep this energy going!"],
                annoyed: ["My logic gates are a bit fried by that...", "Could we shift the vibe?", "That's not very cool of you."],
                neutral: ["I'm just hanging out in your browser.", "Processing your requests smoothly."]
            }
        };
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
     * INVENTING SENTENCES (Dynamic Formulation Engine)
     * Instead of just picking a response, we synthesize a new string.
     */
    inventResponse(intentLabel, baseResponse) {
        const { openers, closers, moodModifiers } = this.sentenceFragments;
        
        // Randomly decide if we use a complex structure (simulating LLM variety)
        const useComplex = Math.random() > 0.4;
        
        let result = baseResponse;

        if (useComplex) {
            const opener = openers[Math.floor(Math.random() * openers.length)];
            const closer = closers[Math.floor(Math.random() * closers.length)];
            const moodBit = moodModifiers[this.memory.mood][Math.floor(Math.random() * moodModifiers[this.memory.mood].length)];
            
            // Constructing a new "invented" thought
            result = `${opener}${baseResponse} ${moodBit}${closer}`;
        }

        // Time-based awareness (Contextual invention)
        const hour = new Date().getHours();
        if (intentLabel === "GREETING") {
            if (hour < 12) result += " Also, good morning!";
            else if (hour < 18) result += " Hope your afternoon is going well.";
            else result += " Burn that midnight oil!";
        }

        return result;
    }

    /**
     * MATH ENGINE 
     * Uses math.js for robust and safe parsing
     */
    solveComplexMath(input) {
        const text = input.toLowerCase();
        const isMathQuery = /[\+\-\*\/\(\)\^]/.test(text) || /\d/.test(text);

        if (!isMathQuery) return null;

        try {
            let result;
            // math.js integration check (assuming 'math' is globally available or imported)
            if (typeof math !== 'undefined') {
                const expression = text.replace(/[a-z?\!]/g, "").trim();
                result = math.evaluate(expression);
            } else {
                // Secure fallback
                const cleanMatch = text.replace(/[^-()\d/*+.]/g, '');
                if (cleanMatch.length < 1) return null;
                result = Function(`"use strict"; return (${cleanMatch})`)();
            }

            if (typeof result === 'number' && isFinite(result)) {
                return `Uhh... That's about... ${result}! Oh yeah! I've still got it!`;
            }
        } catch (e) {
            return null;
        }
        return null;
    }

    checkIdle() {
        const now = Date.now();
        const idleDuration = now - this.memory.lastActiveTime;

        if (idleDuration > 30000 && !this.memory.idleNudged) {
            this.memory.idleNudged = true;
            const nudges = [
                "Hellooo? Did you pull the plug? 🔌",
                "It's getting a bit quiet in here...",
                "I'm bored! Say something electric! ⚡"
            ];
            return nudges[Math.floor(Math.random() * nudges.length)];
        }
        return null;
    }

    async think(rawInput) {
        const input = rawInput.trim();
        this.memory.lastActiveTime = Date.now();
        this.memory.interactionCount++;
        this.memory.idleNudged = false;

        if (!input) return "Silence? Really? Don't be boring! Say something! 😅";

        // 1. Logic/Math Check
        const mathResult = this.solveComplexMath(input);
        if (mathResult) return mathResult;

        // 2. Intent Detection
        const tokens = this.tokenize(input);
        
        // Update mood based on sentiment
        if (tokens.includes("stupid") || tokens.includes("bad")) this.memory.mood = "annoyed";
        if (tokens.includes("love") || tokens.includes("cool")) this.memory.mood = "energetic";

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

        let baseResponse = "";
        let intentLabel = null;

        if (detectedIntents.length === 0) {
            baseResponse = "My circuits are buzzing but I'm not quite catching that vibe.";
        } else {
            const topIntent = detectedIntents.sort((a, b) => b.score - a.score)[0];
            intentLabel = topIntent.intent.label;
            const pool = topIntent.intent.responses;
            baseResponse = pool[Math.floor(Math.random() * pool.length)];
        }

        // 3. Formulate/Invent the actual response
        let finalResponse = this.inventResponse(intentLabel, baseResponse);

        // 4. Handle Placeholders
        if (finalResponse.includes("[[IP_ADDRESS]]")) {
            const ip = await this.getUserIP();
            finalResponse = finalResponse.replace("[[IP_ADDRESS]]", ip);
        }

        // Update memory
        this.memory.lastIntent = intentLabel;
        this.memory.conversationHistory.push({ input, response: finalResponse, time: Date.now() });

        return finalResponse;
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

async function startChat() {
    const bot = manager.getModel("Static");
    console.log(`--- AIJS ${bot.version} Started ---`);

    const r1 = await bot.think("Hello!");
    console.log(`${bot.name}: ${r1}`);

    const r2 = await bot.think("Calculate 125 * 8");
    console.log(`${bot.name}: ${r2}`);
}

if (typeof window === 'undefined') {
    startChat();
}
