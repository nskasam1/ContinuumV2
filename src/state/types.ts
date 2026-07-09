export type Stage = "idle" | "synthesizing" | "synthesized" | "signedOff";

export type BridgeStage = "ready" | "generating" | "generated";

export interface FlowState {
  stage: Stage;
  signoffChecked: boolean;
  bridgeStage: BridgeStage;
  highStakes: boolean;
  hasGeneratedOnce: boolean;
}

export type FlowAction =
  | { type: "SYNTHESIZE_START" }
  | { type: "SYNTHESIZE_COMPLETE" }
  | { type: "TOGGLE_SIGNOFF" }
  | { type: "CONFIRM_SIGNOFF" }
  | { type: "TOGGLE_HIGH_STAKES" }
  | { type: "GENERATE_SUMMARY_START" }
  | { type: "GENERATE_SUMMARY_COMPLETE" }
  | { type: "RESET" };
