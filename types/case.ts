// ============================================================================
//  SUB-TYPES: These define the building blocks of our case.
// ============================================================================

/**
 * Represents a single character in the story, including suspects and the player.
 */
export type Character = {
	id: string; // Unique ID to internally reference this character (e.g., 'char-julian').
	name: string; // The character's full name (e.g., "Julian Croft").
	description: string; // A brief on their personality, appearance, and connection to the case.
};

/**
 * Represents the victim (if a person) or the target of the crime (if an object).
 */
export type VictimOrTarget = {
	name: string; // Name of the person or item (e.g., "Arthur Blackwood", "The Serpent's Eye Diamond").
	description: string; // Details about who they were or what it is.
};

/**
 * Represents a single piece of evidence that can be discovered.
 */
export type Evidence = {
	id: string; // Unique ID for the evidence (e.g., 'evidence-ink-stain').
	description: string; // What the evidence is (player-facing). E.g., "A faded letter", "A muddy bootprint".
	location: string; // Where or how the evidence is found (player-facing). E.g., "Under the victim's bed", "Eleanor Vance mentions it during questioning".
	significance: string; // The TRUE meaning of the evidence (AI-only). This is the secret the AI uses to evaluate the player's progress.
};

/**
 * Contains the secret solution to the mystery, structured for the AI.
 */
export type Solution = {
	culpritCharacterId: string; // The 'id' of the character who is the culprit.
	motive: string; // The reason WHY they committed the crime.
	method: string; // HOW they committed the crime.
};

// ============================================================================
//  MAIN TYPE: The complete structure for a single detective case.
// ============================================================================

export type DetectiveCase = {
	// --- Administrative Metadata (Auto-generated or system-set) ---
	id: string;
	authorId: string;
	createdAt: string;

	// --- Case Overview (Filled by user, can be AI-assisted) ---
	title: string; // "Název"
	theme: string; // "Téma" - e.g., "Noir", "Cozy Mystery", "Sci-Fi Crime".
	summary: string; // "Popisek" - A short, engaging summary for the case selection screen.

	// --- Core Narrative Setup ---
	setting: {
		location: string; // "místo" - e.g., "An express train to Prague".
		dateTime: string; // "čas" - ISO 8601 format is best: "1945-05-19T20:45:00Z".
		incident: string; // "Co se stalo" - The central crime. E.g., "A priceless diamond has been stolen from its secure case."
	};

	characters: {
		player: Character; // "Kdo je hráč"
		victimOrTarget: VictimOrTarget; // "Poškozenej / poškozená věc"
		suspects: Character[]; // "Kdo vše v příběhu je"
	};

	// --- Gameplay and Solution Logic ---
	evidence: Evidence[]; // "Důkazy"
	solution: Solution; // "kdo to udělal" + motive and method

	// --- Optional Context ---
	notesForAI?: string; // "Optional pole" - A place for the author to give the AI extra instructions or context.
};

export type DetectiveCaseBaseView = {
	id: string; // Unique case identifier (e.g. "case-orient-express-01")
	authorId: string; // ID of the user who created the case
	createdAt: Date;

	title: string; // Case title shown in library
	theme: string; // Category / genre (e.g. "train-mystery")
	summary: string; // Short case summary for previews

	location: string; // Where the crime happened
	dateTime: string; // When it happened (string stored in DB)
	incident: string; // Core description of what happened

	// --- Solution (not shown to player) ---
	culpritCharacterId: string; // Character ID of the culprit
	motive: string; // Why the culprit committed the crime
	method: string; // How the crime was executed

	notesForAI?: string | null; // Extra instructions for the AI (optional)
};

export type DetectiveCaseListItem = DetectiveCaseBaseView & {
	isSolvedForUser: boolean;
};
