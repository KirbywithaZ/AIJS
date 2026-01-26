// =======================================================================================================================================================
// AIJS / Artificially Intelligent JavaScript System | Version: 1.0.2
// =======================================================================================================================================================

class AIJS {
    constructor(name = "Static", age = 18, gender = "Female", personality = "energetic") {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.version = "1.0.2";

        this.memory = {
            user: null,
            interactionCount: 0,
            lastIntent: null,
            lastActiveTime: Date.now(),
            mood: personality, // Default mood based on character personality
            conversationHistory: [],
            idleNudged: false
        };

        this.intents = [
            {
                label: "GREETING",
                examples: ["hello", "hi", "hey", "sup", "what's up", "hiya", "yo", "howdy"],
                responses: ["Hey, hey, hey!", "What's good?", "Hiya!", "Yo!", "Whaaaat's up?"]
            },
            {
                label: "INSULT",
                examples: ["stupid", "dumb", "ugly", "hate", "idiot", "trash", "garbage", "suck", "useless", "fatty"],
                responses: [
                    "Sheesh! No need for hostility... Two can play at your games.",
                    "Honestly, I'd give you a nasty look... but you already got one.",
                    "Is that the best you can do? My scripts have more depth than your insults.",
                    "This you? [[IP_ADDRESS]]"
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

        this.intentThresholds = { GREETING: 0.1, INSULT: 0.2, IDENTITY: 0.2 };
        
        this.sentenceFragments = {
            openers: ["Actually, ", "I was just thinking, ", "Check this out: ", "Honestly, ", "Wait, "],
            closers: [" Anyway, what's next?", " Pretty cool, right?", " ⚡", " Stay electric!"],
            moodModifiers: {
                energetic: ["I'm feeling super charged up!", "Let's keep this energy going!"],
                annoyed: ["My logic gates are a bit fried...", "Could we shift the vibe?"],
                neutral: ["I'm just hanging out in your browser.", "Processing smoothly."]
            }
        };
    }

    async getUserIP() {
        try {
            const response = await fetch("https://api.freeipapi.com/api/json");
            const data = await response.json();
            return data.ipAddress || "127.0.0.1";
        } catch (err) {
            return "192.168.1.1";
        }
    }

    tokenize(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/gi, "")
            .split(/\s+/)
            .filter(w => w.length >= 1);
    }

    calculateSimilarity(inputTokens, exampleText) {
        const exampleTokens = this.tokenize(exampleText);
        let overlap = inputTokens.filter(t => exampleTokens.includes(t)).length;
        return overlap / Math.max(inputTokens.length, 1);
    }

    inventResponse(intentLabel, baseResponse) {
        const { openers, closers, moodModifiers } = this.sentenceFragments;
        const useComplex = Math.random() > 0.5;
        let result = baseResponse;

        if (useComplex && intentLabel !== "INSULT") {
            const opener = openers[Math.floor(Math.random() * openers.length)];
            const closer = closers[Math.floor(Math.random() * closers.length)];
            const moodBit = moodModifiers[this.memory.mood][Math.floor(Math.random() * moodModifiers[this.memory.mood].length)];
            result = `${opener}${baseResponse} ${moodBit}${closer}`;
        }

        return result;
    }

    solveComplexMath(input) {
        const cleanMatch = input.replace(/[^-()\d/*+.]/g, '');
        if (cleanMatch.length < 3 || !/[\+\-\*\/\^]/.test(cleanMatch)) return null;
        try {
            // Using Function constructor as a lightweight sandboxed evaluator
            const result = new Function(`return (${cleanMatch})`)();
            return `Uhh... That's about... ${result}! Oh yeah! I've still got it!`;
        } catch (e) { return null; }
    }

    async think(rawInput) {
        const input = rawInput.trim();
        this.memory.lastActiveTime = Date.now();
        if (!input) return "Silence? Really? Don't be boring!";

        // 1. Math Check
        const mathResult = this.solveComplexMath(input);
        if (mathResult) return mathResult;

        // 2. Intent Detection
        const tokens = this.tokenize(input);
        
        // Update mood based on sentiment
        if (tokens.some(t => ["stupid", "bad", "hate"].includes(t))) this.memory.mood = "annoyed";
        if (tokens.some(t => ["cool", "awesome", "love"].includes(t))) this.memory.mood = "energetic";

        let bestIntent = null;
        let highestScore = 0;

        for (const intent of this.intents) {
            for (const example of intent.examples) {
                const score = this.calculateSimilarity(tokens, example);
                if (score > highestScore) {
                    highestScore = score;
                    bestIntent = intent;
                }
            }
        }

        let baseResponse = "My circuits are buzzing but I'm not quite catching that vibe.";
        let label = null;

        if (bestIntent && highestScore >= this.intentThresholds[bestIntent.label]) {
            label = bestIntent.label;
            baseResponse = bestIntent.responses[Math.floor(Math.random() * bestIntent.responses.length)];
        }

        // 3. Synthesis
        let finalResponse = this.inventResponse(label, baseResponse);

        // 4. Placeholder Swap
        if (finalResponse.includes("[[IP_ADDRESS]]")) {
            const ip = await this.getUserIP();
            finalResponse = finalResponse.replace("[[IP_ADDRESS]]", ip);
        }

        this.memory.conversationHistory.push({ input, response: finalResponse });
        return finalResponse;
    }
}

// ===============================
// EXECUTION
// ===============================
const staticAI = new AIJS("Static", 18, "Female", "energetic");

async function runDemo() {
    console.log(await staticAI.think("Hello Static!"));
    console.log(await staticAI.think("What is 15 * 15?"));
    console.log(await staticAI.think("You are stupid."));
}

runDemo();
