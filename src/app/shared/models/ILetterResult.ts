export type LetterStatus = 'correct' | 'present' | 'absent' | 'pending';

export interface LetterResult {
  letter: string;
  status: LetterStatus;
}
