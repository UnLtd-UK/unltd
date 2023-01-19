import { pb } from "./pocketbase.js";
let funds;

try {
    let pb_funds = await pb.collection("funds").getFullList(200);
    let pb_rounds = await pb.collection("rounds").getFullList(200);
    let pb_grants = await pb.collection("grants").getFullList(200);
    let pb_investments = await pb.collection("investments").getFullList(200);
    let pb_eligibility = await pb.collection("eligibility").getFullList(200);
    let pb_organisations = await pb.collection("organisations").getFullList(200);

    funds = pb_funds.map(fund => {
        let funders = []
        fund.funders.map(funder => {
            pb_organisations.map(organisation => {
                if (funder == organisation.id) {
                    funders.push(organisation);
                }
            })
        })
        fund.funders = funders;

        let partners = []
        fund.partners.map(partner => {
            pb_organisations.map(organisation => {
                if (partner == organisation.id) {
                    partners.push(organisation);
                }
            })
        })
        fund.partners = partners;


        pb_rounds.map(round => {
            if (fund.id == round.fund) {
                if (!fund.hasOwnProperty("rounds")) {
                    fund.rounds = [];
                }
                let indexRound = fund.rounds.push(round) - 1;

                pb_grants.map(grant => {
                    if (round.id == grant.round) {
                        if (!fund.rounds[indexRound].hasOwnProperty("grants")) {
                            fund.rounds[indexRound].grants = [];
                        }

                        fund.rounds[indexRound].grants.push(grant);
                    }
                });

                pb_investments.map(investment => {
                    if (round.id == investment.round) {
                        if (!fund.rounds[indexRound].hasOwnProperty("investments")) {
                            fund.rounds[indexRound].investments = [];
                        }

                        fund.rounds[indexRound].investments.push(investment);
                    }
                });
            }
        });

        return fund;
    });

} catch (error) {
    console.error("Error:", error);
}

export { funds }