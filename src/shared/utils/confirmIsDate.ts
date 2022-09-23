export const confirmIsDate = (date: Date) => {
	if (
		date.toString().split("-")[0].length === 4 &&
		date.toString().split("-")[1].length === 2 &&
		date.toString().split("-")[2].length === 2 &&
    +date.toString().split("-")[1] <= 12 && +date.toString().split("-")[1] >= 1 &&
    +date.toString().split("-")[2] <= 30 && +date.toString().split("-")[2] >= 1 
	) {
    return true;
	} else if (date.toString().split(" ")[0].length === 3 && date.toString().split(" ")[1].length === 3){
		return true;
	} 
  return false;
};
