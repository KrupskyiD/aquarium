export const tempLimits = function (aquariumLimits, temperature) {

        //check if the salt from gateway are in aquarium allowed limits 
        if (aquariumLimits.min_temp <= temperature && temperature <= aquariumLimits.max_temp) {
            return {
                text: "v normě",
                difference: 0
            };
            //check if the temperature from gateway are under aquarium minimum allowed limit
        } else if (aquariumLimits.min_temp >= temperature) {
            const saltDifference = aquariumLimits.min_temp - temperature;
            return {
                text: "pod cílem",
                difference: saltDifference
            };
            //check if the temperature from gateway are above aquarium minimum allowed limit
        } else {
            const saltDifference = aquariumLimits.max_temp - temperature;
            return {
                text: "nad cílem",
                difference: saltDifference
            };
        }
    }