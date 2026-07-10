import type { FlowState, FlowAction } from "./types";

export const initialFlowState: FlowState = {
  stage: "idle",
  signoffChecked: false,
  bridgeStage: "ready",
  highStakes: false,
  hasGeneratedOnce: false,
  generationCount: 0,
};

export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "SYNTHESIZE_START":
      return { ...state, stage: "synthesizing" };
    case "SYNTHESIZE_COMPLETE":
      return { ...state, stage: "synthesized" };
    case "TOGGLE_SIGNOFF":
      return { ...state, signoffChecked: !state.signoffChecked };
    case "CONFIRM_SIGNOFF":
      return state.signoffChecked ? { ...state, stage: "signedOff" } : state;
    case "TOGGLE_HIGH_STAKES":
      return { ...state, highStakes: !state.highStakes };
    case "GENERATE_SUMMARY_START":
      return { ...state, bridgeStage: "generating" };
    case "GENERATE_SUMMARY_COMPLETE":
      return {
        ...state,
        bridgeStage: "generated",
        hasGeneratedOnce: true,
        generationCount: state.generationCount + 1,
      };
    case "RESET":
      return initialFlowState;
    default:
      return state;
  }
}
