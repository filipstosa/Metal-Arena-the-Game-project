const makeStandingFrames = (rootFrame = 0) => {
  return {
    duration: 2000,
    frames: [
      {
        time: 0,
        frame: rootFrame,
      },
      {
        time: 1400,
        frame: rootFrame + 4,
      },
    ],
  };
};

const makeWalkingFrames = (rootFrame = 0) => {
  return {
    duration: 400,
    frames: [
      {
        time: 0,
        frame: rootFrame + 8,
      },
      {
        time: 100,
        frame: rootFrame,
      },
      {
        time: 200,
        frame: rootFrame + 12,
      },
      {
        time: 300,
        frame: rootFrame,
      },
    ],
  };
};

const makeHeroAttackFrames = (rootFrame = 0) => {
  return {
    duration: 200,
    frames: [
      {
        time: 0,
        frame: rootFrame + 16,
      },

      {
        time: 100,
        frame: rootFrame + 20,
      },
    ],
  };
};

const makeHeroLightUpFrames = (rootFrame = 0) => {
  return {
    duration: 400,
    frames: [
      {
        time: 0,
        frame: rootFrame + 28,
      },

      {
        time: 100,
        frame: rootFrame,
      },

      {
        time: 200,
        frame: rootFrame + 28,
      },

      {
        time: 300,
        frame: rootFrame,
      },
    ],
  };
};

export const STAND_DOWN = makeStandingFrames(0);
export const STAND_LEFT = makeStandingFrames(1);
export const STAND_UP = makeStandingFrames(2);
export const STAND_RIGHT = makeStandingFrames(3);

export const WALK_DOWN = makeWalkingFrames(0);
export const WALK_LEFT = makeWalkingFrames(1);
export const WALK_UP = makeWalkingFrames(2);
export const WALK_RIGHT = makeWalkingFrames(3);

export const BASIC_ATTACK_DOWN = makeHeroAttackFrames(0);
export const BASIC_ATTACK_LEFT = makeHeroAttackFrames(1);
export const BASIC_ATTACK_UP = makeHeroAttackFrames(2);
export const BASIC_ATTACK_RIGHT = makeHeroAttackFrames(3);

export const LIGHT_UP_DOWN = makeHeroLightUpFrames(0);
export const LIGHT_UP_LEFT = makeHeroLightUpFrames(1);
export const LIGHT_UP_UP = makeHeroLightUpFrames(2);
export const LIGHT_UP_RIGHT = makeHeroLightUpFrames(3);
