
//salt restriction
export const saltRestriction = async function(data, parsedData) {

    //if saltData is empty
    if(data.length === 0){
        //save salt to gateway memory
        data.push(parsedData[2]);

        return data;
    }
    //if numbers are equal
    else if(data[0] === parsedData[2]){
        return 'SALT_NUMBERS_ARE_EQUAL';

    } else if(data[0] !== parsedData[2]){
        data.shift();
        data.push(parsedData[2]);

        return data;
    }
}
//temp restriction
export const tempRestriction = async function(data, parsedData) {
    //if saltData is empty
    if(data.length === 0){
        //save temperature to gateway memory
        data.push(parsedData[1]);

        return data;
    }

    //if temperatures are equal
    if(data[0] === parsedData[1]){
        return 'TEMP_NUMBERS_ARE_EQUAL';
        
        //if temperatures aren't equal
    } else if(data[0] !== parsedData[1]){
        //delete old temperature
        data.shift();

        //saves new temperature
        data.push(parsedData[1]);

        return data;
    }
}

