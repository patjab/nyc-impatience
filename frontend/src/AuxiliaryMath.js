import { horizonLine, initialPeopleSizes, playerStartY } from './setupData'

export const modularWithNegative = (num, modBy) => ((num % modBy) + modBy) % modBy

export const howBigShouldIBe = (currentRow) => (currentRow - horizonLine) * ((initialPeopleSizes)/(playerStartY - horizonLine))
