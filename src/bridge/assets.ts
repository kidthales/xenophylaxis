export enum PackFile {
  Key = 'configs/assets',
  Url = 'assets/configs/assets.json'
}

export enum RequiredAssets {
  PackKey = 'required',
  TitleSceneHtml = 'html/title-scene',
  DemoNarrativeASceneHtml = 'html/demo-narrative-a-scene',
  DemoNarrativeBSceneHtml = 'html/demo-narrative-b-scene',
  StellarNeighborhoodAseprite = 'animations/stellar-neighborhood',
  XoninAseprite = 'animations/xonin'
}

export enum StellarNeighborhoodAnimations {
  Start = 'stellar-neighborhood Start',
  Peel = 'stellar-neighborhood Peel',
  End = 'stellar-neighborhood End',
  LabelledEnd = 'stellar-neighborhood Labelled End'
}

export enum XoninAnimations {
  IdleRight = 'xonin Idle Right',
  IdleLeft = 'xonin Idle Left',
  RunRight = 'xonin Run Right',
  RunLeft = 'xonin Run Left',
  JumpRight = 'xonin Jump Right',
  JumpLeft = 'xonin Jump Left',
  RiseRight = 'xonin Rise Right',
  RiseLeft = 'xonin Rise Left',
  FallRight = 'xonin Fall Right',
  FallLeft = 'xonin Fall Left',
  LandRight = 'xonin Land Right',
  LandLeft = 'xonin Land Left',
  DeadRight = 'xonin Dead Right',
  DeadLeft = 'xonin Dead Left',
  ThumbsUpRight = 'xonin Thumbs Up Right',
  ThumbsUpLeft = 'xonin Thumbs Up Left',

  BladeLowIdleRight = 'xonin Blade Low Idle Right',
  BladeLowIdleLeft = 'xonin Blade Low Idle Left',
  BladeMidIdleRight = 'xonin Blade Mid Idle Right',
  BladeMidIdleLeft = 'xonin Blade Mid Idle Left',
  BladeHighIdleRight = 'xonin Blade High Idle Right',
  BladeHighIdleLeft = 'xonin Blade High Idle Left',
  BladeLowRunRight = 'xonin Blade Low Run Right',
  BladeLowRunLeft = 'xonin Blade Low Run Left',
  BladeMidRunRight = 'xonin Blade Mid Run Right',
  BladeMidRunLeft = 'xonin Blade Mid Run Left',
  BladeHighRunRight = 'xonin Blade High Run Right',
  BladeHighRunLeft = 'xonin Blade High Run Left',
  BladeLowJumpRight = 'xonin Blade Low Jump Right',
  BladeLowJumpLeft = 'xonin Blade Low Jump Left',
  BladeMidJumpRight = 'xonin Blade Mid Jump Right',
  BladeMidJumpLeft = 'xonin Blade Mid Jump Left',
  BladeHighJumpRight = 'xonin Blade High Jump Right',
  BladeHighJumpLeft = 'xonin Blade High Jump Left',
  BladeLowRiseRight = 'xonin Blade Low Rise Right',
  BladeLowRiseLeft = 'xonin Blade Low Rise Left',
  BladeMidRiseRight = 'xonin Blade Mid Rise Right',
  BladeMidRiseLeft = 'xonin Blade Mid Rise Left',
  BladeHighRiseRight = 'xonin Blade High Rise Right',
  BladeHighRiseLeft = 'xonin Blade High Rise Left',
  BladeLowFallRight = 'xonin Blade Low Fall Right',
  BladeLowFallLeft = 'xonin Blade Low Fall Left',
  BladeMidFallRight = 'xonin Blade Mid Fall Right',
  BladeMidFallLeft = 'xonin Blade Mid Fall Left',
  BladeHighFallRight = 'xonin Blade High Fall Right',
  BladeHighFallLeft = 'xonin Blade High Fall Left',
  BladeLowLandRight = 'xonin Blade Low Land Right',
  BladeLowLandLeft = 'xonin Blade Low Land Left',
  BladeMidLandRight = 'xonin Blade Mid Land Right',
  BladeMidLandLeft = 'xonin Blade Mid Land Left',
  BladeHighLandRight = 'xonin Blade High Land Right',
  BladeHighLandLeft = 'xonin Blade High Land Left',
  BladeLowSlashRight = 'xonin Blade Low Slash Right',
  BladeLowSlashLeft = 'xonin Blade Low Slash Left',
  BladeMidSlashRight = 'xonin Blade Mid Slash Right',
  BladeMidSlashLeft = 'xonin Blade Mid Slash Left',
  BladeHighSlashRight = 'xonin Blade High Slash Right',
  BladeHighSlashLeft = 'xonin Blade High Slash Left',
  BladeDeadRight = 'xonin Blade Dead Right',
  BladeDeadLeft = 'xonin Blade Dead Left',

