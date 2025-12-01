/**
 * Represents a single character involved in the detective case.
 */
export type Character = {
	id: string; // A unique identifier, e.g., 'character-a'
	name: string; // Full name of the character, e.g., "Mr. Abraham Adams"
	description: string; // A brief description for context, e.g., "The quiet bartender with a hidden past."
};

/**
 * Represents the environment and time of the case.
 */
export type CaseSetting = {
	location: string; // A descriptive location, e.g., "The Salty Siren, a dimly lit pub in downtown New York"
	dateTime: string; // ISO 8601 date-time string for when the main event occurs, e.g., "2025-11-08T21:00:00Z"
	ambiance?: string; // Optional description for atmosphere, useful for generating ambiance or imagery, e.g., "A rainy night, the sound of a distant saxophone"
};

/**
 * Represents a key event or clue that players can uncover.
 */
export type KeyEvent = {
	id: string; // A unique identifier for the event
	description: string; // Detailed description of the event or clue, e.g., "Mr. A entered the pub and ordered a whiskey, looking nervous."
	isCrucial: boolean; // Marks if this event is critical for solving the case.
};

/**
 * The main type representing a complete detective case.
 * This object contains all information needed to run a game session.
 */
export type Case = {
	// --- Core Metadata ---
	id: string; // Unique identifier for the case (e.g., a UUID). Essential for database lookups.
	title: string; // The public title of the case, e.g., "The Case of the Salty Siren".
	authorId: string; // The ID of the user who created the case.
	summary: string; // A short, engaging summary displayed in the story library.
	createdAt: string; // ISO 8601 date-time string for when the case was created.
	updatedAt: string; // ISO 8601 date-time string for the last update.

	// --- Story & Gameplay Content ---
	backstory: string; // The initial narrative presented to the player to set the scene.
	setting: CaseSetting; // Structured information about the case's environment.
	characters: Character[]; // An array of characters involved in the story.
	keyEvents: KeyEvent[]; // An array of key events or clues that form the backbone of the investigation.

	// --- The Solution ---
	resolution: string; // The detailed "secret" solution to the mystery. This is the ground truth the AI uses to guide the player.
};
