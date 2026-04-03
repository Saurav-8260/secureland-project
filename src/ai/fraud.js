export function checkFraud(landId, ownerName){

// simple AI logic example

if(landId <= 0){
return "Invalid Land ID";
}

if(ownerName.length < 3){
return "Owner name suspicious";
}

return "Safe";

}