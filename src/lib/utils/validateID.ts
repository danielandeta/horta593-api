export function validateID(nationID: string) {
  if (nationID.length === 10) {
    const regionDigit = nationID.substring(0, 2);

    if (regionDigit >= String(0) && regionDigit <= String(24)) {
      const lastDigit = Number(nationID.substring(9, 10));

      const even =
        Number(nationID.substring(1, 2)) +
        Number(nationID.substring(3, 4)) +
        Number(nationID.substring(5, 6)) +
        Number(nationID.substring(7, 8));

      let numberOne: any = nationID.substring(0, 1);
      numberOne = numberOne * 2;
      if (numberOne > 9) {
        numberOne = numberOne - 9;
      }

      let numberTree: any = nationID.substring(2, 3);
      numberTree = numberTree * 2;
      if (numberTree > 9) {
        numberTree = numberTree - 9;
      }

      let numberFive: any = nationID.substring(4, 5);
      numberFive = numberFive * 2;
      if (numberFive > 9) {
        numberFive = numberFive - 9;
      }

      let numberSeven: any = nationID.substring(6, 7);
      numberSeven = numberSeven * 2;
      if (numberSeven > 9) {
        numberSeven = numberSeven - 9;
      }

      let numberNine: any = nationID.substring(8, 9);
      numberNine = numberNine * 2;
      if (numberNine > 9) {
        numberNine = numberNine - 9;
      }

      const odd =
        numberOne + numberTree + numberFive + numberSeven + numberNine;

      const totalSum = even + odd;

      const firstDigitSum = String(totalSum).substring(0, 1);

      const ten = (Number(firstDigitSum) + 1) * 10;

      let validatorDigit = ten - totalSum;

      if (validatorDigit === 10) {
        validatorDigit = 0;
      }

      if (validatorDigit === lastDigit) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}
