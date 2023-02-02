import { pb } from "./pocketbase.js";
import { marked } from 'marked';
let investments;

try {
    let pb_rounds = await pb.collection("rounds").getFullList(200);
    let pb_funds = await pb.collection("funds").getFullList(200);
    let pb_investments = await pb.collection("investments").getFullList(200);
    let pb_eligibility = await pb.collection("eligibility").getFullList(200);
    let pb_applications = await pb.collection("applications").getFullList(200);

    investments = pb_investments.map((investment) => {

        pb_eligibility.map(eligibility => {
            if (eligibility.hasOwnProperty(investments) && eligibility.investments.length > 0) {
                eligibility.investments.map(inv => {
                    if (inv == investment.id) {
                        eligibility.social_entrepreneur = marked.parse(eligibility.social_entrepreneur)
                        eligibility.social_venture = marked.parse(eligibility.social_venture)
                        investment.eligibility = eligibility
                    }
                })
            }

            if (investment.hasOwnProperty("eligibility")) {
                investment.eligibility.applications = []

                pb_applications.map(application => {
                    application.eligibility.map(eli => {
                        if (eli == eligibility.id) {
                            investment.eligibility.applications.push(application);
                        }
                    })
                })
            }

        })

        pb_rounds.map((round) => {
            if (investment.round == round.id) {
                investment.round = round
            }

            pb_funds.map((fund) => {
                if (round.fund == fund.id) {
                    round.fund = fund
                }
            });
        });

        return investment;
    });

} catch (error) {
    console.error("Error:", error);
}

export { investments }