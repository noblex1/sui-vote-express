#[test_only]
module voting::voting_tests {
    use voting::voting::{Self, Poll};
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::clock::{Self, Clock};
    use std::vector;
    use std::string;

    const ADMIN: address = @0xABBA;
    const USER1: address = @0xB0B;
    const USER2: address = @0xCAB;

    fun setup_test(): (Scenario, Clock) {
        let scenario = ts::begin(ADMIN);
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        clock::set_for_testing(&mut clock, 1000000); // Set timestamp to 1000000ms
        (scenario, clock)
    }

    #[test]
    fun test_create_poll_success() {
        let (mut scenario, clock) = setup_test();
        
        ts::next_tx(&mut scenario, ADMIN);
        {
            let question = string::utf8(b"What's the best programming language?");
            let mut options = vector::empty<string::String>();
            vector::push_back(&mut options, string::utf8(b"Move"));
            vector::push_back(&mut options, string::utf8(b"Rust"));
            vector::push_back(&mut options, string::utf8(b"TypeScript"));

            voting::create_poll(question, options, &clock, ts::ctx(&mut scenario));
        };

        ts::next_tx(&mut scenario, USER1);
        {
            // Check that poll was created and shared
            let poll = ts::take_shared<Poll>(&scenario);
            
            assert!(voting::get_question(&poll) == string::utf8(b"What's the best programming language?"), 0);
            assert!(vector::length(&voting::get_options(&poll)) == 3, 1);
            assert!(vector::length(&voting::get_votes(&poll)) == 3, 2);
            assert!(voting::get_voter_count(&poll) == 0, 3);
            assert!(voting::get_creator(&poll) == ADMIN, 4);
            assert!(voting::get_created_ms(&poll) == 1000000, 5);

            ts::return_shared(poll);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 1)]
    fun test_create_poll_too_few_options() {
        let (mut scenario, clock) = setup_test();
        
        ts::next_tx(&mut scenario, ADMIN);
        {
            let question = string::utf8(b"Bad poll?");
            let mut options = vector::empty<string::String>();
            vector::push_back(&mut options, string::utf8(b"Only one option"));

            // Should abort with ETOO_FEW_OPTIONS (code 1)
            voting::create_poll(question, options, &clock, ts::ctx(&mut scenario));
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_vote_success() {
        let (mut scenario, clock) = setup_test();
        
        // Create poll
        ts::next_tx(&mut scenario, ADMIN);
        {
            let question = string::utf8(b"What's the best language?");
            let mut options = vector::empty<string::String>();
            vector::push_back(&mut options, string::utf8(b"Move"));
            vector::push_back(&mut options, string::utf8(b"Rust"));

            voting::create_poll(question, options, &clock, ts::ctx(&mut scenario));
        };

        // Vote from USER1
        ts::next_tx(&mut scenario, USER1);
        {
            let mut poll = ts::take_shared<Poll>(&scenario);
            
            voting::vote(&mut poll, 0, ts::ctx(&mut scenario)); // Vote for "Move"
            
            let votes = voting::get_votes(&poll);
            assert!(*vector::borrow(&votes, 0) == 1, 0); // Move should have 1 vote
            assert!(*vector::borrow(&votes, 1) == 0, 1); // Rust should have 0 votes
            assert!(voting::get_voter_count(&poll) == 1, 2);
            assert!(voting::has_address_voted(&poll, USER1), 3);

            ts::return_shared(poll);
        };

        // Vote from USER2
        ts::next_tx(&mut scenario, USER2);
        {
            let mut poll = ts::take_shared<Poll>(&scenario);
            
            voting::vote(&mut poll, 1, ts::ctx(&mut scenario)); // Vote for "Rust"
            
            let votes = voting::get_votes(&poll);
            assert!(*vector::borrow(&votes, 0) == 1, 4); // Move should still have 1 vote
            assert!(*vector::borrow(&votes, 1) == 1, 5); // Rust should now have 1 vote
            assert!(voting::get_voter_count(&poll) == 2, 6);
            assert!(voting::has_address_voted(&poll, USER2), 7);

            ts::return_shared(poll);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 2)]
    fun test_vote_double_vote() {
        let (mut scenario, clock) = setup_test();
        
        // Create poll
        ts::next_tx(&mut scenario, ADMIN);
        {
            let question = string::utf8(b"Test poll");
            let mut options = vector::empty<string::String>();
            vector::push_back(&mut options, string::utf8(b"Option A"));
            vector::push_back(&mut options, string::utf8(b"Option B"));

            voting::create_poll(question, options, &clock, ts::ctx(&mut scenario));
        };

        // First vote from USER1
        ts::next_tx(&mut scenario, USER1);
        {
            let mut poll = ts::take_shared<Poll>(&scenario);
            voting::vote(&mut poll, 0, ts::ctx(&mut scenario));
            ts::return_shared(poll);
        };

        // Second vote from USER1 - should abort with EDOUBLE_VOTE (code 2)
        ts::next_tx(&mut scenario, USER1);
        {
            let mut poll = ts::take_shared<Poll>(&scenario);
            voting::vote(&mut poll, 1, ts::ctx(&mut scenario));
            ts::return_shared(poll);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 3)]
    fun test_vote_invalid_option_index() {
        let (mut scenario, clock) = setup_test();
        
        // Create poll
        ts::next_tx(&mut scenario, ADMIN);
        {
            let question = string::utf8(b"Test poll");
            let mut options = vector::empty<string::String>();
            vector::push_back(&mut options, string::utf8(b"Option A"));
            vector::push_back(&mut options, string::utf8(b"Option B"));

            voting::create_poll(question, options, &clock, ts::ctx(&mut scenario));
        };

        // Vote with invalid index
        ts::next_tx(&mut scenario, USER1);
        {
            let mut poll = ts::take_shared<Poll>(&scenario);
            // Should abort with EINVALID_OPTION_INDEX (code 3) - index 5 doesn't exist
            voting::vote(&mut poll, 5, ts::ctx(&mut scenario));
            ts::return_shared(poll);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_multiple_votes_different_users() {
        let (mut scenario, clock) = setup_test();
        
        // Create poll
        ts::next_tx(&mut scenario, ADMIN);
        {
            let question = string::utf8(b"Multiple votes test");
            let mut options = vector::empty<string::String>();
            vector::push_back(&mut options, string::utf8(b"A"));
            vector::push_back(&mut options, string::utf8(b"B"));
            vector::push_back(&mut options, string::utf8(b"C"));

            voting::create_poll(question, options, &clock, ts::ctx(&mut scenario));
        };

        // Multiple users vote for option 0
        ts::next_tx(&mut scenario, USER1);
        {
            let mut poll = ts::take_shared<Poll>(&scenario);
            voting::vote(&mut poll, 0, ts::ctx(&mut scenario));
            ts::return_shared(poll);
        };

        ts::next_tx(&mut scenario, USER2);
        {
            let mut poll = ts::take_shared<Poll>(&scenario);
            voting::vote(&mut poll, 0, ts::ctx(&mut scenario));
            ts::return_shared(poll);
        };

        ts::next_tx(&mut scenario, ADMIN);
        {
            let mut poll = ts::take_shared<Poll>(&scenario);
            voting::vote(&mut poll, 1, ts::ctx(&mut scenario));
            
            let votes = voting::get_votes(&poll);
            assert!(*vector::borrow(&votes, 0) == 2, 0); // Option A should have 2 votes
            assert!(*vector::borrow(&votes, 1) == 1, 1); // Option B should have 1 vote
            assert!(*vector::borrow(&votes, 2) == 0, 2); // Option C should have 0 votes
            assert!(voting::get_voter_count(&poll) == 3, 3);

            ts::return_shared(poll);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }
}