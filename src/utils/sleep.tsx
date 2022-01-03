export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// interface characterSize {
//   char: string;
//   count: number;
// }
// export const getMostRepeatedCharacter = (
//   inputString: string
// ): string | number => {
//   // Your solution starts here.
//   if (inputString.length === 0) return "";
//   let charArray: characterSize[] = [];
//   let frequentCharacter = inputString[0];
//   let maxCount = 1;

//   for (var i = 0; i < inputString.length; i++) {
//     let foundChar = false;
//     for (var j = 0; j < charArray.length; j++) {
//       if (charArray[j].char === inputString[i]) {
//         foundChar = true;
//         const currentLen = charArray[j].count + 1;
//         console.log(charArray[j]);
//         charArray[j] = { char: inputString[i], count: currentLen };
//         if (currentLen > maxCount) {
//           maxCount++;
//           frequentCharacter = inputString[i];
//         }
//       }
//     }
//     if (!foundChar) charArray.push({ char: inputString[i], count: 1 });
//   }

//   return frequentCharacter;
// };
