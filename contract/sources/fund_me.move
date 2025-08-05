module FundMe::fund_me {
    use std::signer;
    use std::string;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use std::table;

    /// Each campaign struct
    struct Campaign has copy, drop, store {
        id: u64,
        title: string::String,
        description: string::String,
        owner: address,
        total_amount: u64,
        fund_raised: u64,
    }

    struct CampaignSummary has copy, drop, store {
        id: u64,
        title: string::String,
    }

    /// Storage of all campaigns under each owner
    struct Campaigns has key {
        campaigns: table::Table<u64, Campaign>,
        count: u64,
    }

    /// Initialize for an account
    public entry fun initialize(account: &signer) {
        let owner = signer::address_of(account);
        assert!(!exists<Campaigns>(owner), 1);
        move_to(account, Campaigns {
            campaigns: table::new<u64, Campaign>(),
            count: 0,
        });
    }

    /// Create API — Creates a new campaign
    public entry fun create_campaign(account: &signer, title: string::String, description: string::String, total_amount: u64) acquires Campaigns {
        let owner = signer::address_of(account);
        let campaigns_ref = borrow_global_mut<Campaigns>(owner);
        let id = campaigns_ref.count;

        let campaign = Campaign {
            id,
            title,
            description,
            owner,
            total_amount,
            fund_raised: 0,
        };

        table::add(&mut campaigns_ref.campaigns, id, campaign);
        campaigns_ref.count = id + 1;
    }

    /// Update (Add) API — Contribute APT and update `fund_raised`
    public entry fun contribute(account: &signer, owner: address, id: u64, amount: u64) acquires Campaigns {
        let campaigns_ref = borrow_global_mut<Campaigns>(owner);
        let campaign = table::borrow_mut(&mut campaigns_ref.campaigns, id);

        // Transfer APT
        coin::transfer<AptosCoin>(account, campaign.owner, amount);

        // Update fund raised
        campaign.fund_raised = campaign.fund_raised + amount;
    }

    /// Get API — Read a specific campaign by id
    #[view]
    public fun get_campaign(owner: address, id: u64): Campaign acquires Campaigns {
        let campaigns_ref = borrow_global<Campaigns>(owner);
        let campaign_ref = table::borrow(&campaigns_ref.campaigns, id);
        Campaign {
            id: campaign_ref.id,
            title: campaign_ref.title,
            description: campaign_ref.description,
            owner: campaign_ref.owner,
            total_amount: campaign_ref.total_amount,
            fund_raised: campaign_ref.fund_raised,
        }
    }

    /// Get campaign summary for frontend compatibility (only primitive fields)
    public fun get_campaign_summary(owner: address, id: u64): (u64, string::String, u64, u64) acquires Campaigns {
        let campaigns_ref = borrow_global<Campaigns>(owner);
        let campaign_ref = table::borrow(&campaigns_ref.campaigns, id);
        (campaign_ref.id, campaign_ref.title, campaign_ref.total_amount, campaign_ref.fund_raised)
    }

    public fun get_all_campaign_ids(owner: address): vector<u64> acquires Campaigns {
    let campaigns_ref = borrow_global<Campaigns>(owner);
    let ids = vector::empty<u64>();
    let i = 0;
    while (i < campaigns_ref.count) {
        vector::push_back(&mut ids, i);
        i = i + 1;
    };
    ids
}

    /// (Optional) Get all campaigns for a user — returns all campaign IDs
    #[view]
    public fun get_all_campaign_summaries(owner: address): vector<CampaignSummary> acquires Campaigns {
        let campaigns_ref = borrow_global<Campaigns>(owner);
        let summaries = vector::empty<CampaignSummary>();
        let i = 0;
        while (i < campaigns_ref.count) {
            if (table::contains(&campaigns_ref.campaigns, i)) {
                let campaign_ref = table::borrow(&campaigns_ref.campaigns, i);
                let summary = CampaignSummary {
                    id: campaign_ref.id,
                    title: campaign_ref.title,
                };
                vector::push_back(&mut summaries, summary);
            };
            i = i + 1;
        };
        summaries
    }
    /// Delete API — Removes a campaign by ID if called by the owner
    public entry fun delete_campaign(account: &signer, id: u64) acquires Campaigns {
        let owner = signer::address_of(account);
        let campaigns_ref = borrow_global_mut<Campaigns>(owner);

        // Ensure campaign exists
        let _ = table::remove(&mut campaigns_ref.campaigns, id);
    }
}