  BlasterLowIdleRight = 'xonin Blaster Low Idle Right',
  BlasterLowIdleLeft = 'xonin Blaster Low Idle Left',
  BlasterMidIdleRight = 'xonin Blaster Mid Idle Right',
  BlasterMidIdleLeft = 'xonin Blaster Mid Idle Left',
  BlasterHighIdleRight = 'xonin Blaster High Idle Right',
  BlasterHighIdleLeft = 'xonin Blaster High Idle Left',
  BlasterLowRunRight = 'xonin Blaster Low Run Right',
  BlasterLowRunLeft = 'xonin Blaster Low Run Left',
  BlasterMidRunRight = 'xonin Blaster Mid Run Right',
  BlasterMidRunLeft = 'xonin Blaster Mid Run Left',
  BlasterHighRunRight = 'xonin Blaster High Run Right',
  BlasterHighRunLeft = 'xonin Blaster High Run Left',
  BlasterLowJumpRight = 'xonin Blaster Low Jump Right',
  BlasterLowJumpLeft = 'xonin Blaster Low Jump Left',
  BlasterMidJumpRight = 'xonin Blaster Mid Jump Right',
  BlasterMidJumpLeft = 'xonin Blaster Mid Jump Left',
  BlasterHighJumpRight = 'xonin Blaster High Jump Right',
  BlasterHighJumpLeft = 'xonin Blaster High Jump Left',
  BlasterLowRiseRight = 'xonin Blaster Low Rise Right',
  BlasterLowRiseLeft = 'xonin Blaster Low Rise Left',
  BlasterMidRiseRight = 'xonin Blaster Mid Rise Right',
  BlasterMidRiseLeft = 'xonin Blaster Mid Rise Left',
  BlasterHighRiseRight = 'xonin Blaster High Rise Right',
  BlasterHighRiseLeft = 'xonin Blaster High Rise Left',
  BlasterLowFallRight = 'xonin Blaster Low Fall Right',
  BlasterLowFallLeft = 'xonin Blaster Low Fall Left',
  BlasterMidFallRight = 'xonin Blaster Mid Fall Right',
  BlasterMidFallLeft = 'xonin Blaster Mid Fall Left',
  BlasterHighFallRight = 'xonin Blaster High Fall Right',
  BlasterHighFallLeft = 'xonin Blaster High Fall Left',
  BlasterLowLandRight = 'xonin Blaster Low Land Right',
  BlasterLowLandLeft = 'xonin Blaster Low Land Left',
  BlasterMidLandRight = 'xonin Blaster Mid Land Right',
  BlasterMidLandLeft = 'xonin Blaster Mid Land Left',
  BlasterHighLandRight = 'xonin Blaster High Land Right',
  BlasterHighLandLeft = 'xonin Blaster High Land Left',
  BlasterDeadRight = 'xonin Blaster Dead Right',
  BlasterDeadLeft = 'xonin Blaster Dead Left'
}
