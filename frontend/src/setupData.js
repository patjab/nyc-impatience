export const canvasWidth = 750
export const canvasHeight = 1334

export const horizonLine = 400

export const initialPeopleSizes = 150
export const depthMultiplier = 0.001

export const numOfBricksInARow = 10

export const walking = 0.50

export const shiftingSpeed = 10

export const nearnessSpook = 20

export const touristDensity = 3

export const playerStartX = (canvasWidth/2)-(initialPeopleSizes/2)
export const playerStartY = (canvasHeight)-(initialPeopleSizes*2)

export const movementsPerStage = 1000

export const loudnessSpookLevel = 0.8
export const loudnessRechargeInSeconds = 10

export const rendingTouristRowsPercentage = 0.50

export const touristRunningMilliseconds = 30

export const initialLives = 3
export const backgroundMusicOn = true

export const statusBarHeight = 90
export const numberOfHighScoresToDisplay = 15

// AFTER GAME
export const marginAroundStats = 100
export const paddingAroundStats = 20

export const brickColor = '#CBCBCB'
export const brickBorderColor = '#000000'
export const sideAreaColor = '#0CBE00'

//
// export convergenceAngle = () => {
//   const lengthOfGroundTriangle = this.props.canvas.height - this.horizonPosition
//   const widthOfGroundTriangle = this.props.canvas.width/2
//
//   const sideOfPath = Math.sqrt(Math.pow(lengthOfGroundTriangle, 2) + Math.pow(widthOfGroundTriangle, 2))
//   const numerator = (2 * Math.pow(sideOfPath, 2)) - Math.pow(this.props.canvas.width, 2)
//   const denominator = (2 * Math.pow(sideOfPath, 2))
//
//   return Math.acos(numerator/denominator)
// }
