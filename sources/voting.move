/// Simple Voting dApp - A shared Poll object where anyone can vote once on predefined options
/// Prevents double voting, emits events, and provides easy CLI usage.
module voting::voting {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::clock::{Self, Clock};
    use std::vector;
    use std::string::String;

    // Error codes
    const ETOO_FEW_OPTIONS: u64 = 1;
    const EDOUBLE_VOTE: u64 = 2;
    const EINVALID_OPTION_INDEX: u64 = 3;

    /// Poll struct that holds all voting data
    public struct Poll has key {
        id: UID,
        question: String,
        options: vector<String>,
        votes: vector<u64>,
        voters: vector<address>,
        creator: address,
        created_ms: u64,
    }

    /// Event emitted when a new poll is created
    public struct PollCreatedEvent has copy, drop {
        poll_id: address,
        creator: address,
        question: String,
        options: vector<String>,
    }

    /// Event emitted when someone votes
    public struct VotedEvent has copy, drop {
        poll_id: address,
        voter: address,
        option_index: u64,
        total_for_option: u64,
    }

    /// Create a new poll with a question and at least 2 options
    /// The poll is shared so anyone can vote on it
    public entry fun create_poll(
        question: String,
        options: vector<String>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Must have at least 2 options
        assert!(vector::length(&options) >= 2, ETOO_FEW_OPTIONS);

        let creator = tx_context::sender(ctx);
        let poll_id = object::new(ctx);
        let poll_address = object::uid_to_address(&poll_id);

        // Initialize votes vector with zeros for each option
        let votes = vector::empty<u64>();
        let i = 0;
        while (i < vector::length(&options)) {
            vector::push_back(&mut votes, 0);
            i = i + 1;
        };

        let poll = Poll {
            id: poll_id,
            question,
            options: options,
            votes,
            voters: vector::empty<address>(),
            creator,
            created_ms: clock::timestamp_ms(clock),
        };

        // Emit poll created event
        event::emit(PollCreatedEvent {
            poll_id: poll_address,
            creator,
            question: poll.question,
            options: poll.options,
        });

        // Share the poll so anyone can vote
        transfer::share_object(poll);
    }

    /// Vote on a poll by selecting an option index
    /// Prevents double voting from the same address
    public entry fun vote(
        poll: &mut Poll,
        option_index: u64,
        ctx: &mut TxContext
    ) {
        let voter = tx_context::sender(ctx);

        // Check if this address has already voted
        assert!(!has_voted(&poll.voters, voter), EDOUBLE_VOTE);

        // Check if option index is valid
        assert!(option_index < vector::length(&poll.options), EINVALID_OPTION_INDEX);

        // Record the voter
        vector::push_back(&mut poll.voters, voter);

        // Increment the vote count for the selected option
        let vote_count = vector::borrow_mut(&mut poll.votes, option_index);
        *vote_count = *vote_count + 1;

        // Emit voted event
        event::emit(VotedEvent {
            poll_id: object::uid_to_address(&poll.id),
            voter,
            option_index,
            total_for_option: *vote_count,
        });
    }

    /// Helper function to check if an address has already voted
    fun has_voted(voters: &vector<address>, who: address): bool {
        let i = 0;
        let len = vector::length(voters);
        while (i < len) {
            if (*vector::borrow(voters, i) == who) {
                return true
            };
            i = i + 1;
        };
        false
    }

    // === View Functions ===

    /// Get poll question
    public fun get_question(poll: &Poll): String {
        poll.question
    }

    /// Get poll options
    public fun get_options(poll: &Poll): vector<String> {
        poll.options
    }

    /// Get vote counts
    public fun get_votes(poll: &Poll): vector<u64> {
        poll.votes
    }

    /// Get total number of voters
    public fun get_voter_count(poll: &Poll): u64 {
        vector::length(&poll.voters)
    }

    /// Get poll creator
    public fun get_creator(poll: &Poll): address {
        poll.creator
    }

    /// Get creation timestamp
    public fun get_created_ms(poll: &Poll): u64 {
        poll.created_ms
    }

    /// Check if a specific address has voted
    public fun has_address_voted(poll: &Poll, addr: address): bool {
        has_voted(&poll.voters, addr)
    }
}