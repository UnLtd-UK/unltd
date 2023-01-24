import { pb } from "./pocketbase.js";
let funding;

try {
    let pb_rounds = await pb.collection("rounds").getFullList(200);
    let pb_funds = await pb.collection("funds").getFullList(200);
    let pb_grants = await pb.collection("grants").getFullList(200);
    let pb_investments = await pb.collection("investments").getFullList(200);
    let pb_eligibility = await pb.collection("eligibility").getFullList(200);

    funding = pb_grants.map((grant) => {

        pb_rounds.map((round) => {

            function dateCleaner(date) {
                return new Date(date).toISOString().substring(0, 10);
            };

            if (round.open) {
                round.open = dateCleaner(round.open);
            }

            if (round.closed) {
                round.closed = dateCleaner(round.closed);
            }

            if (grant.round == round.id) {
                grant.round = round
            }

            pb_funds.map((fund) => {
                if (round.fund == fund.id) {
                    round.fund = fund
                }
            });
        });

        return grant;
    });

} catch (error) {
    console.error("Error:", error);
}

export { funding }