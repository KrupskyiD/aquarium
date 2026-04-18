export const saltLimits = function (aquariumLimits, salt) {

    //check if the salt from gateway are in aquarium allowed limits 
        if (aquariumLimits.min_salt <= salt && salt <= aquariumLimits.max_salt) {
            return {
                text: "v normě",
                difference: 0
            };
            //check if the salt from gateway are under aquarium minimum allowed limit
        } else if (aquariumLimits.min_salt >= salt) {
            const saltDifference = aquariumLimits.min_salt - salt;
            return {
                text: "pod cílem",
                difference: saltDifference
            };
            //check if the salt from gateway are above aquarium minimum allowed limit
        } else {
            const saltDifference = aquariumLimits.max_salt - salt;
            return {
                text: "nad cílem",
                difference: saltDifference
            };
        }
    }