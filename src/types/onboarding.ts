export interface OnboardingStatusResponse {
  isCompleted: boolean;
  currentStep: number;
  draft: Record<string, any>;
}

export interface OnboardingDraftRequest {
  [key: string]: any;
}

export interface OnboardingCompleteResponse {
  isCompleted: boolean;
}
