export const confirmIsDate = (date: String) => {
  if (
		date.split("-")[0].length === 4 &&
		date.split("-")[1].length === 2 &&
		date.split("-")[2].length === 2 &&
    +date.split("-")[1] <= 12 && +date.split("-")[1] >= 1 &&
    +date.split("-")[2] <= 30 && +date.split("-")[2] >= 1 
	) {
    return true;
	} 
  return false;
};
