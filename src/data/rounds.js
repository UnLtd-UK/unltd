import { pb } from "./pocketbase.js";
let rounds;

try {
    let pb_rounds = await pb.collection("rounds").getFullList(200);
    let pb_funds = await pb.collection("funds").getFullList(200);
    let pb_grants = await pb.collection("grants").getFullList(200);
    let pb_investments = await pb.collection("investments").getFullList(200);
    let pb_eligibility = await pb.collection("eligibility").getFullList(200);

    rounds = pb_rounds.map((round) => {
        pb_funds.map((fund) => {
            if (round.fund == fund.id) {
                round.fund = fund
            }
        });

        pb_grants.map((grant) => {
            if (grant.round == round.id) {
                if (!round.hasOwnProperty("grants")) {
                    round.grants = [];
                }
                round.grants.push(grant);
            }
        });

        pb_investments.map((investment) => {
            if (investment.round == round.id) {
                if (!round.hasOwnProperty("investments")) {
                    round.investments = [];
                }
                round.investments.push(investment);
            }
        });

        return round;
    });

} catch (error) {
    console.error("Error:", error);
}

export { rounds }